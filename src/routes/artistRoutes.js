const express = require("express");
const { protect, isAdmin } = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js");
const {
  createArtist,
  getArtists,
  getTopArtists,
  getArtistTopSongs,
  getArtistById,
  updateArtist,
  deleteArtist,
} = require("../controllers/artistController.js");

const artistRouter = express.Router();

artistRouter.get("/", getArtists);
artistRouter.get("/top", getTopArtists);
artistRouter.get("/:id", getArtistById);
artistRouter.get("/:id/top", getArtistTopSongs);

artistRouter.put(
  "/:id",
  protect,
  isAdmin,
  upload.single("image"),
  updateArtist,
);
artistRouter.delete("/:id", protect, isAdmin, deleteArtist);

artistRouter.post(
  "/",
  protect,
  isAdmin,
  upload.single("artistImage"),
  createArtist,
);

module.exports = artistRouter;
