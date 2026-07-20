require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/auth");
const employeeRoutes = require("./src/routes/employeeRoutes");
const hrRoutes = require("./src/routes/hrRoutes");

const apiLimiter = require("./src/middleware/rateLimit");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL
//   })
// );
app.use(cors())

app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/hr", hrRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
    });
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    process.on("SIGINT", async () => {
      console.log("Shutting down...");

      await mongoose.connection.close();

      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();