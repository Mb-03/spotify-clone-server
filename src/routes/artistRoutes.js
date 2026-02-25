const express = require("express");
const { protect, isAdmin } = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");
const createArtist = require("../controllers/artistController.js");

const artistRouter = express.Router();

artistRouter.post(
  "/",
  protect,
  isAdmin,
  upload.single("artistImage"),
  createArtist,
);

module.exports = artistRouter;
