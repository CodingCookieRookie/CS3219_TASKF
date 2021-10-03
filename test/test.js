const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const app = require('../index');
const testData = require('../data/contacts');

// Configure chai. an assertion library for node and browser, can be paired with any JS testing framework (like Mocha)
chai.use(chaiHttp);
chai.should(); // use Should Assertion style

describe('GET', function() {
  it('should show main api message', function(done) {
    this.timeout(5000);
    chai.request(app)
        .get('/api')
        .end((error, result) => {
          result.should.have.status(200);
          result.body.status.should.equal("success");
          result.body.message.should.equal("Welcome to Contacter-saver!");
          done();
      });
  });
  it('should show a specified contact', function(done) {
    this.timeout(5000);
    chai.request(app)
        .get(`/api/contacts/${testData[0].email}`)
        .end((error, result) => {
          result.should.have.status(200);
          result.body.status.should.equal("success");
          result.body.message.should.equal("Contact details loaded!");
          done();
      });
  });
});

describe('POST', function() {
  it('should add a new random contact', function(done) {
    this.timeout(5000);
    chai.request(app)
        .post('/api/contacts')
        .send(testData[0])
        .end((error, result) => {
          result.should.have.status(200);
          result.body.message.should.equal("New contact created!");
          result.body.data.should.have.property('name');
          result.body.data.should.have.property('email');
          result.body.data.name.should.equal(testData[0].name);
          result.body.data.email.should.equal(testData[0].email);
          done();
      });
  });
  it('should have a new contact now', function(done) {
    chai.request(app)
        .get(`/api/contacts`)
        .end((error, result) => {
          result.should.have.status(200);
          result.body.status.should.equal("success");
          result.body.message.should.equal("Contact details retrieved successfully!");
          assert(result.body.data);
          done();
      });
  });
  it(`should have specified contacts ${testData[0].name}`, function(done) {
    this.timeout(5000);
    chai.request(app)
        .get(`/api/contacts/${testData[0].email}`)
        .end((error, result) => {
          result.should.have.status(200);
          result.body.message.should.equal("Contact details loaded!");
          result.body.data.should.have.property('name');
          result.body.data.should.have.property('email');
          result.body.data.name.should.equal(testData[0].name);
          result.body.data.email.should.equal(testData[0].email);
          done();
      });
  })
});

describe('PUT', function() {
  it('should update a specific contacts', function(done) {
    this.timeout(5000);
    chai.request(app)
        .put(`/api/contacts/${testData[0].email}`)
        .send({name: "alvin", email: testData[0].email})
        .end((err, result) => {
            result.should.have.status(200);
            result.body.message.should.equal("Contact details updated!");
            result.body.data.should.have.property('name');
            result.body.data.should.have.property('email');
            result.body.data.name.should.equal("alvin");
            result.body.data.email.should.equal(testData[0].email);
            done();
        });
  });
  it('should update a specific contacts', function(done) {
    this.timeout(5000);
    chai.request(app)
        .put(`/api/contacts/${testData[0].email}`)
        .send({name: "Johny", email: testData[0].email})
        .end((err, result) => {
            result.should.have.status(200);
            result.body.message.should.equal("Contact details updated!");
            result.body.data.should.have.property('name');
            result.body.data.should.have.property('email');
            result.body.data.name.should.equal("Johny");
            result.body.data.email.should.equal(testData[0].email);
            done();
        });
  });
})

describe('DELETE', function() {
  it('should delete a contacts with specified email', function(done) {
    this.timeout(5000);
    chai.request(app)
        .delete(`/api/contacts/${testData[0].email}`)
        .end((error, result) => {
          result.should.have.status(200);
          result.body.status.should.equal("success")
          result.body.message.should.equal("Contact deleted!");
          result.body.data.should.have.property('name');
          result.body.data.should.have.property('email');
          result.body.data.name.should.equal(testData[0].name);
          result.body.data.email.should.equal(testData[0].email);
          done();
      });
  })
});