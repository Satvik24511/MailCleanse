import Service from '../models/Service.model.js';
import User from '../models/User.model.js';
import { getGmailClient } from '../lib/gmailClient.js';


export const getSubscriptions = async (req, res) => {
    try {
        const user = req.user;
        console.log('User at start of getSubscriptions:', {
            id: user._id,
            email: user.email,
            servicesCount: user.services?.length,
            totalServicesCount: user.totalServices
        });

        const gmail = await getGmailClient(user);
        const allFetchedSubscriptions = [];
        let pageToken = null;

        let listQuery = 'in:inbox unsubscribe OR "unsubscribe"';
        
        let lastScanDate = user.lastScanDate || null;
        if (lastScanDate) {
            listQuery += ` after:${Math.floor(lastScanDate.getTime() / 1000)}`;
        }


        do {
            const messagesResponse = await gmail.users.messages.list({
                userId: 'me',
                q: listQuery,
                maxResults: 50, 
                pageToken: pageToken
            });

            const messagesBatch = messagesResponse.data.messages || [];

            if (messagesBatch.length > 0) {
                const messagePromises = messagesBatch.map(msgSummary =>
                    gmail.users.messages.get({
                        userId: 'me',
                        id: msgSummary.id,
                        format: 'full'
                    })
                );

                const fullMessages = await Promise.all(messagePromises);

                for (const fullMessageResponse of fullMessages) {
                    try {
                        const fullMessage = fullMessageResponse.data;
                        const headers = fullMessage.payload.headers;

                        let unsubscribeUrl = null;
                        let oneClickPost = false;
                        let sender = 'Unknown Sender';
                        let subject = 'No Subject';

                        for (const header of headers) {
                            const headerName = header.name.toLowerCase();
                            if (headerName === 'list-unsubscribe') {
                                const urls = header.value.match(/<(https?:\/\/[^>]+)>/g);

                                if (urls && urls.length > 0) {
                                    unsubscribeUrl = urls[0].slice(1, -1); 
                                }
                            } else if (headerName === 'list-unsubscribe-post' && header.value.toLowerCase() === 'list-unsubscribe=one-click') {
                                oneClickPost = true;
                            } else if (headerName === 'from') {
                                sender = header.value;
                            } else if (headerName === 'subject') {
                                subject = header.value;
                            }
                        }

                        if (unsubscribeUrl) {
                            allFetchedSubscriptions.push({
                                messageId: fullMessage.id,
                                threadId: fullMessage.threadId,
                                sender: sender,
                                subject: subject,
                                unsubscribeUrl: unsubscribeUrl,
                                oneClickPost: oneClickPost,
                                date: parseInt(fullMessage.internalDate),
                                snippet: fullMessage.snippet || ''
                            });
                        }
                    } catch (msgError) {
                        console.warn(`Error processing full message details:`, msgError.message);
                    }
                }
            }
            pageToken = messagesResponse.data.nextPageToken;

            if (pageToken) {
                console.log(`Fetched a batch of ${messagesBatch.length} messages. Waiting before next batch...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } while (pageToken);


        const servicesDataMap = new Map();

        for (const sub of allFetchedSubscriptions) {
            const emailMatch = sub.sender.match(/<(.+?)>/) || [null, sub.sender];
            const emailId = emailMatch[1] ? emailMatch[1].toLowerCase().trim() : sub.sender.toLowerCase().trim();
            if (!emailId) continue;

            const newEmailDate = new Date(sub.date);

            if (!servicesDataMap.has(emailId)) {
                servicesDataMap.set(emailId, {
                    latestEmail: sub,
                    allRecentEmailsForSender: [sub],
                    unsubscribeUrl: sub.unsubscribeUrl,
                    oneClickPost: sub.oneClickPost,
                    domain: (emailId.includes('@') ? emailId.split('@')[1] : null)
                });
            } else {
                const existingData = servicesDataMap.get(emailId);
                const existingDate = new Date(existingData.latestEmail.date);

                if (newEmailDate > existingDate) {
                    existingData.latestEmail = sub;
                    existingData.unsubscribeUrl = sub.unsubscribeUrl || existingData.unsubscribeUrl;
                    existingData.unsubscribeMailto = sub.unsubscribeMailto || existingData.unsubscribeMailto;
                    existingData.oneClickPost = sub.oneClickPost || existingData.oneClickPost;
                }
                existingData.allRecentEmailsForSender.push(sub);
            }
        }

        const currentServiceIds = new Set(user.services.map(s => s.toString()));
        let totalServicesAdded = 0;

        const updatedServicesPromises = Array.from(servicesDataMap.entries()).map(async ([emailId, data]) => {
            try {
                const senderName = data.latestEmail.sender.split('<')[0].trim() || emailId;
                const domain = data.domain;

                const recentEmails = data.allRecentEmailsForSender
                    .sort((a, b) => b.date - a.date)
                    .slice(0, 5)
                    .map(sub => ({
                        subject: sub.subject,
                        date: new Date(sub.date),
                        snippet: sub.snippet || ''
                    }));

                const service = await Service.findOneAndUpdate(
                    { emailId: emailId },
                    {
                        name: senderName,
                        description: `Subscription service from ${emailId}`,
                        iconUrl: domain ? `https://www.google.com/s2/favicons?domain=${domain}` : null,
                        domain: domain,
                        emailCount: data.allRecentEmailsForSender.length,
                        lastEmailSubject: data.latestEmail.subject,
                        lastEmailDate: new Date(data.latestEmail.date),
                        recentEmails: recentEmails,
                        unsubscribeUrl: data.unsubscribeUrl,
                        unsubscribeMailto: data.unsubscribeMailto,
                        oneClickPost: data.oneClickPost,
                    },
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }
                );

                if (service && !currentServiceIds.has(service._id.toString())) {
                    user.services.push(service._id);
                    totalServicesAdded += 1;
                }
                return service;
            } catch (error) {
                console.error('Error creating/updating service for', emailId, ':', error);
                return null;
            }
        });

        const newOrUpdatedServices = (await Promise.all(updatedServicesPromises)).filter(s => s !== null);

        if (totalServicesAdded > 0) {
            user.totalServices = (user.totalServices || 0) + totalServicesAdded;
            await user.save();
        }

        user.lastScanDate = new Date();
        await user.save();

        const updatedUser = await User.findById(user._id).populate({
            path: 'services',
            options: { sort: { lastEmailDate: -1 } }
        });
        
        req.user = updatedUser;

        console.log('Final services count processed:', newOrUpdatedServices.length);
        console.log('User after update (fetched from DB):', {
            id: updatedUser._id,
            email: updatedUser.email,
            servicesCount: updatedUser.services?.length,
            totalServicesCount: updatedUser.totalServices
        });

        res.json({
            services: updatedUser.services,
            totalServicesCount: updatedUser.totalServices
        });

    } catch (error) {
        console.error('Error in getSubscriptions:', error);
        res.status(500).json({ message: 'Failed to fetch subscriptions: ' + error.message });
    }
};


