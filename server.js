require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Swagger spec
const swaggerSpec = require("./docs/swagger");

const app = express();

// Allow multiple origins for frontend + Swagger UI
const allowedOrigins = [
  "http://localhost:5000",                   // Swagger testing
  "http://127.0.0.1:5000",                   // optional
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests (like Postman)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'CORS policy does not allow access from this origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());

// Connect to DB
connectDB();

// Serve Swagger JSON
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Serve Swagger UI HTML
app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "swagger.html"));
});

// API Routes
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Task Manager API",
    docs: "/api-docs",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});