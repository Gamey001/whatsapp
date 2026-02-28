// HomePage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  FaCircle,
  FaCommentAlt,
  FaEllipsisV,
  FaSearch,
  FaSlidersH,
  FaArrowLeft,
  FaUser,
  FaArchive,
  FaStar,
  FaCog,
  FaArrowRight,
} from "react-icons/fa";
import { Avatar } from "@mui/material";
import { FiCamera, FiMoreVertical, FiPhone, FiVideo } from "react-icons/fi";

// Helper to clean URLs
const cleanUrl = (url) => url.trim();

// Dummy user data
const currentUser = {
  name: "pablo",
  status: "Hey there! I am using WhatsApp Web.",
  avatar: cleanUrl("https://api.dicebear.com/7.x/initials/svg?seed=Pablo  "),
  lastSeen: "last seen today at 10:30 AM",
  phone: "+1 555-123-4567",
  email: "pablo@example.com",
  linkedDevices: 2,
};

// Dummy chats
const dummyChats = [
  {
    id: 1,
    name: "Maria Garcia",
    lastMessage: "Hey! Are we still meeting tomorrow?",
    timestamp: "10:30 AM",
    unread: 2,
    isOnline: true,
    avatar: cleanUrl("https://api.dicebear.com/7.x/initials/svg?seed=MariaG  "),
  },
  {
    id: 2,
    name: "Tech Group 🚀",
    lastMessage: "Alex: I pushed the fix!",
    timestamp: "Yesterday",
    unread: 0,
    isGroup: true,
    avatar: cleanUrl("https://api.dicebear.com/7.x/bottts/svg?seed=group1  "),
  },
  {
    id: 3,
    name: "Carlos Mendez",
    lastMessage: "Thanks for the help 😊",
    timestamp: "8:45 AM",
    unread: 0,
    isOnline: false,
    avatar: cleanUrl(
      "https://api.dicebear.com/7.x/initials/svg?seed=CarlosM  "
    ),
  },
  {
    id: 4,
    name: "Mom",
    lastMessage: "Don’t forget dinner tonight!",
    timestamp: "7:20 PM",
    unread: 1,
    isOnline: true,
    avatar: cleanUrl("https://api.dicebear.com/7.x/initials/svg?seed=Mom  "),
  },
  {
    id: 5,
    name: "Work Tasks",
    lastMessage: "Deadline moved to Friday",
    timestamp: "12/26/2025",
    unread: 0,
    isGroup: true,
    avatar: cleanUrl("https://api.dicebear.com/7.x/bottts/svg?seed=work  "),
  },
  {
    id: 6,
    name: "Diego",
    lastMessage: "Check out this meme 😂",
    timestamp: "12/25/2025",
    unread: 0,
    isOnline: false,
    avatar: cleanUrl("https://api.dicebear.com/7.x/initials/svg?seed=Diego  "),
  },
];

// Dummy messages
const dummyMessages = {
  1: [
    { id: 1, text: "Hey!", sender: "me", time: "10:28 AM" },
    {
      id: 2,
      text: "Hey! Are we still meeting tomorrow?",
      sender: "them",
      time: "10:30 AM",
    },
    { id: 3, text: "Yes! Same time 😊", sender: "me", time: "10:31 AM" },
  ],
  4: [
    { id: 1, text: "Hi Mom!", sender: "me", time: "7:15 PM" },
    {
      id: 2,
      text: "Don’t forget dinner tonight!",
      sender: "them",
      time: "7:20 PM",
    },
  ],
};

