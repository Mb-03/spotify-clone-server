const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Artist = require("../models/Artist.js");
const uploadToCloudinary = require("../utils/cloudinaryUpload.js");
const Song = require("../models/Song.js");
const Album = require("../models/Album.js");

const createArtist = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Request body is required");
  }

  const { name, bio, genres } = req.body;

  if (!name || !bio || !genres) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Name, bio, and genres are required");
  }

  const existingArtist = await Artist.findOne({ name });

  if (existingArtist) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Artist with this name already exists");
  }

  let imgUrl = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "spotify/artists");
    imgUrl = result.secure_url;
  }

  const artist = await Artist.create({
    name,
    bio,
    genres,
    isVerified: true,
    image: imgUrl,
  });

  res.status(StatusCodes.CREATED).json(artist);
});

const getArtists = asyncHandler(async (req, res) => {
  const { genre, search, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (genre) filter.genres = { $in: [genre] };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      {
        bio: { $regex: search, $options: "i" },
      },
    ];
  }

  const count = await Artist.countDocuments(filter);

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const artists = await Artist.find(filter)
    .sort({ followers: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  res.status(StatusCodes.OK).json({
    artists,
    page: parseInt(page),
    pages: Math.ceil(count / parseInt(limit)),
    totalArtists: count,
  });
});

const getArtistById = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);
  if (artist) res.status(StatusCodes.OK).json(artist);
  res.status(StatusCodes.NOT_FOUND);
  throw new Error("Artist not found");
});

const updateArtist = asyncHandler(async (req, res) => {
  const { name, bio, genres, isVerified } = req.body;
  const artist = await Artist.findById(req.params.id);
  if (!artist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Artist not found");
  }

  artist.name = name || artist.name;
  artist.bio = bio || artist.bio;
  artist.genres = genres || artist.genres;
  artist.isVerified =
    isVerified !== undefined ? isVerified === "true" : artist.isVerified;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "spotify/artists");
    artist.image = result.secure_url;
  }

  const updatedArtist = await artist.save();
  res.status(StatusCodes.OK).json(updatedArtist);
});

const deleteArtist = asyncHandler(async (req, res) => {
  const artist = await Artist.findById(req.params.id);
  if (!artist) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Artist not found");
  }

  await Song.deleteMany({ artist: artist._id });
  await Album.deleteMany({ artist: artist._id });
  await artist.deleteOne();
  res.status(StatusCodes.OK).json({ message: "ARtist deleted", data: artist });
});

const getTopArtists = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  const artists = await Artist.find()
    .sort({ followers: -1 })
    .limit(parseInt(limit));
  res.status(StatusCodes.OK).json(artists);
});

const getArtistTopSongs = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  const songs = await Song.find({ artist: req.params.id })
    .sort({ plays: -1 })
    .limit(parseInt(limit))

    .populate("Album title");

  if (songs.length > 0) res.status(StatusCodes.OK).json(songs);

  res.status(StatusCodes.NOT_FOUND);
  throw new Error("Songs not found");
});

module.exports = {
  createArtist,
  getArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  getTopArtists,
  getArtistTopSongs,
};
