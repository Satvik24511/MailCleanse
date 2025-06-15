import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    console.error("Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_CALLBACK_URL in .env file.");
    process.exit(1);
}

export const getGmailClient = async (user) => {
    const oauth2Client = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken,
        // Only add expiry_date if it exists
        ...(user.accessTokenExpiresAt && {
            expiry_date: user.accessTokenExpiresAt.getTime()
        })
    });

    try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        
        if (credentials.access_token !== user.accessToken || credentials.refresh_token !== user.refreshToken) {
            user.accessToken = credentials.access_token;
            user.accessTokenExpiresAt = new Date(credentials.expiry_date);
            if (credentials.refresh_token) {
                user.refreshToken = credentials.refresh_token;
            }
            await user.save();
        }

        return google.gmail({ version: 'v1', auth: oauth2Client });
    } catch (error) {
        console.error('Error refreshing access token or getting Gmail client:', error);
        throw new Error('Failed to authenticate with Gmail API. Please re-authenticate.');
    }
}