/* eslint-disable no-undef */
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const models = require('../models');
const Entry = require('../models/entry');
// run np migrate --env test to migrate to test db

const { User } = models;

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
    User.sync({ force: true })
      .then(() => {
        done(null);
      })
      .catch((err) => done(err));
  });

  describe('/POST api/v1/users/signup', () => {
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
          expect(res).to.have.status(200);
          expect(res.body.success).to.equals(true);
          expect(res.body.message).to.equals('Registration Successful!');
          done();
        });
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
        token = res.body.token;
        expect(res).to.have.status(200);
        expect(res.body.success).to.equals(true);
        res.body.should.have.property('token');
        expect(res.body.message).to.equals('Login Succesfully');
        done();
      });
  });
});

describe('/POST api/v1/entries', () => {
  it('Create multitple diary entries', (done) => {
    const entry = [
      {
        content: 'Test entry 1',
      },
      {
        content: 'Test entry 2',
      },
    ];
    chai
      .request(app)
      .post('/api/v1/entries')
      .set('Authorization', `Bearer ${token}`)
      .send(entry)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data[0]).to.have.property('userId');
        expect(res.body.message).to.equals('Created new entries');
        expect(res.body.data[0].content).to.be.a('string').to.not.be.a('null');
        done();
      });
  });
});
describe('/POST api/v1/entries', () => {
  it('Create single diary entry', (done) => {
    const entry = {
      content: 'Test entry 3',
    };
    chai
      .request(app)
      .post('/api/v1/entries')
      .set('Authorization', `Bearer ${token}`)
      .send(entry)
      .end((err, res) => {
        id = res.body.data.id;
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('userId');
        expect(res.body.message).to.equals('Created a new entry');
        expect(res.body.data.content).to.be.a('string').to.not.be.a('null');
        done();
      });
  });
});
describe('/GET api/v1/entries/', () => {
  it('Get all entries', (done) => {
    chai
      .request(app)
      .get(`/api/v1/entries/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.body.data).to.have.property('userId');
        // expect(res.body.message).to.equals('Entry');
        // expect(res.body.data.content).to.be.a('string').to.not.be.a('null');
        done();
      });
  });
});

describe('/GET api/v1/entries/:id', () => {
  it('Get an entry by id', (done) => {
    chai
      .request(app)
      .get(`/api/v1/entries/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('userId');
        expect(res.body.message).to.equals('Entry');
        expect(res.body.data.content).to.be.a('string').to.not.be.a('null');
        done();
      });
  });
});
describe('/PUT api/v1/entries/:id', () => {
  it('Update an entry', (done) => {
    const entry = {
      content: 'Test entry',
    };
    chai
      .request(app)
      .put(`/api/v1/entries/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(entry)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('userId');
        expect(res.body.message).to.equals('Entry Updated');
        expect(res.body.data.content).to.be.a('string').to.not.be.a('null');
        done();
      });
  });
});
describe('/DELETE api/v1/entries/:id', () => {
  it('DELETE an entry', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/entries/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Entry Deleted');
        expect(res.body.response).to.equals(1);
        done();
      });
  });
});
describe('/DELETE api/v1/entries/', () => {
  it('DELETE all entries', (done) => {
    chai
      .request(app)
      .delete('/api/v1/entries')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Entries Deleted');
        expect(res.body.response).to.be.a('number');
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

describe('/POST api/v1/entries', () => {
  it('Try create diary entry after looging out', (done) => {
    const entry = {
      content: 'Test entry',
    };
    chai
      .request(app)
      .post('/api/v1/entries')
      .set('Authorization', `Bearer ${token}`)
      .send(entry)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equals('User already logged out of session');
        done();
      });
  });
});