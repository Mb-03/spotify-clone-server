const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User.js");
const generateToken = require("../utils/generateToken.js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Invalid User Data");
  }

  res.status(StatusCodes.CREATED).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    profilePicture: user.profilePicture,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(StatusCodes.OK).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Invalid email or password");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("likedSongs", "title artist duration")
    .populate("likedAlbums", "title artist coverImage")
    .populate("followedArtists", "name image")
    .populate("followedPlaylists", "name creator coverImage");

  if (user) {
    res.status(StatusCodes.OK).json(user);
  } else {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User not Found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
