import React, { useState, useRef } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import api from "../../utils/api";

const NewChatModal = ({ onClose, onCreated }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef(null);

  const handleSearch = (val) => {
    setSearchTerm(val);
    clearTimeout(searchTimeout.current);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(`/users/search?q=${encodeURIComponent(val)}`);
        setSearchResults(res.data);
      } catch {
        setSearchResults([]);
      }
    }, 400);
  };

  const handleSelect = async (user) => {
    setLoading(true);
    try {
      const res = await api.post("/conversations", {
        type: "private",
        members: [user._id],
      });
      onCreated(res.data);
    } catch (err) {
      console.error("Failed to create conversation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 pt-16">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#00a884] text-white">
          <h2 className="font-semibold text-base">New Chat</h2>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full">
            <AiOutlineClose style={{ fontSize: "18px" }} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
            <AiOutlineSearch className="text-gray-400 mr-2" style={{ fontSize: "16px" }} />
            <input
              autoFocus
              type="text"
              placeholder="Search contacts"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user._id}
              onClick={() => !loading && handleSelect(user)}
              className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}`}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover bg-gray-200"
              />
              <span className="ml-3 flex-1 text-sm font-medium text-gray-800">{user.username}</span>
            </div>
          ))}
          {searchTerm && searchResults.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-4">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
