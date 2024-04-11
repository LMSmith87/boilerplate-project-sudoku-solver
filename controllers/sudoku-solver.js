class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return [false, { error: 'Expected puzzle to be 81 characters long' }];
    }
    if (/[1-9.]{81}/.test(puzzleString) === false){
      return [false, { error: 'Invalid characters in puzzle' }];
    }
    let puzzleArr = puzzleString.split("");
    let a1 = [],
      a2 = [],
      a3 = [],
      a4 = [],
      a5 = [],
      a6 = [],
      a7 = [],
      a8 = [],
      a9 = [];
      puzzleArr.forEach((val, i) => {
      let num = i + 1;
      if (num / 9 <= 1) a1.push(val);
      if (num / 9 > 1 && num / 9 <= 2) a2.push(val);
      if (num / 9 > 2 && num / 9 <= 3) a3.push(val);
      if (num / 9 > 3 && num / 9 <= 4) a4.push(val);
      if (num / 9 > 4 && num / 9 <= 5) a5.push(val);
      if (num / 9 > 5 && num / 9 <= 6) a6.push(val);
      if (num / 9 > 6 && num / 9 <= 7) a7.push(val);
      if (num / 9 > 7 && num / 9 <= 8) a8.push(val);
      if (num / 9 > 8 && num / 9 <= 9) a9.push(val);
    });
    const result = [a1, a2, a3, a4, a5, a6, a7, a8, a9];
    return [true, result];
  }

  checkRowPlacement(puzzleArr, row, col, value) {
    let rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    let colIndex = col - 1;
    let result = true;
      puzzleArr[rowIndex].forEach((cell) => {
      if (value == cell) {
        result = "row";
      }
    });
    if (puzzleArr[rowIndex][colIndex] == value) {
      result = true;
    }
    return result;
  }

  checkColPlacement(puzzleArr, row, col, value) {
    let rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    let colIndex = col - 1;
    let result = true;
      puzzleArr.forEach(cell => {
      if (value == cell[colIndex]) {
        result = "column";
      }
    });
    if (puzzleArr[rowIndex][colIndex] == value) {
      result = true;
    }
    return result;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    let rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    let colIndex = col - 1;
    let result = true;
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(rowIndex / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(colIndex / 3) + (i % 3);
      if (value == puzzleString[m][n]) {
        result = "region";
      }
      if (puzzleString[rowIndex][colIndex] == value) {
        result = true;
      }
    }
    return result;
  }
  
  solve(puzzleArr) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzleArr[row][col] == ".") {
          for (let value = 1; value <= 9; value++) {
            let check = true;
            for (let newVal = 0; newVal < 9; newVal++) {
              const topLeftRow = 3 * Math.floor(row / 3) + Math.floor(newVal / 3);
              const topLeftCol = 3 * Math.floor(col / 3) + (newVal % 3);
              if (puzzleArr[row][newVal] == value || puzzleArr[newVal][col] == value || puzzleArr[topLeftRow][topLeftCol] == value) {
                check = false;
              }
            }
            if (check) {
              puzzleArr[row][col] = value;
              if (this.solve(puzzleArr)) {
                return puzzleArr.toString().replace(/,/g, "");
              } else {
                  puzzleArr[row][col] = ".";
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;

