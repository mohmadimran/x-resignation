const { body } = require("express-validator");

const registerValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage("Password must contain at least one letter and one number"),

    body("role")
        .optional()
        .isIn(["employee", "HR", "admin"])
        .withMessage("Role must be either employee, HR, or admin")
        .default("employee"),

    body("department")
        .if(body("role").equals("employee"))
        .notEmpty()
        .withMessage("Department is required for employees")
        .trim(),

    body("designation")
        .if(body("role").equals("employee"))
        .notEmpty()
        .withMessage("Designation is required for employees")
        .trim(),

    body("employeeId")
        .if(body("role").equals("employee"))
        .notEmpty()
        .withMessage("Employee ID is required for employees")
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("Employee ID must be between 3 and 20 characters"),
];

const loginValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

module.exports = {
    registerValidation,
    loginValidation,
};