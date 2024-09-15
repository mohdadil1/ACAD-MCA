const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../modals/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
            return done(null, existingUser);
        }
        new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        }).save().then(newUser => {
            done(null, newUser);
        });
    });
}));
