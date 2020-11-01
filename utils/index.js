const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.jwtToken = {
  createToken({ id, email }) {
    return jwt.sign({ id, email }, process.env.secretKey, { expiresIn: 3600 });
  },
  varifyToken(token) {
    return jwt.verify(token, process.env.secretKey, { expiresIn: 3600 });
  }
};

exports.hashPassword = (password) => bcrypt.hashSync(password, 10);

exports.comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
