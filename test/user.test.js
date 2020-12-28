/* eslint-disable no-undef */
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const { User } = require('../src/db/models');
// const User = require('../src/db/models/user');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
// let id;
let token;

chai.use(chaiHttp);

describe('/POST api/v1/users/signup', () => {
  before((done) => {
    // Before creating a new user we empty the database
    User.sync({ force: true })
      .then(() => {
        done(null);
      })
      .catch((err) => done(err));
  });
  it('Should register a new user and save to db', (done) => {
    const user = {
      email: 'test000@mail.com',
      password: '12345',
    };
    chai
      .request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.equals(true);
        expect(res.body.message).to.equals('Registration Successful!');
        done();
      });
  });
});

describe('/POST api/v1/users/signin', () => {
  it('Should login a user and return a token key', (done) => {
    const user = {
      email: 'test000@mail.com',
      password: '12345',
    };
    chai
      .request(app)
      .post('/api/v1/users/signin')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.equals(true);
        res.body.should.have.property('token');
        expect(res.body.message).to.equals('Login Succesfully');
        done();
      });
  });
});

describe('/GET api/v1/users/logout', () => {
  it('Should logout a user lobatan!', (done) => {
    const user = {
      email: 'test000@mail.com',
      password: '12345',
    };
    chai
      .request(app)
      .get('/api/v1/users/logout')
      .set({ Authorization: `Bearer ${token}` })
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        done();
      });
  });
});
