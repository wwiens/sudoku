import React from 'react';
import '../styles/Controls.css';

interface ControlsProps {
    onNewGame: () => void;
    onReset: () => void;
    onCheck: () => void;
    onUndo: () => void;
    difficulty: 'easy' | 'medium' | 'hard';
    onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
    autoCheck: boolean;
    onAutoCheckChange: (enabled: boolean) => void;
    fastMode: boolean;
    onFastModeChange: (enabled: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({ onNewGame, onReset, onCheck, onUndo, difficulty, onDifficultyChange, autoCheck, onAutoCheckChange, fastMode, onFastModeChange }) => {
    return (
        <div className="controls">
            <div className="settings-row">
                <div className="difficulty-selector">
                    <label>Difficulty:</label>
                    <select value={difficulty} onChange={(e) => onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard')}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div className="toggles">
                    <div className="auto-check-toggle">
                        <label>
                            <input
                                type="checkbox"
                                checked={autoCheck}
                                onChange={(e) => onAutoCheckChange(e.target.checked)}
                            />
                            Auto Check
                        </label>
                    </div>
                    <div className="fast-mode-toggle">
                        <label>
                            <input
                                type="checkbox"
                                checked={fastMode}
                                onChange={(e) => onFastModeChange(e.target.checked)}
                            />
                            Fast Mode
                        </label>
                    </div>
                </div>
            </div>
            <div className="actions">
                <button onClick={onUndo}>Undo</button>
                <button onClick={onNewGame}>New Game</button>
                <button onClick={onReset}>Reset</button>
                <button onClick={onCheck}>Check</button>
            </div>
        </div>
    );
};

export default Controls;
