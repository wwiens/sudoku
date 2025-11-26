import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import Timer from './components/Timer';
import NumberPad from './components/NumberPad';
import Modal from './components/Modal';
import { generateBoard, removeNumbers, copyBoard, type Board as BoardType, BLANK } from './utils/sudoku';
import './App.css';

type Difficulty = 'easy' | 'medium' | 'hard';

const App: React.FC = () => {
  const [initialBoard, setInitialBoard] = useState<BoardType>([]);
  const [board, setBoard] = useState<BoardType>([]);
  const [solutionBoard, setSolutionBoard] = useState<BoardType>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [errorCells, setErrorCells] = useState<{ row: number; col: number }[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [resetTimerTrigger, setResetTimerTrigger] = useState(0);
  const [autoCheck, setAutoCheck] = useState(false);
  const [fastMode, setFastMode] = useState(false);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  const [completedNumbers, setCompletedNumbers] = useState<number[]>([]);
  const [finalTime, setFinalTime] = useState("00:00");
  const [currentTime, setCurrentTime] = useState(0); // Lift timer state up to track it
  const [history, setHistory] = useState<BoardType[]>([]);

  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    const fullBoard = generateBoard();
    const puzzleBoard = removeNumbers(fullBoard, diff);
    setInitialBoard(copyBoard(puzzleBoard));
    setBoard(copyBoard(puzzleBoard));
    setSolutionBoard(fullBoard);
    setDifficulty(diff);
    setSelectedCell(null);
    setActiveNumber(null);
    setCompletedNumbers([]);
    setErrorCells([]);
    setHistory([]);
    setGameWon(false);
    setResetTimerTrigger(prev => prev + 1);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (gameWon) return;

    if (fastMode) {
      const clickedValue = board[row][col];
      if (clickedValue !== BLANK) {
        // If clicking a filled cell, set it as active number
        setActiveNumber(clickedValue);
        setSelectedCell({ row, col }); // Optional: still select it
      } else {
        // If clicking empty cell
        if (activeNumber !== null) {
          // Fill with active number
          handleNumberInput(activeNumber, row, col);
        } else {
          setSelectedCell({ row, col });
        }
      }
    } else {
      setSelectedCell({ row, col });
      // Also set active number to the value of the cell if it has one, for highlighting
      const val = board[row][col];
      if (val !== BLANK) {
        setActiveNumber(val);
      } else {
        setActiveNumber(null);
      }
    }
  };

  const handleNumberInput = useCallback((num: number, targetRow?: number, targetCol?: number) => {
    if (gameWon) return;

    // Determine target cell
    let r, c;
    if (targetRow !== undefined && targetCol !== undefined) {
      r = targetRow;
      c = targetCol;
    } else {
      if (!selectedCell) return;
      r = selectedCell.row;
      c = selectedCell.col;
    }

    // If fast mode is on and we clicked the number pad, just set active number
    if (fastMode && targetRow === undefined) {
      setActiveNumber(num);
      setSelectedCell(null);
      return;
    }

    // Cannot edit initial cells
    if (initialBoard[r][c] !== BLANK) return;

    // Save to history before modifying
    setHistory(prev => [...prev, copyBoard(board)]);

    const newBoard = copyBoard(board);
    newBoard[r][c] = num;
    setBoard(newBoard);

    // Clear error for this cell if it was marked
    setErrorCells(prev => prev.filter(cell => cell.row !== r || cell.col !== c));

    if (autoCheck) {
      if (num !== solutionBoard[r][c]) {
        setErrorCells(prev => [...prev, { row: r, col: c }]);
      }
    }

    // Check for completed numbers
    const counts: { [key: number]: number } = {};
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = newBoard[r][c];
        if (val !== BLANK) {
          counts[val] = (counts[val] || 0) + 1;
        }
      }
    }
    const completed = Object.keys(counts)
      .map(Number)
      .filter(n => counts[n] === 9);
    setCompletedNumbers(completed);

    // Auto-switch active number if in fast mode
    if (fastMode) {
      let count = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (newBoard[i][j] === num) count++;
        }
      }

      if (count === 9) {
        let found = false;
        for (let i = 1; i <= 9; i++) {
          const candidate = ((num + i - 1) % 9) + 1;
          // Check if candidate is already completed (based on current board state)
          let candidateCount = 0;
          for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
            for (let colIdx = 0; colIdx < 9; colIdx++) {
              if (newBoard[rowIdx][colIdx] === candidate) candidateCount++;
            }
          }

          if (candidateCount < 9) {
            setActiveNumber(candidate);
            setSelectedCell(null);
            found = true;
            break;
          }
        }
        if (!found) {
          setActiveNumber(null);
        }
      }
    }

    // Check for win
    let isFull = true;
    let isCorrect = true;
    for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
      for (let colIdx = 0; colIdx < 9; colIdx++) {
        const val = newBoard[rowIdx][colIdx];
        if (val === BLANK) {
          isFull = false;
          break;
        }
        if (val !== solutionBoard[rowIdx][colIdx]) {
          isCorrect = false;
        }
      }
    }

    if (isFull && isCorrect) {
      setGameWon(true);
      // Format time for display
      const minutes = Math.floor(currentTime / 60);
      const secs = currentTime % 60;
      setFinalTime(`${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }
  }, [board, selectedCell, initialBoard, gameWon, autoCheck, solutionBoard, currentTime, fastMode]);

  const handleDelete = useCallback(() => {
    if (!selectedCell || gameWon) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== BLANK) return;

    // Save to history before modifying
    setHistory(prev => [...prev, copyBoard(board)]);

    const newBoard = copyBoard(board);
    newBoard[row][col] = BLANK;
    setBoard(newBoard);
    setErrorCells(prev => prev.filter(cell => cell.row !== row || cell.col !== col));
  }, [board, selectedCell, initialBoard, gameWon]);

  const handleUndo = useCallback(() => {
    if (gameWon || history.length === 0) return;
    const previousBoard = history[history.length - 1];
    setBoard(previousBoard);
    setHistory(prev => prev.slice(0, -1));
    // Re-calculate errors for the previous board state if needed, or just clear them
    // For simplicity, let's clear errors on undo to avoid stale error highlights
    setErrorCells([]);
  }, [history, gameWon]);

  const handleCheck = () => {
    const errors: { row: number; col: number }[] = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val !== BLANK) {
          if (val !== solutionBoard[r][c]) {
            errors.push({ row: r, col: c });
          }
        }
      }
    }
    setErrorCells(errors);

    if (errors.length === 0 && board.every(row => row.every(cell => cell !== BLANK))) {
      setGameWon(true);
      const minutes = Math.floor(currentTime / 60);
      const secs = currentTime % 60;
      setFinalTime(`${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }
  };

  const handleReset = () => {
    setBoard(copyBoard(initialBoard));
    setErrorCells([]);
    setGameWon(false);
    setResetTimerTrigger(prev => prev + 1);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameWon) return;

      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key);
        if (fastMode) {
          setActiveNumber(num);
        } else {
          handleNumberInput(num);
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleDelete();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key.startsWith('Arrow')) {
        // Handle navigation
        if (!selectedCell) {
          setSelectedCell({ row: 0, col: 0 });
          return;
        }
        let { row, col } = selectedCell;
        if (e.key === 'ArrowUp') row = Math.max(0, row - 1);
        if (e.key === 'ArrowDown') row = Math.min(8, row + 1);
        if (e.key === 'ArrowLeft') col = Math.max(0, col - 1);
        if (e.key === 'ArrowRight') col = Math.min(8, col + 1);
        setSelectedCell({ row, col });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberInput, handleDelete, selectedCell, gameWon, fastMode]);

  if (board.length === 0) return <div>Loading...</div>;

  return (
    <div className="app">
      <h1>Sudoku</h1>
      <Timer
        isRunning={!gameWon}
        resetTrigger={resetTimerTrigger}
        onTick={setCurrentTime}
      />
      <Board
        board={board}
        initialBoard={initialBoard}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
        errorCells={errorCells}
        activeNumber={activeNumber}
      />
      <NumberPad
        onNumberClick={(num: number) => handleNumberInput(num)}
        onDelete={handleDelete}
        activeNumber={activeNumber}
        completedNumbers={completedNumbers}
      />
      <Controls
        onNewGame={() => startNewGame(difficulty)}
        onReset={handleReset}
        onCheck={handleCheck}
        onUndo={handleUndo}
        difficulty={difficulty}
        onDifficultyChange={(d) => startNewGame(d)}
        autoCheck={autoCheck}
        onAutoCheckChange={setAutoCheck}
        fastMode={fastMode}
        onFastModeChange={setFastMode}
      />
      <Modal
        isOpen={gameWon}
        onClose={() => setGameWon(false)} // Just close modal, keep board state
        onNewGame={() => startNewGame(difficulty)}
        time={finalTime}
      />
    </div>
  );
};

export default App;
