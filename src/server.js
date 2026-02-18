require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const connectedDB = require("./config/dbConnect.js");
const userRouter = require("./routes/userRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/users", userRouter);

app.use((req, res, next) => {
  const error = new Error("Not Found - " + req.originalUrl);
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || "Internal Server Error",
    status: "error",
  });
});

const startServer = async () => {
  await connectedDB();
  app.listen(PORT, () => {
    try {
      console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
      console.error(error);
    }
  });
};

startServer();
