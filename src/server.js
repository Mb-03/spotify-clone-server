require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./config/swagger.js");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectedDB = require("./config/dbConnect.js");
const userRouter = require("./routes/userRoutes.js");
const artistRouter = require("./routes/artistRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10kb" }));

app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Spotify API docs",
  }),
);

app.use("/api/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application-json")
})

app.use("/api/users", userRouter);
app.use("/api/artists", artistRouter);

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
