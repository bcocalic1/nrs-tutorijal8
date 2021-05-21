process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
const sqlite3 = require('sqlite3').verbose();
let server = require('./index.js');
let expect = chai.expect;

chai.use(chaiHttp);

describe('Testovi zahtjeva za bazu Gradovi', () => {  

  before(() => {
    let db = new sqlite3.Database('./gradovi.db', (err) => {
      if (err) {
        return console.error(err.message);
      }  
      db.run('INSERT INTO grad (ID, NAZIV, BROJ_STANOVNIKA) VALUES(1, "Peking", 21000000);')
      db.run('INSERT INTO grad (ID, NAZIV, BROJ_STANOVNIKA) VALUES(2, "Moskva", 11000000);')
      db.run('INSERT INTO grad (ID, NAZIV, BROJ_STANOVNIKA) VALUES(3, "Berlin", 3600000);')
      db.run('INSERT INTO grad (ID, NAZIV, BROJ_STANOVNIKA) VALUES(4, "Madrid", 3600000);')
      db.run('INSERT INTO grad (ID, NAZIV, BROJ_STANOVNIKA) VALUES(5, "Rim", 2600000);')
      db.run('INSERT INTO grad (ID, NAZIV, BROJ_STANOVNIKA) VALUES(6, "New York", 10000000);')   
    });
  })

  after(() =>{ 

    let db = new sqlite3.Database('./gradovi.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      db.run('DELETE FROM grad;');
    });
  })

  describe('/GET gradovi', () => {
    it('Prikaz svih gradova', (done) => {
      chai.request(server)
        .get('/gradovi')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body.length).to.be.equal(6);
          done();
        });
    });
  });


  describe('/POST grad', () => {
    it('Kreiranje novog grada', (done) => {

      chai.request(server)
        .post('/grad')
        .send({
          name: "Sarajevo",
          brojStanovnika: 400000
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body.name).to.be.equal("Sarajevo");
          expect(res.body.brojStanovnika).to.be.equal(400000);
          done();
        });
    });
  });

  describe('/GET gradovi/:id', () => {
    it('Ispis grada za traženi ID', (done) => {
      chai.request(server)
        .get('/gradovi/2')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body.ID).to.be.equal(2);
          expect(res.body.NAZIV).to.be.equal("Moskva");
          done();
        });
    });
  });

  describe('/PUT gradovi/:id', () => {
    it('Izmjena broja stanovnika po ID-u grada', (done) => {   

      chai.request(server)
        .put('/gradovi/7')
        .send({
          brojStanovnika: 350000
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.body.message).to.be.equal('Uspješna izmjena!');
          expect(res.body.data.broj).to.be.equal(350000);  
          done();
        });
    });
  });

  describe('/DELETE gradovi/:id', () => {
    it('Brisanje grada po ID-u', (done) => {
        chai.request(server)
        .delete('/gradovi/2')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          expect(res.text).to.be.string;
          expect(res.text).to.be.equal('Uspješno brisanje grada!');
          done();
        });
    });
  });
});