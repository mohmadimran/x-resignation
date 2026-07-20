const express = require("express");

const router = express.Router();

const { register, login } = require("../controllers/authController");

const validate = require("../middleware/validationMiddleware");

const {
  registerValidation,
  loginValidation,
} = require("../validations/authValidation");

router.post(
  "/register",
  registerValidation,
  validate,
  register
);

router.post(
  "/login",
  loginValidation,
  validate,
  login
);

module.exports = router;