export const unsubscribeService = async (req, res) => {
    const { serviceId } = req.params;
    const user = req.user;

    try {
        const service = await Service.findOne({ _id: serviceId });

        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        if (!user.services.includes(service._id)) {
             return res.status(403).json({ message: 'Unauthorized: Service does not belong to this user.' });
        }

        let unsubscribeAttempted = false;
        let successMessage = '';
        let redirectionUrl = null;

        if (service.oneClickPost && service.unsubscribeUrl) {
            console.log(`Attempting one-click unsubscribe for ${service.emailId} via POST to ${service.unsubscribeUrl}`);
            try {
                await axios.post(service.unsubscribeUrl, null, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded' 
                    }
                });
                unsubscribeAttempted = true;
                successMessage = 'Successfully sent one-click unsubscribe request.';
                console.log(`One-click unsubscribe successful for ${service.emailId}`);
            } catch (postError) {
                console.warn(`One-click unsubscribe POST failed for ${service.emailId}:`, postError.message);
            }
        }

        if (!unsubscribeAttempted && service.unsubscribeUrl) {
            console.log(`Using standard unsubscribe URL for ${service.emailId}: ${service.unsubscribeUrl}`);
            redirectionUrl = service.unsubscribeUrl;
            successMessage = 'Please complete the unsubscribe process in the new tab.';
            unsubscribeAttempted = true;
        }

        if (!unsubscribeAttempted) {
            return res.status(400).json({ message: 'No valid unsubscribe method found for this service.' });
        }

        service.isUnsubscribed = true;
        await service.save();

        res.json({
            message: successMessage,
            redirectionUrl: redirectionUrl
        });

    } catch (error) {
        console.error('Error in unsubscribeService:', error);
        res.status(500).json({ message: 'Failed to unsubscribe: ' + error.message });
    }
};