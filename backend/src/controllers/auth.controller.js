
export const authFailure = (req, res, next) => {
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
}

export const logout = (req, res, next) => {
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
}