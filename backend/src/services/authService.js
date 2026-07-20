const bcrypt = require("bcryptjs");
const User = require("../models/User");

const register = async (userData) => {
    const {
        username,
        email,
        password,
        role = "employee",
        department,
        designation,
        employeeId,
    } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [
            { email },
            ...(employeeId ? [{ employeeId }] : []) // Only check employeeId if provided
        ]
    });

    if (existingUser) {
        if (existingUser.email === email) {
            const error = new Error("Email already exists.");
            error.statusCode = 409;
            throw error;
        }
        if (employeeId && existingUser.employeeId === employeeId) {
            const error = new Error("Employee ID already exists.");
            error.statusCode = 409;
            throw error;
        }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        department: role === "employee" ? department : undefined,
        designation: role === "employee" ? designation : undefined,
        employeeId: role === "employee" ? employeeId : undefined,
    });

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

const login = async ({ email, password }) => {
    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    // Check if user is active
    if (!user.isActive) {
        const error = new Error("Your account has been deactivated. Please contact HR.");
        error.statusCode = 403;
        throw error;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

module.exports = {
    register,
    login,
};