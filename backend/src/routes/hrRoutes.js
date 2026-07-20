const express = require("express");
const router = express.Router();
const hrController = require("../controllers/hrController");
const verifyToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorize");


// All Exit Requests

router.get(
  "/exit-requests",
  verifyToken,
  authorizeRole("HR"),
  hrController.getAllExitRequests
);


// Single Exit Request

router.get(
  "/exit-request/:id",
  verifyToken,
  authorizeRole("HR"),
  hrController.getExitRequest
);

// Approve Exit Request

router.put(
  "/exit-request/:id/approve",
  verifyToken,
  authorizeRole("HR"),
  hrController.approveRequest
);

// Reject Exit Request

router.put(
  "/exit-request/:id/reject",
  verifyToken,
  authorizeRole("HR"),
  hrController.rejectRequest
);

module.exports = router;