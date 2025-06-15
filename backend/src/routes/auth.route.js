import express from "express";
import passport from "passport";
import { authFailure, logout, check } from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get('/google',
    passport.authenticate('google', {
        scope: [
            'email', 
            'profile',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify'
        ],
        accessType: 'offline',
        prompt: 'consent'
    })
);

router.get('/check', isLoggedIn, check);

router.get('/failure', authFailure);

router.get('/logout', logout);

export default router;