import express from "express";
import { getGmailClient } from "../lib/gmailClient.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isLoggedIn);

router.get('/unreadMessages', async (req, res) => {
    try {
        const gmail = await getGmailClient(req.user);
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
            labelIds: ['INBOX'],
            q: 'is:unread'
        });

        if (!response.data.messages) {
            return res.status(404).json({ message: 'No messages found.' });
        }

        res.json(response.data.messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

export default router;