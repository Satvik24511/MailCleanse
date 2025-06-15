
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

export const check = (req, res) => {
  if (req.user) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
}

