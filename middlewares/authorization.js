/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../db/models');

const { tokenBlacklist } = require('../db/models');

dotenv.config();

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      error: 'You are not authorized to access this resource'
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  // check if a token is in the black list db
  try {
    const result = await tokenBlacklist.findOne({
      where: { token }
    });
    // return result;
    if (result !== null) {
      return res.status(401).send({
        error: 'User already logged out of session'
      });
    }
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
  } catch (error) {
    next(error);
  }
  /*
  check(token).then((result) => {
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
    } else {
      return res.status(401).send({
        error: 'User already logged out of session'
      });
    }
  }).catch((err) => next(err)); */
};
