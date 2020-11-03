const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {
  checkInBlacklist
} = require('../utils');
const {
  hashPassword, jwtToken, comparePassword
} = require('../utils');

const { User } = require('../models');

dotenv.config();

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      error: 'You are not authorized to access this resource'
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  jwtToken.inList(token).then((result) => {
    // console.log(result)
    if (result === null) {
      jwt.verify(token, process.env.secretKey, { expiresIn: 3600 },
        (err, decoded) => {
          if (err) {
            return res.status(401).send({
              error: err
            });
          }
          req.decoded = decoded;
          User.findByPk(decoded.id)
            .then((user) => {
              if (!user) {
                return res.status(401).send({
                  error: 'User does not exist'
                });
              }
              next();
            });
        });
    }
    else {
      return res.status(401).send({
        error: 'User already logged out of session'
      });
    }
  }).catch((err) => next(err));
};
