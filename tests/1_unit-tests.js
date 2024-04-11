const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const testPuzzle = require("../controllers/puzzle-strings.js").puzzlesAndSolutions;

suite('Unit Tests', () => {
  test("Logic handles a valid puzzle string of 81 characters", (done) => {
    const input = testPuzzle[0][0];
    assert.equal(input.length, 81);
    assert.equal(solver.validate(input)[0], true);
    done();
  });

  test("Logic handles a puzzle string with invalid characters", (done) => {
    const input = testPuzzle[0][0].replace('9','s');
    assert.equal(solver.validate(input)[0], false);
    assert.deepEqual(solver.validate(input)[1], { error: "Invalid characters in puzzle" });
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
    const input = testPuzzle[0][0].substring(0,80);
    assert.equal(solver.validate(input)[0], false);
    assert.deepEqual(solver.validate(input)[1], { error: "Expected puzzle to be 81 characters long" });
    done();
  });

  test("Logic handles a valid row placement", (done) => {
    const input = testPuzzle[0][0];
    const row = "A";
    const col = "2";
    const val = "3";
    assert.equal(solver.checkRowPlacement(solver.validate(input)[1], row, col, val), true);
    done();
  });

  test("Logic handles a invalid row placement", (done) => {
    const input = testPuzzle[0][0];
    const row = "A";
    const col = "2";
    const val = "1";
    assert.equal(solver.checkRowPlacement(solver.validate(input)[1], row, col, val), 'row');
    done();
  });

  test("Logic handles a valid column placement", (done) => {
    const input = testPuzzle[0][0];
    const row = "A";
    const col = "2";
    const val = "3";
    assert.equal(solver.checkColPlacement(solver.validate(input)[1], row, col, val), true);
    done();
  });

  test("Logic handles a invalid column placement", (done) => {
    const input = testPuzzle[0][0];
    const row = "B";
    const col = "1";
    const val = "1";
    assert.equal(solver.checkColPlacement(solver.validate(input)[1], row, col, val), 'column');
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", (done) => {
    const input = testPuzzle[0][0];
    const row = "A";
    const col = "2";
    const val = "3";
    assert.equal(solver.checkRegionPlacement(solver.validate(input)[1], row, col, val), true);
    done();
  });

  test("Logic handles a invalid region (3x3 grid) placement", (done) => {
    const input = testPuzzle[0][0];
    const row = "B";
    const col = "1";
    const val = "1";
    assert.equal(solver.checkRegionPlacement(solver.validate(input)[1], row, col, val), 'region');
    done();
  });

  test("Valid puzzle strings pass the solver", (done) => {
    const input = testPuzzle[0][0];
    assert.equal(solver.solve(solver.validate(input)[1]), testPuzzle[0][1]);
    done();
  });

  test("Invalid puzzle strings fail the solver", (done) => {
    const input = testPuzzle[0][0].replace('.', '1');
    assert.equal(solver.solve(solver.validate(input)[1]), false);
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
  const input = testPuzzle[0][0];
    assert.equal(solver.solve(solver.validate(input)[1]), testPuzzle[0][1]);
    done();
  });
});
