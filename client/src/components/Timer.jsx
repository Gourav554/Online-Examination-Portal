import { useEffect, useRef, useState } from "react";
import "./Timer.css";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Counts down from initialSeconds and calls onExpire exactly once when it hits 0.
function Timer({ initialSeconds, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpireRef.current();
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const isLow = secondsLeft <= 60;

  return <div className={`exam-timer ${isLow ? "exam-timer-low" : ""}`}>Time Left: {formatTime(secondsLeft)}</div>;
}

export default Timer;
