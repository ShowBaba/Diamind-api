/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-shadow */
const models = require('../db/models');
const {
  hashPassword, jwtToken, comparePassword
} = require('../utils');
const redis = require('redis')
const rclient = require('../db/redis_db')

const { User } = models;
const { tokenBlacklist } = models;

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hash = hashPassword(password);
    const user = await User.create({ email, password: hash });
    const { id } = user;
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      message: 'Registration Successful!',
      user: { id, email },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });
    if (user && comparePassword(password, user.password)) {
      const token = jwtToken.createToken(user);
      // store user data on redis
      rclient.hmset('user_profile', 'id', user.id, 'email', user.email)
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        message: 'Login Succesfully',
        token,
      });
    } else {
      res.statusCode = 400;
      res.send({
        message: 'Invalide Email/Password'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await tokenBlacklist.create({ token });
    res.json({
      status: 'success',
      message: 'User signed out',
    });
  } catch (error) {
    next(error);
  }
};
