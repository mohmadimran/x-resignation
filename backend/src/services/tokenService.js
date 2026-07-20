const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Handle both mongoose document and plain object
    const userId = user.id || user._id;
    
    if (!userId) {
        throw new Error("User ID is required to generate token");
    }

    return jwt.sign(
        {
            id: userId.toString(),
            role: user.role || "employee",
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

module.exports = generateToken;