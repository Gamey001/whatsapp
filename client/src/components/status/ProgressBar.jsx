import React, { useEffect, useState } from "react";

const ProgressBar = ({ index, activeIndex, duration }) => {
  const isActive = index === activeIndex;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isActive) {
      setProgress(0); // reset when activated
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(intervalId);
            return prev;
          }
        });
      }, duration / 100); // increment every duration/100 ms
    }

    return () => clearInterval(intervalId);
  }, [isActive, duration]);

  return (
    <div className={`progress-bar-container ${isActive ? "active" : ""}`}>
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;
