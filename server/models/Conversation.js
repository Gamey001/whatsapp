const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["private", "group"], required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groupName: { type: String, default: "" },
    groupAvatar: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    lastActivity: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

conversationSchema.index({ members: 1, lastActivity: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
