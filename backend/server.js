const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const plantRoutes = require("./routes/plants"); // no .js needed

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Plant routes
app.use("/api/plants", plantRoutes);

// Chat route
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  let reply = "Sorry, I don’t understand.";
  if (message.toLowerCase().includes("water")) {
    reply = "Most plants need watering 2–3 times a week.";
  } else if (message.toLowerCase().includes("sunlight")) {
    reply = "Keep your plant where it gets indirect sunlight.";
  }

  res.json({ reply });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Start server
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
