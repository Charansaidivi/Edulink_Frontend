import React, { useEffect, useState } from 'react';
import FlipClock from 'react-flip-clock';

// Countdown Timer Component
const CountdownTimer = ({ startTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(startTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(startTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  function calculateTimeLeft(startTime) {
    const now = new Date();
    const start = new Date(startTime); // Ensure startTime is a valid date
    const difference = start - now;

    if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  return (
    <div>
      <FlipClock
        duration={timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds}
        autoStart={true}
        showDays={false}
        showHours={true}
        showMinutes={true}
        showSeconds={true}
      />
    </div>
  );
};

export default CountdownTimer;