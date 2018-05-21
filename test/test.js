const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const { app, database } = require('../server.js');

chai.use(chaiHttp);

describe("/api/v1 Requests", () => {
  beforeEach(function(done) {
    database.migrate.rollback()
    .then(function() {
      database.migrate.latest()
      .then(function() {
        return database.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  describe("ROOT URL requests", () => {
    it("should server static assets and return status code 200", (done) => {
      chai.request(app).get('/').end((err, response) => {
        response.should.be.html;
        response.should.have.status(200);
        done();
      });
    });

    it("should return 404 for unknown route", (done) => {
      chai.request(app).get('/notoebeans').end((err, response) => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe("/api/v1/photos requests", () => {
    it("should return an array and status code 200", (done) => {
      chai.request(app).get('/api/v1/photos').end((err, response) => {
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.should.have.a.lengthOf(3);
        response.should.have.status(200);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('George Spilled His Beans');
        response.body[0].should.have.property('url');
        response.body[0].url.should.equal('https://i.redditmedia.com/KcCthlN9a3uvYq11d3_Vsu13bJDCii1gNq5lF6ZVhIA.jpg?w=576&s=f3700a574628a3a5a4c1ba3546d517d6');
        done();
      });
    });
  });

});
