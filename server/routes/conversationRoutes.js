const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
  addMember,
} = require("../controllers/conversationController");

router.post("/", authMiddleware, createConversation);
router.get("/", authMiddleware, getConversations);
router.post("/:id/messages", authMiddleware, upload.single("voiceNote"), sendMessage);
router.get("/:id/messages", authMiddleware, getMessages);
router.put("/:id/members", authMiddleware, addMember);

module.exports = router;
