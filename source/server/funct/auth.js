/*
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const { User } = require('../models/Models');

module.exports = {
    init: () => {
        passport.use(
            new LocalStrategy({ usernameField: 'id'}, async (id, password, done) => {
                const user = await User.findOne({where: {id}});
                if (!user)
                    return done(null, false);
                if (!bcrypt.compareSync(password, user.password))
                    return done(null, false);

                return done(null, passport.user);
            })
        );

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => {
            const user = await User.findOne({where: {id}});
            done(null, user);
        });
    },
    //USE BELOW function for each protected route
    protectRoute: (req, res, next) => {
        if (req.isAuthenticated())
            return next();

        res.redirect('/login?next=' + req.url);

    }
};
*/

module.exports = {
    isAuthenticated: function(req, res, next) {
        if (req.session.isAuth) {
            next();
        } else {
            res.redirect('/login');
        }
    },
    isDatabaseManager: function(req, res, next) {
        if (req.session.role == 3)
        {
            next();
        } else {
            res.redirect('/login');
        }
    },
    
    isStaff: function(req, res, next) {
        if (req.session.role === 2)
        {
            next();
        } else {
            res.redirect('/login');
        }
    },
    isStudent: function(req, res, next) {
        if (req.session.role === 1)
        {
            next();
        } else {
            res.redirect('/login');
        }
    },
//     isAdmin: function(req, res, next) {
//         if (req.session.role === 3) 
//         {
//             next();
//         } else {
//             res.send('Unauthorized access');
//         }
//     }
};