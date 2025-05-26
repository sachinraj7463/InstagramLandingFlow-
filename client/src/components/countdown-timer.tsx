import { useState, useEffect } from "react";

interface CountdownTimerProps {
  duration: number;
  onComplete: () => void;
  color: string;
  label: string;
}

export function CountdownTimer({ duration, onComplete, color, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  const circumference = 2 * Math.PI * 45; // radius = 45

  useEffect(() => {
    // Start countdown after a brief delay
    const startTimer = setTimeout(() => {
      setIsActive(true);
    }, 100);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onComplete]);

  const progress = (duration - timeLeft) / duration;
  const dashOffset = circumference - (progress * circumference);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#e9ecef" 
            strokeWidth="8"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-100 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {timeLeft}
          </span>
        </div>
      </div>
      <p className="text-blog-muted">{label}</p>
    </div>
  );
}
