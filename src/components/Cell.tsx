import React from 'react';
import '../styles/Cell.css';

interface CellProps {
    value: number;
    isInitial: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    isActiveNumber: boolean;
    isError: boolean;
    onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, isInitial, isSelected, isHighlighted, isActiveNumber, isError, onClick }) => {
    const classNames = [
        'cell',
        isInitial ? 'initial' : '',
        isSelected ? 'selected' : '',
        isHighlighted ? 'highlighted' : '',
        isActiveNumber ? 'active-number' : '',
        isError ? 'error' : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} onClick={onClick}>
            {value !== 0 ? value : ''}
        </div>
    );
};

export default Cell;
