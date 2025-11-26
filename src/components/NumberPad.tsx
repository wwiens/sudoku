import React from 'react';
import '../styles/NumberPad.css';

interface NumberPadProps {
    onNumberClick: (num: number) => void;
    onDelete: () => void;
    activeNumber: number | null;
    completedNumbers: number[];
}

const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, onDelete, activeNumber, completedNumbers }) => {
    return (
        <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                    key={num}
                    onClick={() => onNumberClick(num)}
                    className={`${activeNumber === num ? 'active' : ''} ${completedNumbers.includes(num) ? 'completed' : ''}`}
                >
                    {num}
                </button>
            ))}
            <button className="delete-btn" onClick={onDelete}>Del</button>
        </div>
    );
};

export default NumberPad;
