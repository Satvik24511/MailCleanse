import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { getSubscriptions, unsubscribeService } from "../controllers/mail.controller.js";

const router = express.Router();

router.use(isLoggedIn);

router.get("/subscriptions", isLoggedIn, getSubscriptions);
router.get("/unsubscribe/:serviceId", isLoggedIn, unsubscribeService);

export default router;