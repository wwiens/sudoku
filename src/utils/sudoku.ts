export type Board = number[][];

export const BLANK = 0;

export const isValid = (board: Board, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
};

export const solve = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === BLANK) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const generateBoard = (): Board => {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(BLANK));

  // Fill diagonal 3x3 matrices first (independent of each other)
  for (let i = 0; i < 9; i += 3) {
    fillBox(board, i, i);
  }

  // Solve the rest
  solve(board);
  return board;
};

const fillBox = (board: Board, row: number, col: number) => {
  let num: number;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(board, row, col, num));
      board[row + i][col + j] = num;
    }
  }
};

const isSafeInBox = (board: Board, rowStart: number, colStart: number, num: number): boolean => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[rowStart + i][colStart + j] === num) return false;
    }
  }
  return true;
};

export const removeNumbers = (board: Board, difficulty: 'easy' | 'medium' | 'hard'): Board => {
  const newBoard = board.map(row => [...row]);
  let attempts = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60;

  while (attempts > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);

    if (newBoard[row][col] !== BLANK) {
      newBoard[row][col] = BLANK;
      attempts--;
    }
  }
  return newBoard;
};

export const copyBoard = (board: Board): Board => {
  return board.map(row => [...row]);
}
