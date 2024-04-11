'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body

      if(!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      let valid = solver.validate(puzzle);

      if(!valid[0]) {
        return res.json(valid[1]);
      }

      if(!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if(value > 9 || value < 1 || isNaN(value)) {
        return res.json({ error: 'Invalid value' });
      }

      let row = coordinate.split('')[0];
      let col = coordinate.split('')[1];
      
      let conflicts = [];
      
      if(solver.checkRowPlacement(valid[1], row, col, value) != true) {
        conflicts.push(solver.checkRowPlacement(valid[1], row, col, value));
      }
      if(solver.checkColPlacement(valid[1], row, col, value) != true) {
        conflicts.push(solver.checkColPlacement(valid[1], row, col, value));
      }
      if(solver.checkRegionPlacement(valid[1], row, col, value) != true) {
        conflicts.push(solver.checkRegionPlacement(valid[1], row, col, value));
      }

      if(conflicts.length !== 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
     
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle  = req.body.puzzle;
      if(!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      let valid = solver.validate(puzzle);

      if(valid[0] === false) {
        return res.json(valid[1]);
      }
    
      let solution = solver.solve(valid[1]);
      if(solution === false) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      return res.json({ solution: solution });
      
    });
};
