const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const { app, database } = require('../server.js');

chai.use(chaiHttp);

describe("/api/v1 Requests", () => {

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

  describe("/api/v1/photos", () => {
    beforeEach(done => {
      database.migrate.rollback().then(() => {
          database.migrate.latest().then(() => {
            return database.seed.run().then(() => {
              done();
            });
          });
        });
    });

    it("GET: should return an array and status code 200", (done) => {
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

    it("POST: should post a new photo to the database", (done) => {
      chai.request(app)
      .post('/api/v1/photos')
      .send({
        title: 'Fluff beans',
        url: 'https://i.redditmedia.com/ZYQNEpadX2eL2W0BJIaAU_hEJdfPuiOeZUpNCbyZrbo.jpg?w=1024&s=5e0da47940313a99b50ebef91a1bef01'
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(4);
        done();
      });
    });

    it("POST: should not post to database if a param is missing", (done) => {
      chai.request(app)
      .post('/api/v1/photos')
      .send({
        title: 'Fluff beans'
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.error.should
          .equal(`You're missing a url property.`);
        done();
      });
    });

    it("DELETE: should delete a photo by id", (done) => {
      chai.request(app)
      .del('/api/v1/photos/3')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('message');
        response.body.message.should.equal('Deleted photo with id 3');
        done();
      });
    });

    it("DELETE: should not delete anything if the ID is wrong", (done) => {
      chai.request(app)
      .del('/api/v1/photos/bob')
      .end((err, response) => {
        response.should.have.status(422);
        response.should.be.an('object');
        response.text.should.equal('ID is not an integer')
        done();
      });
    });
  });
});
