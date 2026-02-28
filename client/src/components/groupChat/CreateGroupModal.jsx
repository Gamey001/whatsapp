import React, { useState, useRef } from "react";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import api from "../../utils/api";

const CreateGroupModal = ({ onClose, onCreated }) => {
  const [step, setStep] = useState("members"); // "members" | "name"
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
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

  const toggleSelect = (user) => {
    setSelected((prev) =>
      prev.find((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const memberIds = selected.map((u) => u._id);
      const res = await api.post("/conversations", {
        type: "group",
        members: memberIds,
        groupName,
      });
      onCreated(res.data);
    } catch (err) {
      console.error("Failed to create group:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 pt-16">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#00a884] text-white">
          <div>
            <h2 className="font-semibold text-base">
              {step === "members" ? "New Group" : "Group Info"}
            </h2>
            <p className="text-xs opacity-80">
              {step === "members"
                ? `Add members (${selected.length} selected)`
                : "Add a subject"}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full">
            <AiOutlineClose style={{ fontSize: "18px" }} />
          </button>
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3 pt-2 pb-1">
            {selected.map((u) => (
              <span
                key={u._id}
                className="inline-flex items-center bg-[#e8f5e9] text-[#00a884] text-xs font-medium rounded-full px-2 py-0.5 gap-1"
              >
                {u.username}
                <button onClick={() => toggleSelect(u)} className="hover:text-red-500">✕</button>
              </span>
            ))}
          </div>
        )}

        {step === "members" ? (
          <>
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
            <div className="max-h-56 overflow-y-auto">
              {searchResults.map((user) => {
                const isSelected = selected.find((u) => u._id === user._id);
                return (
                  <div
                    key={user._id}
                    onClick={() => toggleSelect(user)}
                    className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}`}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover bg-gray-200"
                    />
                    <span className="ml-3 flex-1 text-sm font-medium text-gray-800">{user.username}</span>
                    {isSelected && <BsCheck className="text-[#00a884]" style={{ fontSize: "18px" }} />}
                  </div>
                );
              })}
              {searchTerm && searchResults.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4">No users found</p>
              )}
            </div>

            {/* Next button */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                disabled={selected.length < 1}
                onClick={() => setStep("name")}
                className="w-full bg-[#00a884] text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-[#008069] transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Group name input */}
            <div className="px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-500 text-xs">Photo</span>
                </div>
                <input
                  autoFocus
                  type="text"
                  placeholder="Group subject"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="flex-1 border-b-2 border-[#00a884] outline-none py-1 text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 px-4 pb-4">
              <button
                onClick={() => setStep("members")}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
              >
                Back
              </button>
              <button
                disabled={!groupName.trim() || loading}
                onClick={handleCreate}
                className="flex-1 bg-[#00a884] text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-[#008069] transition-colors"
              >
                {loading ? "Creating..." : "Create Group"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateGroupModal;
