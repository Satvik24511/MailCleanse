import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import { getGmailClient } from './gmailClient.js';
import {getUnreadCount} from './onLogin.js';
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env file.");
    process.exit(1);
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
    ]
},
async function(accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ googleId: profile.id });

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
        }

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
    

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
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});