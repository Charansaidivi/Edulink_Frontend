import React, { useEffect, useState } from 'react';

// Countdown Timer Component
const CountdownTimer = ({ startTime, endTime, recurrence }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(startTime, endTime));
  console.log(startTime, endTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(startTime, endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  function calculateTimeLeft(startTime, endTime) {
    const now = new Date();
    let start = new Date(startTime);
    let end = new Date(endTime); // Ensure endTime is a valid date

    // Adjust for time zone differences
    start = new Date(start.getTime() + start.getTimezoneOffset() * 60000);
    end = new Date(end.getTime() + end.getTimezoneOffset() * 60000);

    if (recurrence === 'daily') {
      while (end < now) {
        end.setDate(end.getDate() + 1);
      }
    }

    let difference = start - now;

    // If the current class has ended, set the timer for the next class
    if (difference <= 0) {
      difference = end - now;
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // If less than a day, set days to 0
    return { days: days > 0 ? days : 0, hours, minutes, seconds };
  }

  return (
    <div>
      <h1>Countdown Timer</h1>
      <div>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    </div>
  );
};

export default CountdownTimer;