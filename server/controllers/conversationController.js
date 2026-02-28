const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// io instance is set by server.js after Socket.io initializes
let ioInstance = null;
const setIo = (io) => { ioInstance = io; };
const getIo = () => ioInstance;

const createConversation = async (req, res) => {
  try {
    const { type, members, groupName, groupAvatar } = req.body;
    const userId = req.user._id;

    if (type === "private") {
      if (!members || members.length !== 1) {
        return res.status(400).json({ message: "Private chat requires exactly one other member" });
      }

      const otherUserId = members[0];

      // Check if conversation already exists between these two users
      const existing = await Conversation.findOne({
        type: "private",
        members: { $all: [userId, otherUserId], $size: 2 },
      }).populate("members", "username avatar isOnline lastSeen");

      if (existing) {
        return res.json(existing);
      }

      const conversation = new Conversation({
        type: "private",
        members: [userId, otherUserId],
      });

      await conversation.save();
      await conversation.populate("members", "username avatar isOnline lastSeen");

      return res.status(201).json(conversation);
    }

    if (type === "group") {
      if (!members || members.length < 2) {
        return res.status(400).json({ message: "Group chat requires at least 2 other members" });
      }
      if (!groupName) {
        return res.status(400).json({ message: "Group name is required" });
      }

      const allMembers = [userId, ...members];

      const conversation = new Conversation({
        type: "group",
        members: allMembers,
        groupName,
        groupAvatar: groupAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(groupName)}`,
        createdBy: userId,
      });

      await conversation.save();
      await conversation.populate("members", "username avatar isOnline lastSeen");

      // Emit groupCreated to all members via socket
      const io = getIo();
      if (io) {
        conversation.members.forEach((member) => {
          io.to(member._id.toString()).emit("groupCreated", { conversation });
        });
      }

      return res.status(201).json(conversation);
    }

    return res.status(400).json({ message: "Invalid conversation type" });
  } catch (err) {
    console.error("Create conversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id,
    })
      .sort({ lastActivity: -1 })
      .populate("members", "username avatar isOnline lastSeen")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username avatar" },
      });

    res.json(conversations);
  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user._id;

    // Verify user is a member of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.members.includes(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    let messageData = {
      conversation: conversationId,
      sender: userId,
    };

    // Voice note (multipart upload)
    if (req.file) {
      messageData.type = "voiceNote";
      messageData.voiceNoteUrl = `uploads/${req.file.filename}`;
      messageData.voiceNoteDuration = parseFloat(req.body.duration) || 0;
    } else {
      // Text message
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }
      messageData.type = "text";
      messageData.content = content;
    }

    const message = new Message(messageData);
    await message.save();

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastActivity: new Date(),
    });

    // Populate sender for the response
    await message.populate("sender", "username avatar");

    res.status(201).json(message);

    // Broadcast via socket to all other members
    const io = getIo();
    if (io) {
      conversation.members.forEach((memberId) => {
        if (memberId.toString() !== userId.toString()) {
          io.to(memberId.toString()).emit("newMessage", {
            message,
            conversationId,
          });
        }
      });
    }
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const { limit = 50, before } = req.query;

    // Verify user is a member
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    let query = { conversation: conversationId };
    if (before) {
      const beforeMessage = await Message.findById(before);
      if (beforeMessage) {
        query.createdAt = { $lt: beforeMessage.createdAt };
      }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("sender", "username avatar");

    // Return in chronological order
    res.json(messages.reverse());
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const addMember = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const { userId: newMemberId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation.type !== "group") {
      return res.status(400).json({ message: "Can only add members to group chats" });
    }

    if (conversation.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only group admin can add members" });
    }

    if (conversation.members.includes(newMemberId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    const newMember = await User.findById(newMemberId).select("_id username avatar");
    if (!newMember) {
      return res.status(404).json({ message: "User not found" });
    }

    conversation.members.push(newMemberId);
    await conversation.save();

    // Emit memberAdded to all existing members
    const io = getIo();
    if (io) {
      conversation.members.forEach((memberId) => {
        io.to(memberId.toString()).emit("memberAdded", {
          conversationId,
          newMember,
        });
      });
    }

    await conversation.populate("members", "username avatar isOnline lastSeen");
    res.json(conversation);
  } catch (err) {
    console.error("Add member error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
  addMember,
  setIo,
};
