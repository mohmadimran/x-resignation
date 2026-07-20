const authService = require("../services/authService");
const generateToken = require("../services/tokenService");

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        const token = generateToken(user);
        
        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: user,
            token
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const user = await authService.login(req.body);
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: user,
            token,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
};