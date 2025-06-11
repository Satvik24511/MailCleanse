import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";

import "./lib/auth.js";

import { isLoggedIn } from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT;

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



app.get("/", (req, res) => {
    res.send("<a href='/api/auth/google'>Login with Google</a>");
})

app.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/api/auth/failure',
    successRedirect: '/api/protected'
})
);

app.get('/api/protected', isLoggedIn, (req, res) => {
    console.log("User is authenticated:", req.user);

    res.send("This is a protected route. You must be logged in to see this.");
})


app.listen(PORT, () => {
    console.log("Server is running on http://localhost:"+PORT);
    connectDB();
});