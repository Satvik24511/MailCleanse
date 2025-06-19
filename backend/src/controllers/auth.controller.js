import User from '../models/User.model.js';
import Service from '../models/Service.model.js'; 


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

export const check = async (req, res) => {
  if (req.user) {
    try {
      const populatedUser = await User.findById(req.user.id).populate('services').lean();

      if (populatedUser) {
        const userToSend = {
          ...populatedUser,
          services: populatedUser.services.map(service => ({
            ...service,
            lastEmailDate: service.lastEmailDate ? service.lastEmailDate.toISOString() : null,
            createdAt: service.createdAt ? service.createdAt.toISOString() : null,
            updatedAt: service.updatedAt ? service.updatedAt.toISOString() : null,
            recentEmails: service.recentEmails ? service.recentEmails.map(email => ({
                ...email,
                date: email.date ? email.date.toISOString() : null,
            })) : [],
          })),
          accessTokenExpiresAt: populatedUser.accessTokenExpiresAt ? populatedUser.accessTokenExpiresAt.toISOString() : null,
          lastScanDate: populatedUser.lastScanDate ? populatedUser.lastScanDate.toISOString() : null,
          createdAt: populatedUser.createdAt ? populatedUser.createdAt.toISOString() : null,
          updatedAt: populatedUser.updatedAt ? populatedUser.updatedAt.toISOString() : null,
        };


        res.status(200).json({ authenticated: true, user: userToSend });
      } else {
        res.status(401).json({ authenticated: false, message: "User session invalid or user not found" });
      }
    } catch (error) {
      console.error("Error populating user services:", error);
      res.status(500).json({ authenticated: false, message: "Server error during user check." });
    }
  } else {
    res.status(401).json({ authenticated: false, message: "Not authenticated" });
  }
};

