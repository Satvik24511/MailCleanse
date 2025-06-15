import { getGmailClient } from './gmailClient.js';

export const getUnreadCount = async (gmail) => {
    try {
        const response = await gmail.users.labels.get({
            userId: 'me',
            id: 'UNREAD',
            fields: 'messagesUnread',
            includeSpamTrash: false
        });
        
        const count = response.data.messagesUnread || 0;
        console.log('Unread count:', count);
        return parseInt(count, 10);
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
};
