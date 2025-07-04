import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";

import "./lib/auth.js";
import { isLoggedIn } from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.route.js";
import mailRoutes from "./routes/mail.route.js";
import { connectDB } from "./lib/db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
})
);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);


app.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/api/auth/failure',
    successRedirect: `${process.env.FRONTEND_URL}/dashboard`
})
);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});