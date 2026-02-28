import React, { useEffect, useState } from "react";
import { stories } from "./DummyStory";
import "./ProgressBar.css";
import ProgressBar from "./ProgressBar";

const StatusViewer = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNextStory = () => {
    setCurrentStoryIndex((prev) => (prev < stories.length - 1 ? prev + 1 : 0));
    setActiveIndex((prev) => (prev < stories.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNextStory();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center h-[100vh] bg-slate-900">
        <div className="relative">
          <img
            className="max-h-[96vh] object-contain"
            src={stories[currentStoryIndex]?.image}
            alt={`story-${currentStoryIndex}`}
          />
          <div className="absolute top-0 flex w-full">
            {stories.map((item, index) => (
              <ProgressBar
                key={item.image}
                duration={2000}
                index={index}
                activeIndex={activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusViewer;
