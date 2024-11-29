const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;

const connectDB = require("./config/db");
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// check Backend
app.get("/", async (req, res) => {
  try {
    res.status(200).send("Backend is LIVE...");
  } catch (error) {
    res.status(500).json({ message: "Action Failed" });
  }
});

const routes = require("./routes/api");
app.use(routes);

app.listen(port, () => {
  console.log(`BACKEND listening on port ${port}`);
});
