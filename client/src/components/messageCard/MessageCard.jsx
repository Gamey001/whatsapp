import React from "react";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import VoicePlayer from "../voiceNote/VoicePlayer";
import { SERVER_URL } from "../../utils/api";

const MessageCard = ({ message, isOwn, isGroup }) => {
  const isVoiceNote = message.type === "voiceNote";

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Read receipt icon
  const ReadIcon = message.read ? BsCheck2All : BsCheck2;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
      <div className={`max-w-[65%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
        {/* Sender name in group chats (only for received messages) */}
        {isGroup && !isOwn && message.sender?.username && (
          <span className="text-xs font-semibold text-[#00a884] mb-0.5 px-2">
            {message.sender.username}
          </span>
        )}

        {/* Bubble */}
        <div
          className={`rounded-lg px-3 py-2 shadow-sm ${
            isOwn ? "bg-[#d9fdd3] rounded-tr-none" : "bg-white rounded-tl-none"
          }`}
        >
          {isVoiceNote ? (
            <VoicePlayer
              url={`${SERVER_URL}/${message.voiceNoteUrl}`}
              duration={message.voiceNoteDuration}
              isOwn={isOwn}
            />
          ) : (
            <p className="text-sm text-gray-800 leading-relaxed">{message.content}</p>
          )}

          {/* Timestamp + read receipt */}
          <div className={`flex items-center mt-1 ${isOwn ? "justify-end" : "justify-start"} gap-1`}>
            <span className="text-xs text-gray-400">{formatTime(message.createdAt)}</span>
            {isOwn && <ReadIcon className="text-gray-400" style={{ fontSize: "12px" }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
