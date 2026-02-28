import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const VoicePlayer = ({ url, duration, isOwn }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  // Generate a static random waveform per instance
  const barsRef = useRef(
    Array.from({ length: 30 }, () => 0.2 + Math.random() * 0.8)
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = (e) => {
      console.error("Audio playback error:", audio.error?.message || e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio play failed:", err);
        setIsPlaying(false);
      }
    }
  };

  const formatDuration = (secs) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = totalDuration > 0 ? currentTime / totalDuration : 0;
  const bars = barsRef.current;

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={url} preload="auto" />

      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isOwn ? "bg-[#00a884] text-white" : "bg-gray-200 text-gray-700"}`}
      >
        {isPlaying ? <FaPause style={{ fontSize: "12px" }} /> : <FaPlay style={{ fontSize: "12px", marginLeft: "2px" }} />}
      </button>

      {/* Waveform bars */}
      <div className="flex items-center gap-px flex-1" style={{ height: "28px" }}>
        {bars.map((height, i) => {
          const barProgress = (i + 1) / bars.length;
          const isActive = barProgress <= progress;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-colors ${
                isActive
                  ? isOwn ? "bg-[#008069]" : "bg-[#00a884]"
                  : isOwn ? "bg-[#a8d5ba]" : "bg-gray-300"
              }`}
              style={{ height: `${height * 100}%` }}
            />
          );
        })}
      </div>

      {/* Duration */}
      <span className="text-xs text-gray-500 flex-shrink-0 w-12 text-right">
        {formatDuration(isPlaying ? currentTime : totalDuration)}
      </span>
    </div>
  );
};

export default VoicePlayer;
