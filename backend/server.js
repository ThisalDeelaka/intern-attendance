const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const internRoutes = require("./routes/internRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); 

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting setup
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later",
});

// Apply rate limiting globally
app.use(apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interns", internRoutes);
app.use("/api/upload", uploadRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
