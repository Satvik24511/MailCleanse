import Service from '../models/Service.model.js';
import User from '../models/User.model.js';
import { getGmailClient } from '../lib/gmailClient.js';
import {connectDB} from '../lib/db.js';
import axios from 'axios';


export const getSubscriptions = async (req, res) => {
    const startTime = Date.now(); 

    try {
        await connectDB();

        const user = req.user; 
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        const gmail = await getGmailClient(user);
        const allFetchedSubscriptions = [];
        let pageToken = null;

        let listQuery = 'in:inbox unsubscribe OR "unsubscribe"';

        if (user.lastScanDate) { 
            listQuery += ` after:${Math.floor(user.lastScanDate.getTime() / 1000)}`;
        }

        let pagesProcessed = 0;
        const maxPagesPerInvocation = 20;

        do {
            const currentTime = Date.now();
            if ((currentTime - startTime) > 280) {
                console.warn(`Scan for user ${user.email} timed out after processing ${pagesProcessed} pages.`);
                break;
            }

            const messagesResponse = await gmail.users.messages.list({
                userId: 'me',
                q: listQuery,
                maxResults: 50, 
                pageToken: pageToken
            });

            const messagesBatch = messagesResponse.data.messages || [];

            if (messagesBatch.length === 0) {
                console.log(`No more messages found for user ${user.email}.`);
                pageToken = null; 
                break;
            }

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
                    let unsubscribeMailto = null;
                    let oneClickPost = false;
                    let sender = 'Unknown Sender';
                    let subject = 'No Subject';

                    for (const header of headers) {
                        const headerName = header.name.toLowerCase();
                        if (headerName === 'list-unsubscribe') {
                            const urls = header.value.match(/<(https?:\/\/[^>]+)>/g);
                            const mailtos = header.value.match(/<(mailto:[^>]+)>/g);

                            if (urls && urls.length > 0) {
                                unsubscribeUrl = urls[0].slice(1, -1);
                            }
                            if (mailtos && mailtos.length > 0) {
                                unsubscribeMailto = mailtos[0].slice(1, -1);
                            }
                        } else if (headerName === 'list-unsubscribe-post' && header.value.toLowerCase() === 'list-unsubscribe=one-click') {
                            oneClickPost = true;
                        } else if (headerName === 'from') {
                            sender = header.value;
                        } else if (headerName === 'subject') {
                            subject = header.value;
                        }
                    }

                    if (unsubscribeUrl || unsubscribeMailto) {
                        allFetchedSubscriptions.push({
                            messageId: fullMessage.id,
                            threadId: fullMessage.threadId,
                            sender: sender,
                            subject: subject,
                            unsubscribeUrl: unsubscribeUrl,
                            unsubscribeMailto: unsubscribeMailto,
                            oneClickPost: oneClickPost,
                            date: parseInt(fullMessage.internalDate),
                            snippet: fullMessage.snippet || ''
                        });
                    }
                } catch (msgError) {
                    console.warn(`Error processing full message details (ID: ${fullMessageResponse.data?.id}):`, msgError.message);
                }
            }

            pageToken = messagesResponse.data.nextPageToken;
            pagesProcessed++;

            if (pageToken) {
                await new Promise(resolve => setTimeout(resolve, 500));
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
                    unsubscribeMailto: sub.unsubscribeMailto,
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

        let totalServicesAddedInThisRun = 0;
        const batchServiceUpdates = [];

        for (const [emailId, data] of servicesDataMap.entries()) {
            const senderName = data.latestEmail.sender.split('<')[0].trim() || emailId;
            const domain = data.domain;

            const recentEmails = data.allRecentEmailsForSender
                .sort((a, b) => b.date - a.date)
                .slice(0, 5) 
                .map(sub => ({
                    messageId: sub.messageId,
                    subject: sub.subject,
                    date: new Date(sub.date),
                    snippet: sub.snippet || ''
                }));

            batchServiceUpdates.push(
                Service.findOneAndUpdate(
                    { emailId: emailId },
                    {
                        name: senderName,
                        description: `Subscription service from ${emailId}`,
                        iconUrl: domain ? `https://www.google.com/s2/favicons?domain=${domain}` : null,
                        domain: domain,
                        $inc: { emailCount: data.allRecentEmailsForSender.length },
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
                )
            );
        }

        const newOrUpdatedServices = (await Promise.all(batchServiceUpdates)).filter(s => s !== null);

        const userServicesToAdd = [];
        for (const service of newOrUpdatedServices) {
            if (service && !user.services.includes(service._id)) { 
                 userServicesToAdd.push(service._id);
                totalServicesAddedInThisRun += 1;
            }
        }

        if (userServicesToAdd.length > 0) {
            user.services.push(...userServicesToAdd);
            user.totalServices = (user.totalServices || 0) + totalServicesAddedInThisRun;
        }

        user.lastScanDate = new Date(); 

        await user.save(); 

        const updatedUser = await User.findById(user._id).populate({
            path: 'services',
            options: { sort: { lastEmailDate: -1 } }
        });

        req.user = updatedUser; 

        res.json({
            services: updatedUser.services,
            totalServicesCount: updatedUser.totalServices,
        });

    } catch (error) {
        console.error('Error in getSubscriptions:', error);
        res.status(500).json({ message: 'Failed to fetch subscriptions: ' + error.message });
    }
};


export const unsubscribeService = async (req, res) => {
    await connectDB();
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
            try {
                await axios.post(service.unsubscribeUrl, null, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded' 
                    }
                });
                unsubscribeAttempted = true;
                successMessage = 'Successfully sent one-click unsubscribe request.';
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

        await Service.findByIdAndDelete(serviceId);
        await User.findByIdAndUpdate(user._id, { $pull: { services: serviceId } });
        user.unsubscribedCount += 1;
        user.totalServices -= 1;
        await user.save();

        res.json({
            message: successMessage,
            redirectionUrl: redirectionUrl
        });

    } catch (error) {
        console.error('Error in unsubscribeService:', error);
        res.status(500).json({ message: 'Failed to unsubscribe: ' + error.message });
    }
};