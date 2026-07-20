const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [50, "Username cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, // This creates the index
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        role: {
            type: String,
            enum: ["employee", "HR", "admin"],
            default: "employee",
        },
        department: {
            type: String,
            required: function () {
                return this.role === "employee";
            },
            trim: true,
        },
        designation: {
            type: String,
            required: function () {
                return this.role === "employee";
            },
            trim: true,
        },
        employeeId: {
            type: String,
            unique: true, // This creates the index
            sparse: true, // Allows null/undefined values while maintaining uniqueness
            trim: true,
            required: function () {
                return this.role === "employee";
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);


userSchema.index({ role: 1 });
// For compound queries like finding employees by role and department:
userSchema.index({ role: 1, department: 1 });

// Remove password when converting to JSON
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    },
});

module.exports = mongoose.model("User", userSchema);