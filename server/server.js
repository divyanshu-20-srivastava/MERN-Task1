const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

// Connect to MongoDB
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Ensure that an initial document exists in the Analytics collection
    return Analytics.findOneAndUpdate({}, {}, { upsert: true, new: true });
  })
  .then(() => {
    console.log("Initialized Analytics document");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Create Schema
const analyticsSchema = new mongoose.Schema({
  addCount: {
    type: Number,
    default: 0,
  },
  clearCount: {
    type: Number,
    default: 0,
  },
});

// Create Model
const Analytics = mongoose.model("Analytics", analyticsSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// POST request to increment add count
app.post("/analytics/add", async (req, res) => {
  try {
    const analytics = await Analytics.findOneAndUpdate({}, { $inc: { addCount: 1 } }, { new: true });
    res.json({ addCount: analytics.addCount });
  } catch (error) {
    console.error("Error incrementing add count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST request to increment clear count
app.post("/analytics/clear", async (req, res) => {
  try {
    const analytics = await Analytics.findOneAndUpdate({}, { $inc: { clearCount: 1 } }, { new: true });
    res.json({ clearCount: analytics.clearCount });
  } catch (error) {
    console.error("Error incrementing clear count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET request to get total add count and clear count
app.get("/analytics", async (req, res) => {
  try {
    const analytics = await Analytics.findOne({});
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
