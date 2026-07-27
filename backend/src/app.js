const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Skill Exchange Backend API is Running",
  });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});


/* ===========================
   404 Handler
=========================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ===========================
   Global Error Handler
=========================== */
app.use(errorHandler);

module.exports = app;