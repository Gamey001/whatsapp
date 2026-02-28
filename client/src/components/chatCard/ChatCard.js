import React from "react";
import { FaUsers } from "react-icons/fa";
import { BsCheck2, BsCheck2All, BsMicFill } from "react-icons/bs";

const ChatCard = ({ conversation, isSelected, onClick, currentUserId, isOnline, unreadCount }) => {
  const isGroup = conversation.type === "group";

  // Determine display name and avatar
  const otherMember = !isGroup
    ? conversation.members?.find((m) => m._id !== currentUserId)
    : null;
  const displayName = isGroup ? conversation.groupName : otherMember?.username || "Unknown";
  const avatar = isGroup
    ? conversation.groupAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(conversation.groupName || "group")}`
    : otherMember?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

  // Last message preview
  const lastMsg = conversation.lastMessage;
  let previewText = "Start a conversation";
  let previewIcon = null;
  if (lastMsg) {
    if (lastMsg.type === "voiceNote") {
      previewIcon = <BsMicFill className="mr-1 text-gray-400" style={{ fontSize: "11px" }} />;
      previewText = "Voice message";
    } else {
      const isMine = lastMsg.sender?._id === currentUserId || lastMsg.sender === currentUserId;
      previewText = isMine
        ? `You: ${lastMsg.content || ""}`
        : `${lastMsg.sender?.username || ""}: ${lastMsg.content || ""}`;
    }
  }

  // Format timestamp
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors
        ${isSelected ? "bg-[#e8f5e9]" : "hover:bg-gray-50"}`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatar}
          alt={displayName}
          className="w-12 h-12 rounded-full object-cover bg-gray-200"
        />
        {/* Online dot — only for 1-on-1 */}
        {!isGroup && isOnline && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#00a884] border-2 border-white rounded-full" />
        )}
        {/* Group icon badge */}
        {isGroup && (
          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#00a884] rounded-full flex items-center justify-center">
            <FaUsers className="text-white" style={{ fontSize: "10px" }} />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
            {formatTime(conversation.lastActivity)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <p className="text-xs text-gray-500 truncate flex items-center">
            {previewIcon}
            {previewText}
          </p>
          {unreadCount > 0 && (
            <span className="bg-[#00a884] text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 flex-shrink-0 ml-2">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
