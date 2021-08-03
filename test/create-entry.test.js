/* eslint-disable no-undef */
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const helper = require('./helper');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
let id;
let token;
const user = {
  email: 'test000@mail.com',
  password: '12345',
};

chai.use(chaiHttp);

describe('/POST api/v1/users/login', () => {
  before((done) => {
    helper.creatNewUser(done).then((token_) => {
      token = token_;
    })
      .catch((err) => {
        done(err);
      });
  });

  describe('/POST api/v1/entries', () => {
    it('Create multitple diary entries', (done) => {
      const entry = [
        {
          content: 'Test entry 1',
          date: '2020-11-09',
        },
        {
          content: 'Test entry without date',
        },
      ];
      chai
        .request(app)
        .post('/api/v1/entries')
        .set('Authorization', `Bearer ${token}`)
        .send(entry)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.data[0]).to.have.property('userId');
          expect(res.body.message).to.equals('Created new entries');
          expect(res.body.data[0].content).to.be.a('string').to.not.be.a('null');
          expect(res.body.data[0].date).to.be.a('string').to.not.be.a('null');
          done();
        });
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
        expect(res).to.have.status(201);
        expect(res.body.data).to.have.property('userId');
        expect(res.body.message).to.equals('Created a new entry');
        expect(res.body.data.content).to.be.a('string').to.not.be.a('null');
        expect(res.body.data.date).to.be.a('string').to.not.be.a('null');
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
        // TODO: complete the test body;
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
        expect(res).to.have.status(201);
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

describe('/POST api/v1/entries', () => {
  before((done) => {
    chai
      .request(app)
      .get('/api/v1/users/logout')
      .set({ Authorization: `Bearer ${token}` })
      .send(user)
      .end(() => done());
  });
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
