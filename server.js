// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Auth service running on port ${PORT}`);
});
