const User = require("../models/User");

const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      username: { $regex: query, $options: "i" },
    })
      .select("_id username avatar")
      .limit(20);

    res.json(users);
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updates = {};

    if (username !== undefined) {
      const existing = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updates.username = username;
    }

    if (bio !== undefined) {
      updates.bio = bio;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      select: "-password",
    });

    // Update avatar if username changed
    if (updates.username) {
      user.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}`;
      await user.save();
    }

    res.json({
      _id: user._id,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { searchUsers, updateProfile, getUserById };
