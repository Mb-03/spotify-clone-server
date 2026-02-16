require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const connectedDB = require("./config/dbConnect.js");
const userRouter = require("./routes/userRoutes.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hello");
});

app.use("/api/users", userRouter);

const startServer = async () => {
  await connectedDB();
  app.listen(PORT, () => {
    try {
      console.log(`Server is running on http://127.0.0.1:${PORT}`);
    } catch (error) {
      console.error(error);
    }
  });
};

startServer();
