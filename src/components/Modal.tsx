import React from 'react';
import '../styles/Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNewGame: () => void;
    time: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onNewGame, time }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Congratulations!</h2>
                <p>You solved the puzzle!</p>
                <p className="time-stat">Time: {time}</p>
                <div className="modal-actions">
                    <button onClick={onNewGame}>New Game</button>
                    <button onClick={onClose} className="secondary">Close</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
