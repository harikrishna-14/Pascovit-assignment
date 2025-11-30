const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ⭐ FIXED CORS CONFIG (WORKS FOR COOKIES + RENDER + VERCEL)
const allowedOrigins = [
  "http://localhost:3000",
  "https://pascovit-assignment.vercel.app",
  "https://pascovit-assignment.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow all server-to-server or tools
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // reject silently (do NOT crash)
      return callback(null, false);
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    exposedHeaders: "Set-Cookie"
  })
);

// ⭐ Required for preflight success
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
