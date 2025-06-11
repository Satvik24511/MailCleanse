export const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.status(401).send("You must be logged in to access this route.");
}