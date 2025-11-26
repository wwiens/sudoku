import React, { useEffect, useState } from 'react';

interface TimerProps {
    isRunning: boolean;
    resetTrigger: number;
    onTick: (seconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ isRunning, resetTrigger, onTick }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        setSeconds(0);
        onTick(0);
    }, [resetTrigger, onTick]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(s => {
                    const newTime = s + 1;
                    onTick(newTime);
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, onTick]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer">
            Time: {formatTime(seconds)}
        </div>
    );
};

export default Timer;
