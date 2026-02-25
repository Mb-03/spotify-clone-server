const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Artist = require("../models/Artist.js");
const uploadToCloudinary = require("../utils/cloudinaryUpload.js");

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

module.exports = { createArtist, getArtists };
