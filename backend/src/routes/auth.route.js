import express from "express";
import passport from "passport";
import { authFailure, logout } from "../controllers/auth.controller.js";

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

router.get('/failure', authFailure);

router.get('/logout', logout);

export default router;