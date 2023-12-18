const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors middleware
const mainRouter = require("./routes/user.js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("", mainRouter);

const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
