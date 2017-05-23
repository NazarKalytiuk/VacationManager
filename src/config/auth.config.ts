var GoogleStrategy = require('passport-google-oauth2').Strategy;
import * as passport from 'passport';
import { Db, Collection } from 'mongodb';
import { ApplicationDbContext } from '../domain/applicationDbContext';
import { User, Role } from "../models/index";

let googleConfig = {
    clientID: '139694298113-3j6rdrbb0gvb62qoou0dlvv15drbbt37.apps.googleusercontent.com',
    clientSecret: 'Ph5j6nCV8jZxs6x4OxbW1Eqt',
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
}
let generateRandomToken = function () {
    var user = this,
        chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        token = new Date().getTime() + '_';

    for (var x = 0; x < 16; x++) {
        var i = Math.floor(Math.random() * 62);
        token += chars.charAt(i);
    }
    return token;
};
let registerUser = async (request, accessToken, refreshToken, profile, done) => {
    console.log(profile);
    let db = ApplicationDbContext.getApplicationDbContext().db;
    db.collection('Users').findOne({ googleId: profile.id }, async (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            user = new User();
            user.imageUrl = profile._json.image.url;
            user.email = profile.emails[0].value;
            user.googleId = profile.id;
            user.name = profile.displayName;
            user.accessToken = generateRandomToken();
            let count = await db.collection('Users').count({});
            if (count === 0) {
                user.role = Role.Manager
            } else {
                user.role = Role.Employee;
            }
            await db.collection('Users').insert(user);
        }
        return done(err, user);
    });
}

// let passportConfig = (registerFunction) => passport.use(new GoogleStrategy(googleConfig, registerFunction));
let passportConfig = passport.use(new GoogleStrategy(googleConfig, registerUser));

export { passportConfig };

