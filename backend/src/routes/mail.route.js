import express from "express";
import { getGmailClient } from "../lib/gmailClient.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { getSubscriptions } from "../controllers/mail.controller.js";

const router = express.Router();

router.use(isLoggedIn);

router.get("/subscriptions", isLoggedIn, getSubscriptions);

export default router;