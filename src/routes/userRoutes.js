const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController.js");
const { protect } = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

// Private

userRouter.get("/profile", protect, getUserProfile);

userRouter.put(
  "/profile",
  protect,
  upload.single("profilePicture"),
  updateUserProfile,
);

module.exports = userRouter;
