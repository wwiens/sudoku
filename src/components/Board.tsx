import React from 'react';
import Cell from './Cell';
import '../styles/Board.css';
import type { Board as BoardType } from '../utils/sudoku';

interface BoardProps {
    board: BoardType;
    initialBoard: BoardType;
    selectedCell: { row: number; col: number } | null;
    onCellClick: (row: number, col: number) => void;
    errorCells?: { row: number; col: number }[];
    activeNumber: number | null;
}

const Board: React.FC<BoardProps> = ({ board, initialBoard, selectedCell, onCellClick, errorCells = [], activeNumber }) => {
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="board-row">
                    {row.map((cellValue, colIndex) => {
                        const isInitial = initialBoard[rowIndex][colIndex] !== 0;
                        const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                        const isHighlighted = !activeNumber && selectedCell && (selectedCell.row === rowIndex || selectedCell.col === colIndex || (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) && Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)));
                        const isError = errorCells.some(cell => cell.row === rowIndex && cell.col === colIndex);
                        const isActiveNumber = activeNumber !== null && cellValue === activeNumber;

                        return (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                value={cellValue}
                                isInitial={isInitial}
                                isSelected={isSelected}
                                isHighlighted={!!isHighlighted && !isSelected}
                                isActiveNumber={isActiveNumber}
                                isError={isError}
                                onClick={() => onCellClick(rowIndex, colIndex)}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Board;
