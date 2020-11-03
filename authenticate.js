// /* eslint-disable linebreak-style */
// /* eslint-disable implicit-arrow-linebreak */
// /* eslint-disable no-underscore-dangle */
// /* eslint-disable new-cap */
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('./models/user.model');

dotenv.config();

exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => jwt.sign(user, process.env.secretKey, { expiresIn: 3600 });

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  }),
);

exports.varifyUser = passport.authenticate('jwt', { session: false });

exports.varifyAdmin = (req, res, next) => {
  // console.log(req.user);
  if (req.user.admin) {
    return next();
  }
  const err = new Error('You are not authorized to perform this operation');
  err.statusCode = 403; // operation not supported
  return next(err);
};
