/* eslint-disable no-undef */
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/user.model');
const Entry = require('../models/entry.model');

const should = chai.should();
let token;
let id;

chai.use(chaiHttp);

describe('Server', () => {
  it('welcomes client to the API', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        expect(res.body.message).to.equals('Welcome To MyDiary API');
        done();
      });
  });
});

// user test
describe('Users', () => {
  beforeEach((done) => {
    // Before each test we empty the database
    // eslint-disable-next-line no-unused-vars
    User.deleteMany({}, (err) => {
      done();
    });
  });

  describe('/POST api/v1/users/signup', () => {
    it('Should register a new user and save to db', (done) => {
      const user = {
        username: 'test user',
        email: 'test@mail.com',
        password: '12345',
      };
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equals(true);
          expect(res.body.message).to.equals('Registration Successful!');
          done();
        });
    });
  });
});
describe('/POST api/v1/users/login', () => {
  it('Should login a user and return a token key', (done) => {
    const user = {
      username: 'test user',
      password: '12345',
    };
    chai
      .request(app)
      .post('/api/v1/users/login')
      .send(user)
      .end((err, res) => {
        token = res.body.token;
        expect(res).to.have.status(200);
        expect(res.body.success).to.equals(true);
        res.body.should.have.property('token');
        expect(res.body.message).to.equals('Login Successful!');
        done();
      });
  });
});

describe('/POST api/v1/entries', () => {
  it('Create a new diary entry', (done) => {
    const user = {
      username: 'test user',
      password: '12345',
    };
    const entry = {
      content: 'Test entry',
    };
    chai
      .request(app)
      .post('/api/v1/entries')
      .set('Authorization', `Bearer ${token}`)
      .send(entry)
      .end((err, res) => {
        id = res.body.data._id;
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('user');
        expect(res.body.message).to.equals('Created a new entry');
        expect(res.body.data.content)
          .to.be.a('string')
          .to.not.be.a('null');
        done();
      });
  });
});

describe('/GET api/v1/entries/:id', () => {
  it('Get an entry by id', (done) => {
    chai
      .request(app)
      .get(`api/v1/entries/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res);
        done();
      });
  });
});

describe('/GET api/v1/users/logout', () => {
  it('Should logout a user lobatan!', (done) => {
    const user = {
      username: 'test user',
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
