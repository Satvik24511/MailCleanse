import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import { getGmailClient } from './gmailClient.js';
import {getUnreadCount} from './onLogin.js';
import { connectDB } from './db.js';
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env file.");
    process.exit(1);
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    accessType: 'offline',
    prompt: 'consent',
    scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
    ]
},
async function(accessToken, refreshToken, profile, done) {
    try {
        await connectDB();
        let user = await User.findOne({ googleId: profile.id }).select('+accessToken +refreshToken +accessTokenExpiresAt');

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos[0].value,
                accessToken,
                refreshToken,
                accessTokenExpiresAt: new Date(Date.now() + 3600000),
                unreadEmails: 0
            });
        } else {
            user.accessToken = accessToken;
            if (refreshToken) {
                user.refreshToken = refreshToken;
            }
            user.accessTokenExpiresAt = new Date(Date.now() + 3600000);
            await user.save();
        }

        const gmail = await getGmailClient(user);
        const unreadCount = await getUnreadCount(gmail);
        console.log('Fetched unread count:', unreadCount);
        
        user.unreadEmails = unreadCount;
        await user.save();

        return done(null, user);
    } catch (err) {
        console.error('Auth error:', err);
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    await connectDB();
    console.log('Deserializing user with ID:', id);
    const user = await User.findById(id).select('+accessToken +refreshToken +accessTokenExpiresAt');
    if (user) {
        console.log("Deserialized user:", user.email);
        done(null, user);
    } else {
        console.log("User not found during deserialization for ID:", id);
        done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});