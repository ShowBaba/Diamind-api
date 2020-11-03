/* eslint-disable no-shadow */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { tokenBlacklist } = require('../models');

dotenv.config();

exports.jwtToken = {
  createToken({ id, email }) {
    return jwt.sign({ id, email }, process.env.secretKey, { expiresIn: 3600 });
  },
  varifyToken(token) {
    return jwt.verify(token, process.env.secretKey, { expiresIn: 3600 });
  },
  inList(token) {
    return tokenBlacklist.findOne({
      where: { token }
    })
      .then((token) => token);
  }
};

exports.hashPassword = (password) => bcrypt.hashSync(password, 10);

exports.comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

// check if a token is in the black list db
exports.checkInBlacklist = (token, next) => {
  let found;
  try {
    tokenBlacklist.findOne({
      where: { token }
    })
      .then((token) => {
        found = token;
      });
  } catch (error) {
    next(error);
  }
  return found;
};
