import React, { useState, useRef, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEmojiSmile, BsFilter, BsThreeDotsVertical, BsPersonPlus } from "react-icons/bs";
import { BiCommentDetail } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { IoSend, IoArrowBack } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import ChatCard from "./chatCard/ChatCard";
import MessageCard from "./messageCard/MessageCard";
import Profile from "./Profile/Profile";
import VoiceRecorder from "./voiceNote/VoiceRecorder";
import CreateGroupModal from "./groupChat/CreateGroupModal";
import NewChatModal from "./newChat/NewChatModal";

const HomePage = () => {
  const { user, logout } = useAuth();
  const {
    conversations,
    messages,
    onlineUsers,
    typingUsers,
    unreadCounts,
    selectConversation,
    sendMessage,
    sendVoiceNote,
    startTyping,
    stopTyping,
    createConversation,
    addMemberToGroup,
  } = useSocketContext();

  const [sidebarView, setSidebarView] = useState("chats"); // "chats" | "profile"
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [content, setContent] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberSearch, setAddMemberSearch] = useState("");
  const [addMemberResults, setAddMemberResults] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const addMemberTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter conversations by search
  const filteredConversations = conversations.filter((c) => {
    if (!searchTerm) return true;
    const isGroup = c.type === "group";
    const name = isGroup
      ? c.groupName
      : c.members?.find((m) => m._id !== user._id)?.username || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle chat selection
  const handleSelectChat = (conversation) => {
    setSelectedConversation(conversation);
    selectConversation(conversation._id);
    setShowAddMember(false);
    inputRef.current?.focus();
  };

  // Back to chat list (mobile)
  const handleBack = () => {
    setSelectedConversation(null);
  };

  // Typing indicator debounce
  const handleInputChange = (e) => {
    setContent(e.target.value);
    if (selectedConversation) {
      startTyping(selectedConversation._id);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(selectedConversation._id);
      }, 1500);
    }
  };

  // Send text message
  const handleSend = () => {
    if (!content.trim() || !selectedConversation) return;
    clearTimeout(typingTimeoutRef.current);
    stopTyping(selectedConversation._id);
    sendMessage(selectedConversation._id, content.trim());
    setContent("");
    inputRef.current?.focus();
  };

  // Send voice note
  const handleVoiceNoteSend = (blob, duration) => {
    if (selectedConversation) {
      sendVoiceNote(selectedConversation._id, blob, duration);
    }
  };

  // Start a new 1-on-1 chat
  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  // Add member search (for group chats)
  const handleAddMemberSearch = (val) => {
    setAddMemberSearch(val);
    clearTimeout(addMemberTimeoutRef.current);
    if (!val.trim()) {
      setAddMemberResults([]);
      return;
    }
    addMemberTimeoutRef.current = setTimeout(async () => {
      try {
        const api = (await import("../utils/api")).default;
        const res = await api.get(`/users/search?q=${encodeURIComponent(val)}`);
        // Filter out users already in the group
        const memberIds = selectedConversation.members.map((m) => m._id);
        setAddMemberResults(res.data.filter((u) => !memberIds.includes(u._id)));
      } catch {
        setAddMemberResults([]);
      }
    }, 400);
  };

  const handleAddMember = async (userId) => {
    await addMemberToGroup(selectedConversation._id, userId);
    setAddMemberResults((prev) => prev.filter((u) => u._id !== userId));
    setAddMemberSearch("");
  };

  // Derive chat header info
  const getHeaderInfo = () => {
    if (!selectedConversation) return {};
    const isGroup = selectedConversation.type === "group";
    if (isGroup) {
      return {
        name: selectedConversation.groupName,
        avatar: selectedConversation.groupAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(selectedConversation.groupName || "group")}`,
        subtitle: `${selectedConversation.members?.length || 0} members`,
        isGroup: true,
        isAdmin: selectedConversation.createdBy === user._id,
      };
    }
    const other = selectedConversation.members?.find((m) => m._id !== user._id);
    const isOnline = other && onlineUsers.has(other._id);
    return {
      name: other?.username || "Unknown",
      avatar: other?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(other?.username || "")}`,
      subtitle: isOnline ? "online" : other?.lastSeen ? `last seen ${new Date(other.lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "",
      isGroup: false,
      isAdmin: false,
    };
  };

  const header = getHeaderInfo();
  const typingInfo = selectedConversation ? typingUsers[selectedConversation._id] : null;

  // ─── SIDEBAR ─────────────────────────────────────────────
  const renderSidebar = () => (
    <div className={`w-full md:w-80 bg-white flex flex-col border-r border-gray-200 h-screen ${selectedConversation ? "hidden md:flex" : "flex"}`}>
      {sidebarView === "profile" ? (
        <Profile handleCloseOpenProfile={() => setSidebarView("chats")} />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#f0f2f5]">
            <div
              onClick={() => setSidebarView("profile")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username || "")}`}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover bg-gray-200"
              />
              <span className="text-sm font-semibold text-gray-800">{user.username}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <BiCommentDetail
                className="cursor-pointer hover:text-gray-700 text-lg"
                onClick={handleNewChat}
              />
              <FaUsers
                className="cursor-pointer hover:text-gray-700 text-lg"
                onClick={() => setShowGroupModal(true)}
              />
              <BsThreeDotsVertical
                className="cursor-pointer hover:text-gray-700"
                onClick={logout}
              />
            </div>
          </div>

          {/* Search */}
          <div className="px-3 py-2 bg-[#f0f2f5]">
            <div className="flex items-center bg-[#e8e9ec] rounded-lg px-3 py-1.5">
              <AiOutlineSearch className="text-gray-500 mr-2" style={{ fontSize: "16px" }} />
              <input
                type="text"
                placeholder="Search or start new chat"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
              />
              <BsFilter className="text-gray-500 ml-2 cursor-pointer" style={{ fontSize: "14px" }} />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto bg-white">
            {filteredConversations.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">
                {searchTerm ? "No chats found" : "No conversations yet.\nClick the chat icon to start one."}
              </p>
            )}
            {filteredConversations.map((conversation) => {
              const isGroup = conversation.type === "group";
              const other = !isGroup
                ? conversation.members?.find((m) => m._id !== user._id)
                : null;
              const isOnline = other && onlineUsers.has(other._id);

              return (
                <ChatCard
                  key={conversation._id}
                  conversation={conversation}
                  isSelected={selectedConversation?._id === conversation._id}
                  onClick={() => handleSelectChat(conversation)}
                  currentUserId={user._id}
                  isOnline={isOnline}
                  unreadCount={unreadCounts[conversation._id] || 0}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  // ─── MAIN CONTENT ────────────────────────────────────────
  const renderWelcome = () => (
    <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#f0f2f5]">
      <div className="text-center max-w-md px-8">
        <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-[#ddf1f7] flex items-center justify-center">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="#00a884">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.98-.34-2.22.08-2.81.78l-1.6 2.03c-2.83-1.35-5.48-3.9-6.89-6.83l2.03-1.66c.71-.6 1.08-1.82.75-2.8-.37-1.11-.56-2.3-.56-3.53 0-1.71-1.01-3.29-2.72-3.29H5.11C3.38 3 2 4.3 2 5.97c0 9.94 8.06 18 17.99 18 1.66 0 2.99-1.38 2.99-3.08v-2.88c0-1.7-1.33-3.01-2.99-3.01z"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">WhatsApp Web</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Send and receive messages without keeping your phone online. Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
        </p>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className={`flex-1 flex flex-col h-screen ${selectedConversation ? "flex" : "hidden md:flex"}`}>
      {/* Chat Header */}
      <div className="bg-[#f0f2f5] border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="md:hidden text-gray-600 mr-1">
            <IoArrowBack style={{ fontSize: "20px" }} />
          </button>
          <div className="relative">
            <img
              src={header.avatar}
              alt={header.name}
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{header.name}</p>
            <p className="text-xs text-gray-500">
              {typingInfo ? `${typingInfo.username} is typing...` : header.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
          {header.isGroup && header.isAdmin && (
            <BsPersonPlus
              className="cursor-pointer hover:text-[#00a884] text-lg"
              onClick={() => setShowAddMember(!showAddMember)}
            />
          )}
          <BsThreeDotsVertical className="cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Add Member Panel */}
      {showAddMember && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5 mb-2">
            <AiOutlineSearch className="text-gray-400 mr-2" style={{ fontSize: "14px" }} />
            <input
              autoFocus
              type="text"
              placeholder="Search users to add"
              value={addMemberSearch}
              onChange={(e) => handleAddMemberSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="max-h-36 overflow-y-auto">
            {addMemberResults.map((u) => (
              <div
                key={u._id}
                onClick={() => handleAddMember(u._id)}
                className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 cursor-pointer rounded-md"
              >
                <img
                  src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.username)}`}
                  alt={u.username}
                  className="w-8 h-8 rounded-full object-cover bg-gray-200"
                />
                <span className="text-sm text-gray-700">{u.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3"
        style={{ background: "#efeae2 url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cg fill=%22%23d4ccc4%22 fill-opacity=%220.15%22%3E%3Ccircle cx=%2210%22 cy=%2210%22 r=%221%22/%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%221%22/%3E%3Ccircle cx=%2270%22 cy=%2270%22 r=%221%22/%3E%3Ccircle cx=%2290%22 cy=%2290%22 r=%221%22/%3E%3Ccircle cx=%2250%22 cy=%2210%22 r=%221%22/%3E%3Ccircle cx=%2210%22 cy=%2250%22 r=%221%22/%3E%3Ccircle cx=%2270%22 cy=%2230%22 r=%221%22/%3E%3Ccircle cx=%2230%22 cy=%2270%22 r=%221%22/%3E%3Ccircle cx=%2290%22 cy=%2250%22 r=%221%22/%3E%3C/g%3E%3C/svg%3E') repeat" }}
      >
        {messages.map((msg, i) => (
          <MessageCard
            key={msg._id || i}
            message={msg}
            isOwn={msg.sender?._id === user._id || msg.sender === user._id}
            isGroup={selectedConversation?.type === "group"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="bg-[#f0f2f5] border-t border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <BsEmojiSmile className="cursor-pointer hover:text-[#00a884] text-lg" />
          <ImAttachment className="cursor-pointer hover:text-[#00a884] text-lg" />
        </div>

        <div className="flex-1 flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1.5 gap-2">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message"
            className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
          />
          {content.trim() && (
            <button onClick={handleSend} className="text-[#00a884] hover:opacity-80">
              <IoSend style={{ fontSize: "20px" }} />
            </button>
          )}
        </div>

        <VoiceRecorder onSend={handleVoiceNoteSend} conversationId={selectedConversation?._id} />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      {selectedConversation ? renderChat() : renderWelcome()}

      {/* New DM Modal */}
      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onCreated={(conversation) => {
            setShowNewChatModal(false);
            handleSelectChat(conversation);
          }}
        />
      )}

      {/* Group Creation Modal */}
      {showGroupModal && (
        <CreateGroupModal
          onClose={() => setShowGroupModal(false)}
          onCreated={(conversation) => {
            setShowGroupModal(false);
            handleSelectChat(conversation);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
