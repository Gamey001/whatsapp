import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { SERVER_URL } from "../utils/api";
import api from "../utils/api";

export const useSocket = (token, userId) => {
  const socketRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]); // messages for the active conversation
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({}); // { conversationId: { userId, username } }
  const [unreadCounts, setUnreadCounts] = useState({}); // { conversationId: count }
  const activeConversationRef = useRef(null);

  // Fetch all conversations for the authenticated user
  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get("/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  }, []);

  // Connect socket when token is available
  useEffect(() => {
    if (!token || !userId) return;

    const socket = io(SERVER_URL, {
      query: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // --- Online status ---
    socket.on("userOnline", ({ userId: onlineId }) => {
      setOnlineUsers((prev) => new Set([...prev, onlineId]));
    });

    socket.on("userOffline", ({ userId: offlineId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(offlineId);
        return next;
      });
    });

    // --- New message ---
    socket.on("newMessage", ({ message, conversationId }) => {
      // If this conversation is currently open, append to messages
      if (activeConversationRef.current === conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      // Update the conversation's lastMessage in the sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, lastMessage: message, lastActivity: new Date() } : c
        )
      );

      // Increment unread if it's not the active conversation
      if (activeConversationRef.current !== conversationId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || 0) + 1,
        }));
      }
    });

    // --- Typing ---
    socket.on("userTyping", ({ conversationId, userId: typerId, username }) => {
      setTypingUsers((prev) => ({ ...prev, [conversationId]: { userId: typerId, username } }));
    });

    socket.on("userStopTyping", ({ conversationId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
    });

    // --- Read receipts ---
    socket.on("messagesRead", ({ conversationId }) => {
      // Mark all messages in this conversation as read locally
      setMessages((prev) =>
        prev.map((m) => (m.conversation === conversationId ? { ...m, read: true } : m))
      );
    });

    // --- Group events ---
    socket.on("groupCreated", ({ conversation }) => {
      setConversations((prev) => [conversation, ...prev]);
    });

    socket.on("memberAdded", ({ conversationId, newMember }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? { ...c, members: [...c.members, newMember] }
            : c
        )
      );
    });

    // Fetch conversations on connect
    fetchConversations();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, userId, fetchConversations]);

  // --- Actions ---
  const selectConversation = async (conversationId) => {
    activeConversationRef.current = conversationId;
    // Clear unread for this conversation
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });

    // Fetch messages
    try {
      const res = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setMessages([]);
    }

    // Tell the server we've read them
    if (socketRef.current) {
      socketRef.current.emit("markRead", { conversationId });
    }
  };

  const sendMessage = async (conversationId, content) => {
    try {
      const res = await api.post(`/conversations/${conversationId}/messages`, {
        content,
        type: "text",
      });
      // Append our own message optimistically from the REST response
      setMessages((prev) => [...prev, res.data]);

      // Update sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, lastMessage: res.data, lastActivity: new Date() } : c
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const sendVoiceNote = async (conversationId, blob, duration) => {
    try {
      const formData = new FormData();
      formData.append("voiceNote", blob, "voiceNote.webm");
      formData.append("type", "voiceNote");
      formData.append("duration", duration);

      const res = await api.post(`/conversations/${conversationId}/messages`, formData);
      setMessages((prev) => [...prev, res.data]);

      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, lastMessage: res.data, lastActivity: new Date() } : c
        )
      );
    } catch (err) {
      console.error("Failed to send voice note:", err);
    }
  };

  const startTyping = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { conversationId });
    }
  };

  const stopTyping = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit("stopTyping", { conversationId });
    }
  };

  const createConversation = async (type, members, groupName) => {
    try {
      const body = { type, members };
      if (type === "group" && groupName) body.groupName = groupName;
      const res = await api.post("/conversations", body);
      // Add to local list if not already there
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === res.data._id);
        return exists ? prev : [res.data, ...prev];
      });
      return res.data;
    } catch (err) {
      console.error("Failed to create conversation:", err);
      throw err;
    }
  };

  const addMemberToGroup = async (conversationId, userId) => {
    try {
      const res = await api.put(`/conversations/${conversationId}/members`, { userId });
      // Update local conversation
      setConversations((prev) =>
        prev.map((c) => (c._id === conversationId ? res.data : c))
      );
    } catch (err) {
      console.error("Failed to add member:", err);
      throw err;
    }
  };

  return {
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
    fetchConversations,
  };
};
