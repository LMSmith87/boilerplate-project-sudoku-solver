const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const testPuzzle = require("../controllers/puzzle-strings.js").puzzlesAndSolutions;

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST /api/solve', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: testPuzzle[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, testPuzzle[0][1]);
          done();
        });
    })

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    })

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: testPuzzle[0][0].replace('9','s') })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    })

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: testPuzzle[0][0].substring(0,80) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    })

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: testPuzzle[0][0].replace('.', '1') })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite('POST /api/check', () => {
    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: testPuzzle[0][0],
          coordinate: 'A2',
          value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    })

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: testPuzzle[0][0],
          coordinate: 'B2',
          value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 1)
          assert.equal(res.body.conflict[0], 'row')
          done();
        });
    })

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: testPuzzle[0][0],
          coordinate: 'B2',
          value: '1' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 2)
          assert.equal(res.body.conflict[0], 'row')
          assert.equal(res.body.conflict[1], 'region')
          done();
        });
    })

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: testPuzzle[0][0],
          coordinate: 'A4',
          value: '1' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 3)
          assert.equal(res.body.conflict[0], 'row')
          assert.equal(res.body.conflict[1], 'column')
          assert.equal(res.body.conflict[2], 'region')
          done();
        });
    })

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: testPuzzle[0][0],
          coordinate: 'A1'
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    })

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: testPuzzle[0][0].replace('1','s'),
          coordinate: 'A1',
          value: '1'
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    })

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: testPuzzle[0][0].substring(0,80),
          coordinate: 'A1',
          value: '1'
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    })
    
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: testPuzzle[0][0],
          coordinate: 'AA',
            value: '1'
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    })

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: testPuzzle[0][0],
          coordinate: 'A1',
            value: '0'
          })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});

