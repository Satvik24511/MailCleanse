import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";

import "./lib/auth.js";


dotenv.config();


const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.status(401).send("You must be logged in to access this route.");
}

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

app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login with Google</a>");
})

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })
);

app.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/protected'
})
);

app.get('/auth/failure', (req, res) => {
    res.send("Failed to authenticate. Please try again.");
});

app.get('/protected', isLoggedIn, (req, res) => {
    console.log("User is authenticated:", req.user);

    res.send("This is a protected route. You must be logged in to see this.");
})

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.session.destroy(function(err) {
            if (err) {
                console.error("Error destroying session:", err);
                return next(err);
            }
            res.redirect('/'); 
        });
    });
});

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:"+PORT);
});