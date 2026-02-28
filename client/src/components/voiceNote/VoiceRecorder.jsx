import React, { useState, useRef, useCallback } from "react";
import { BsMicFill, BsStopFill } from "react-icons/bs";

const VoiceRecorder = ({ onSend, conversationId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Pick a supported MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        const duration = (Date.now() - startTimeRef.current) / 1000;
        // Stop all tracks to release the mic
        stream.getTracks().forEach((track) => track.stop());
        onSend(blob, duration);
      };

      mediaRecorder.start(1000);
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      console.error("Mic access denied or unavailable:", err);
    }
  }, [onSend]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    setElapsed(0);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (isRecording) {
    return (
      <div className="flex items-center gap-3 flex-1 bg-red-50 rounded-lg px-3 py-1.5">
        {/* Stop button */}
        <button
          onClick={stopRecording}
          className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white flex-shrink-0"
        >
          <BsStopFill style={{ fontSize: "14px" }} />
        </button>

        {/* Animated recording indicator */}
        <div className="flex items-center gap-px flex-1" style={{ height: "24px" }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="flex-1 bg-red-400 rounded-sm"
              style={{
                height: `${20 + Math.random() * 80}%`,
                animation: "pulse 0.6s ease-in-out infinite",
                animationDelay: `${i * 0.04}s`,
              }}
            />
          ))}
        </div>

        {/* Elapsed time */}
        <span className="text-sm font-semibold text-red-600 flex-shrink-0">{formatTime(elapsed)}</span>
      </div>
    );
  }

  return (
    <button
      onClick={startRecording}
      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#00a884] transition-colors"
    >
      <BsMicFill style={{ fontSize: "20px" }} />
    </button>
  );
};

export default VoiceRecorder;
