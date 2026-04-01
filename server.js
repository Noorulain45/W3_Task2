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
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "http://localhost:3000",
  // Add your Vercel deployment URLs below:
  /^https:\/\/.*\.vercel\.app$/,  // allows all *.vercel.app subdomains
];

app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser requests (Postman, server-to-server)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    if (!allowed) {
      return callback(new Error("CORS policy does not allow access from this origin."), false);
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

// Only start the server when running locally (not on Vercel)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;