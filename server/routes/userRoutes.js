const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { searchUsers, updateProfile, getUserById } = require("../controllers/userController");

router.get("/search", authMiddleware, searchUsers);
router.put("/profile", authMiddleware, updateProfile);
router.get("/:id", authMiddleware, getUserById);

module.exports = router;
