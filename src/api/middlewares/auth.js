/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
const { User } = require('../db/models');

module.exports = (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      error: 'Email is required',
    });
  }
  if (!password) {
    return res.status(400).json({
      error: 'Password is required',
    });
  }
  User.findOne({
    where: { email },
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email already exist',
      });
    }
    next();
  });
};
