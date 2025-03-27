import React, { useState, useEffect } from 'react';

function ClockDisplay() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('ja-JP', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return (
        <div className="flex justify-center items-center my-4">
            <div className="text-7xl font-extrabold tracking-widest px-6 py-3 rounded-xl shadow-lg">
                {formattedTime}
            </div>
        </div>
    );
}

export default ClockDisplay;
