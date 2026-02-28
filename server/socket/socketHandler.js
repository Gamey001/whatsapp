const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Map: userId (string) -> Set of socket instances
const connectedUsers = new Map();

const setupSocket = (io) => {
  io.on("connection", async (socket) => {
    const token = socket.handshake.query.token;

    // Verify JWT
    let user;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id).select("-password");
      if (!user) {
        socket.disconnect();
        return;
      }
    } catch (err) {
      socket.disconnect();
      return;
    }

    const userId = user._id.toString();

    // Add socket to connected map
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket);

    // Join a room named after the user ID for targeted emissions
    socket.join(userId);

    // Mark user as online
    await User.findByIdAndUpdate(userId, { isOnline: true });

    // Notify all other connected users
    io.emit("userOnline", { userId });

    console.log(`User ${user.username} connected (socket: ${socket.id})`);

    // --- MESSAGING ---
    socket.on("sendMessage", async ({ conversationId, content, type }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.members.includes(user._id)) return;

        const message = new Message({
          conversation: conversationId,
          sender: user._id,
          type: type || "text",
          content: content || "",
        });
        await message.save();

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          lastActivity: new Date(),
        });

        await message.populate("sender", "username avatar");

        // Broadcast to all other members
        conversation.members.forEach((memberId) => {
          if (memberId.toString() !== userId) {
            io.to(memberId.toString()).emit("newMessage", {
              message,
              conversationId,
            });
          }
        });
      } catch (err) {
        console.error("sendMessage error:", err);
      }
    });

    // --- TYPING INDICATORS ---
    socket.on("typing", ({ conversationId }) => {
      try {
        Conversation.findById(conversationId).then((conversation) => {
          if (!conversation) return;
          conversation.members.forEach((memberId) => {
            if (memberId.toString() !== userId) {
              io.to(memberId.toString()).emit("userTyping", {
                conversationId,
                userId,
                username: user.username,
              });
            }
          });
        });
      } catch (err) {
        console.error("typing error:", err);
      }
    });

    socket.on("stopTyping", ({ conversationId }) => {
      try {
        Conversation.findById(conversationId).then((conversation) => {
          if (!conversation) return;
          conversation.members.forEach((memberId) => {
            if (memberId.toString() !== userId) {
              io.to(memberId.toString()).emit("userStopTyping", {
                conversationId,
                userId,
              });
            }
          });
        });
      } catch (err) {
        console.error("stopTyping error:", err);
      }
    });

    // --- READ RECEIPTS ---
    socket.on("markRead", async ({ conversationId }) => {
      try {
        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: user._id },
            read: false,
          },
          { read: true }
        );

        // Notify other members
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.members.forEach((memberId) => {
            if (memberId.toString() !== userId) {
              io.to(memberId.toString()).emit("messagesRead", {
                conversationId,
                readBy: userId,
              });
            }
          });
        }
      } catch (err) {
        console.error("markRead error:", err);
      }
    });

    // --- DISCONNECT ---
    socket.on("disconnect", async () => {
      console.log(`User ${user.username} disconnected (socket: ${socket.id})`);

      // Remove socket from connected map
      const sockets = connectedUsers.get(userId);
      if (sockets) {
        sockets.delete(socket);
        if (sockets.size === 0) {
          connectedUsers.delete(userId);
          // No more active connections — mark offline
          const now = new Date();
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: now,
          });
          io.emit("userOffline", { userId, lastSeen: now });
        }
      }
    });
  });
};

module.exports = { setupSocket };
