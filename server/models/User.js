const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: "",
      // Set dynamically after creation if blank
    },
    bio: { type: String, default: "Hey there! I am using WhatsApp." },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Generate a dicebear avatar URL based on username before saving
userSchema.pre("save", function (next) {
  if (!this.avatar && this.username) {
    this.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.username)}`;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
