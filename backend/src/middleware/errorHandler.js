const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle specific error types
    if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = {};
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });
        return res.status(statusCode).json({
            success: false,
            message: "Validation Error",
            errors: errors,
        });
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field} already exists.`;
    }

    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please login again.";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired. Please login again.";
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorHandler;