import { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const Profile = ({ handleCloseOpenProfile }) => {
  const { user, updateUser } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [nameInput, setNameInput] = useState(user?.username || "");
  const [bioInput, setBioInput] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);

  const saveField = async (field, value) => {
    setSaving(true);
    try {
      const body = {};
      body[field] = value;
      const res = await api.put("/users/profile", body);
      updateUser(res.data);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleNameSave = () => {
    if (nameInput.trim() && nameInput.trim() !== user?.username) {
      saveField("username", nameInput.trim());
    }
    setEditingName(false);
  };

  const handleBioSave = () => {
    if (bioInput !== user?.bio) {
      saveField("bio", bioInput);
    }
    setEditingBio(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 bg-[#008069] text-white px-4 py-4">
        <BsArrowLeft
          className="cursor-pointer text-xl"
          onClick={handleCloseOpenProfile}
        />
        <p className="font-semibold text-base">Profile</p>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-6 bg-[#f0f2f5]">
        <div className="relative">
          <img
            className="rounded-full w-28 h-28 object-cover bg-gray-200 border-4 border-white shadow"
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.username || "")}`}
            alt="Profile"
          />
        </div>
      </div>

      {/* Name Field */}
      <div className="border-t border-gray-100">
        <div className="px-5 pt-4 pb-1">
          <p className="text-xs text-[#00a884] font-semibold uppercase tracking-wide">Your name</p>
        </div>
        {!editingName ? (
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-sm text-gray-800">{user?.username || "Add your name"}</p>
            <BsPencil
              onClick={() => { setNameInput(user?.username || ""); setEditingName(true); }}
              className="cursor-pointer text-gray-400 hover:text-[#00a884]"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-5 py-2">
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleNameSave(); if (e.key === "Escape") setEditingName(false); }}
              className="flex-1 outline-none border-b-2 border-[#00a884] py-1 text-sm text-gray-800 bg-transparent"
              placeholder="Enter your name"
            />
            <BsCheck2
              onClick={handleNameSave}
              className="cursor-pointer text-[#00a884] text-lg"
            />
          </div>
        )}
        <p className="px-5 pb-3 text-xs text-gray-400">
          This is not your username, this name will be visible to your WhatsApp contacts.
        </p>
      </div>

      {/* Bio Field */}
      <div className="border-t border-gray-100">
        <div className="px-5 pt-4 pb-1">
          <p className="text-xs text-[#00a884] font-semibold uppercase tracking-wide">About</p>
        </div>
        {!editingBio ? (
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-sm text-gray-800">{user?.bio || "Hey there! I am using WhatsApp."}</p>
            <BsPencil
              onClick={() => { setBioInput(user?.bio || ""); setEditingBio(true); }}
              className="cursor-pointer text-gray-400 hover:text-[#00a884]"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-5 py-2">
            <input
              autoFocus
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleBioSave(); if (e.key === "Escape") setEditingBio(false); }}
              className="flex-1 outline-none border-b-2 border-[#00a884] py-1 text-sm text-gray-800 bg-transparent"
              placeholder="Say something about yourself"
            />
            <BsCheck2
              onClick={handleBioSave}
              className="cursor-pointer text-[#00a884] text-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
