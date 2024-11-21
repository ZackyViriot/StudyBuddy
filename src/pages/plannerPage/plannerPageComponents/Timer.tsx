import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

const Timer: React.FC = () => {
    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isRunning) {
            intervalId = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning]);

    const formatTime = (timeInSeconds: number): string => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Study Timer</h2>
                <div className="text-3xl font-mono tracking-wider">{formatTime(time)}</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`p-3 rounded-lg ${
                            isRunning 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-green-500 hover:bg-green-600'
                        } text-white transition-colors`}
                    >
                        {isRunning ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                        onClick={() => {
                            setIsRunning(false);
                            setTime(0);
                        }}
                        className="p-3 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Timer;