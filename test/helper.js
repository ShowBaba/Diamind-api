/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const { User } = require('../src/db/models');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

exports.creatNewUser = (done) => new Promise((resolve, reject) => {
  const user = {
    email: 'test000@mail.com',
    password: '12345',
  };
  User.sync({ force: true })
    .then(() => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(user)
        .end((err, res) => {
          if (err) done(err);
          chai
            .request(app)
            .post('/api/v1/users/signin')
            .send(user)
            .end((err, res_) => {
              if (res_.body.token !== undefined) {
                resolve(res_.body.token);
                done();
              }
            });
        });
    })
    .catch((err) => reject(err));
});
