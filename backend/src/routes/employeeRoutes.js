const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employeeController");
const authorizeRole = require("../middleware/authorize");
const verifyToken = require("../middleware/auth");

router.post(
  "/resign",
  verifyToken,
  authorizeRole("employee"),
  employeeController.submitExitProcess
);

router.get(
  "/response",
  verifyToken,
  authorizeRole("employee"),
  employeeController.getMyExitProcess
);

module.exports = router;