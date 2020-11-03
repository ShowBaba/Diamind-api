/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-shadow */
const models = require('../db/models');
const {
  hashPassword, jwtToken, comparePassword
} = require('../utils');

const { User } = models;
const { tokenBlacklist } = models;


exports.signup = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hash = hashPassword(password);
    User.create({ email, password: hash }).then(
      (user_) => {
        const { id } = user_;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          message: 'Registration Successful!',
          user: { id, email },
        });
      },
      (err) => next(err)
    );
  } catch (error) {
    next(error);
  }
};

exports.signin = (req, res, next) => {
  try {
    const { email, password } = req.body;
    User.findOne({
      where: { email },
    })
      .then(
        (user) => {
          if (user && comparePassword(password, user.password)) {
            const token = jwtToken.createToken(user);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              message: 'Login Succesfully',
              token,
            });
          } else {
            res.statusCode = 400;
            res.send('Invalide Email/Password');
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    tokenBlacklist.create({ token })
      .then(() => {
        res.json({
          status: 'success',
          message: 'User signed out',
        });
      });
  } catch (error) {
    next(error);
  }
};
