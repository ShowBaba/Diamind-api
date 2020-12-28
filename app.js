/* eslint-disable no-undef */
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./src/app');
const { User } = require('./src/db/models');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
let token;
let id;

chai.use(chaiHttp);





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