// Dummy Status Data
const dummyStatuses = [
  {
    id: 1,
    name: "Maria Garcia",
    avatar: cleanUrl("https://api.dicebear.com/7.x/initials/svg?seed=MariaG  "),
    statuses: [
      {
        id: 101,
        type: "image",
        url: cleanUrl(
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80  "
        ),
        timestamp: "Today, 10:00 AM",
      },
      {
        id: 102,
        type: "image",
        url: cleanUrl(
          "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80  "
        ),
        timestamp: "Today, 9:30 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Carlos Mendez",
    avatar: cleanUrl(
      "https://api.dicebear.com/7.x/initials/svg?seed=CarlosM  "
    ),
    statuses: [
      {
        id: 201,
        type: "video",
        url: cleanUrl(
          "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4  "
        ),
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: 3,
    name: "Mom",
    avatar: cleanUrl("https://api.dicebear.com/7.x/initials/svg?seed=Mom  "),
    statuses: [
      {
        id: 301,
        type: "image",
        url: cleanUrl(
          "https://images.unsplash.com/photo-1506744038136-44e41abeee44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80  "
        ),
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: 4,
    name: "Diego",
    avatar: cleanUrl("https://api.dicebear.com/7.x/initials/svg?seed=Diego  "),
    statuses: [
      {
        id: 401,
        type: "image",
        url: cleanUrl(
          "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80  "
        ),
        timestamp: "Dec 26, 2025",
      },
    ],
  },
  {
    id: 5,
    name: "Tech Group 🚀",
    avatar: cleanUrl("https://api.dicebear.com/7.x/bottts/svg?seed=group1  "),
    statuses: [
      {
        id: 501,
        type: "image",
        url: cleanUrl(
          "https://images.unsplash.com/photo-1518770660439-4636190af446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80  "
        ),
        timestamp: "Dec 25, 2025",
      },
    ],
  },
];

// ✅ Fixed StatusDetailView with ref to avoid stale closure
const StatusDetailView = ({ selectedStatusUser, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  const totalStatuses = selectedStatusUser.statuses.length;
  const STATUS_DURATION = 5000;

  const currentStatusIndexRef = useRef(currentStatusIndex);
  useEffect(() => {
    currentStatusIndexRef.current = currentStatusIndex;
  }, [currentStatusIndex]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const currentIndex = currentStatusIndexRef.current;
          if (currentIndex + 1 >= totalStatuses) {
            onClose();
            return 0;
          } else {
            setCurrentStatusIndex(currentIndex + 1);
            return 0;
          }
        }
        return prev + 1;
      });
    }, STATUS_DURATION / 100);

    return () => clearInterval(interval);
  }, [isPlaying, totalStatuses, onClose]);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
  }, [currentStatusIndex]);

  const goToNext = () => {
    if (currentStatusIndex + 1 >= totalStatuses) {
      onClose();
    } else {
      setCurrentStatusIndex((i) => i + 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const goToPrev = () => {
    if (currentStatusIndex > 0) {
      setCurrentStatusIndex((i) => i - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const currentStatus = selectedStatusUser.statuses[currentStatusIndex];

  return (
    <div className="flex-1 flex flex-col bg-black">
      <div className="flex items-center justify-between p-4 bg-black">
        <FaArrowLeft className="text-white cursor-pointer" onClick={onClose} />
        <div className="flex items-center">
          <Avatar
            src={selectedStatusUser.avatar}
            alt={selectedStatusUser.name}
            sx={{ width: 32, height: 32 }}
          />
          <span className="ml-2 text-white font-medium">
            {selectedStatusUser.name}
          </span>
        </div>
        <FaEllipsisV className="text-white cursor-pointer" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {currentStatus?.type === "image" ? (
          <img
            src={currentStatus.url}
            alt="Status"
            className="max-w-full max-h-[80vh] object-contain rounded-lg cursor-pointer"
            onClick={togglePlayPause}
          />
        ) : (
          <video
            src={currentStatus.url}
            controls
            autoPlay
            muted
            className="max-w-full max-h-[80vh] object-contain rounded-lg cursor-pointer"
            onClick={togglePlayPause}
          />
        )}
      </div>

      <div className="px-6 pb-4">
        <div className="flex space-x-1">
          {selectedStatusUser.statuses.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full ${
                index === currentStatusIndex ? "bg-white" : "bg-gray-500"
              }`}
            >
              {index === currentStatusIndex && (
                <div
                  className={`h-full rounded-full transition-all duration-50 ease-linear ${
                    isPlaying ? "bg-green-400" : "bg-gray-400"
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between px-6 pb-4">
        <button
          onClick={goToPrev}
          disabled={currentStatusIndex === 0}
          className={`p-2 rounded-full ${
            currentStatusIndex === 0
              ? "text-gray-500 cursor-not-allowed"
              : "text-white hover:bg-gray-700"
          }`}
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full text-white hover:bg-gray-700"
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        <button
          onClick={goToNext}
          className="p-2 rounded-full text-white hover:bg-gray-700"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

// Main HomePage Component
const HomePage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarView, setSidebarView] = useState("chats");
  const [selectedStatusUser, setSelectedStatusUser] = useState(null);

  const filteredChats = dummyChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderChatSidebar = () => (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            sx={{ width: 40, height: 40 }}
            className="cursor-pointer hover:opacity-90"
            onClick={() => setSidebarView("profile")}
          />
          <span className="font-medium text-gray-800">{currentUser.name}</span>
        </div>
        <div className="flex space-x-4 text-gray-600">
          <FaCommentAlt className="cursor-pointer hover:text-gray-800" />
          <FaCircle
            className="cursor-pointer hover:text-gray-800"
            onClick={() => setSidebarView("status")}
          />
          <FaEllipsisV className="cursor-pointer hover:text-gray-800" />
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSlidersH className="text-gray-500 ml-2 cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
              selectedChat?.id === chat.id ? "bg-blue-50" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="relative">
              <Avatar
                src={chat.avatar}
                alt={chat.name}
                sx={{ width: 48, height: 48 }}
              />
              {!chat.isGroup && chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 truncate">
                  {chat.name}
                </h3>
                <span className="text-xs text-gray-500">{chat.timestamp}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderProfileSidebar = () => (
    <>
      <div className="flex items-center p-4 border-b border-gray-200">
        <FaArrowLeft
          className="text-gray-600 cursor-pointer mr-4 hover:text-gray-800"
          onClick={() => setSidebarView("chats")}
        />
        <div>
          <h2 className="font-semibold text-gray-800">Settings</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {[
          { icon: <FaUser />, label: "Profile", key: "profile" },
          { icon: <FaArchive />, label: "Archived", key: "archived" },
          { icon: <FaStar />, label: "Starred messages", key: "starred" },
          { icon: <FaCog />, label: "Settings", key: "settings" },
        ].map((item) => (
          <button
            key={item.key}
            className="w-full flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
          >
            <span className="mr-4 text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );

  const renderStatusSidebar = () => (
    <>
      <div className="flex items-center p-4 border-b border-gray-200">
        <FaArrowLeft
          className="text-gray-600 cursor-pointer mr-4 hover:text-gray-800"
          onClick={() => {
            setSidebarView("chats");
            setSelectedStatusUser(null);
          }}
        />
        <div>
          <h2 className="font-semibold text-gray-800">Status</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {dummyStatuses.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedStatusUser(user)}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 48, height: 48 }}
            />
            <div className="ml-3 flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">
                {user.name}
              </h3>
              <p className="text-xs text-gray-500">
                {user.statuses[0]?.timestamp || "No recent status"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderMainContent = () => {
    if (selectedChat) {
      return (
        <div className="flex flex-col h-full">
          <div className="bg-white p-4 flex items-center justify-between border-b border-gray-300">
            <div className="flex items-center">
              <Avatar
                src={selectedChat.avatar}
                alt={selectedChat.name}
                sx={{ width: 40, height: 40 }}
              />
              <div className="ml-3">
                <h2 className="font-semibold">{selectedChat.name}</h2>
                <p className="text-xs text-gray-500">
                  {selectedChat.isOnline ? "online" : "offline"}
                </p>
              </div>
            </div>
            <div className="flex space-x-4 text-gray-600">
              <FiCamera className="cursor-pointer hover:text-gray-800" />
              <FiPhone className="cursor-pointer hover:text-gray-800" />
              <FiVideo className="cursor-pointer hover:text-gray-800" />
              <FiMoreVertical className="cursor-pointer hover:text-gray-800" />
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            <div className="max-w-3xl mx-auto">
              {dummyMessages[selectedChat.id]?.map((msg) => (
                <div
                  key={msg.id}
                  className={`my-2 flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      msg.sender === "me" ? "bg-green-100" : "bg-white"
                    } text-gray-800`}
                  >
                    {msg.text}
                    <div
                      className={`text-xs mt-1 ${
                        msg.sender === "me"
                          ? "text-right text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 border-t border-gray-300">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none text-gray-800"
            />
          </div>
        </div>
      );
    }

    if (sidebarView === "profile") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-100">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <Avatar
                src={currentUser.avatar}
                alt={currentUser.name}
                sx={{ width: 80, height: 80, margin: "0 auto" }}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {currentUser.name}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">{currentUser.status}</p>
            <p className="text-gray-500 text-xs mt-2">{currentUser.lastSeen}</p>

            <div className="mt-8 bg-white rounded-lg p-4 text-left w-full">
              <h3 className="font-medium text-gray-800 mb-3">Your Account</h3>
              <p className="text-sm text-gray-600">
                This is your WhatsApp account. You can update your profile,
                manage linked devices, and adjust privacy settings from the menu
                on the left.
              </p>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              WhatsApp Web • {new Date().getFullYear()}
            </div>
          </div>
        </div>
      );
    }

    if (sidebarView === "status" && selectedStatusUser) {
      return (
        <StatusDetailView
          selectedStatusUser={selectedStatusUser}
          onClose={() => {
            setSelectedStatusUser(null);
            setSidebarView("chats");
          }}
        />
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-100">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <svg
              width="300"
              height="200"
              viewBox="0 0 300 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="100"
                y="50"
                rx="10"
                ry="10"
                width="60"
                height="120"
                fill="#f0f9ff"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <circle cx="105" cy="55" r="2" fill="#94a3b8" />
              <rect x="110" y="80" width="10" height="20" fill="#94a3b8" />
              <rect x="120" y="70" width="10" height="30" fill="#94a3b8" />
              <rect x="130" y="60" width="10" height="40" fill="#94a3b8" />
              <rect
                x="180"
                y="40"
                rx="5"
                ry="5"
                width="100"
                height="60"
                fill="#f0f9ff"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <rect
                x="185"
                y="100"
                rx="3"
                ry="3"
                width="90"
                height="15"
                fill="#34d399"
              />
              <circle cx="230" cy="70" r="15" fill="#34d399" />
              <path
                d="M225,70 L235,75 L230,80"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="190" cy="90" r="70" fill="#d1fae5" opacity="0.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            WhatsApp Web
          </h1>
          <p className="text-gray-600">
            Send and receive messages without keeping your phone online. Use
            WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-white flex flex-col border-r border-gray-300">
        {sidebarView === "chats"
          ? renderChatSidebar()
          : sidebarView === "profile"
          ? renderProfileSidebar()
          : renderStatusSidebar()}
      </div>

      <div className="flex-1 flex flex-col">{renderMainContent()}</div>
    </div>
  );
};

export default HomePage;
