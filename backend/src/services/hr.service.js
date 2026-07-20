const ExitProcess = require("../models/ExitProcess");

const getAllExitRequests = async () => {
  return await ExitProcess.find()
    .populate("reviewedBy", "username")
    .sort({ createdAt: -1 });
};

const getExitRequest = async (id) => {
  return await ExitProcess.findById(id)
    .populate("reviewedBy", "username");
};

const approveRequest = async (id, hrId) => {

  const request = await ExitProcess.findById(id);

  if (!request) {
    const error = new Error("Exit request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "pending") {
    const error = new Error("This request has already been processed.");
    error.statusCode = 409;
    throw error;
  }

  request.status = "approved";

  request.remarks = "";

  request.reviewedBy = hrId;

  request.reviewedAt = new Date();

  await request.save();

  return request;
};


const rejectRequest = async (id, hrId, remarks) => {

  const request = await ExitProcess.findById(id);

  if (!request) {
    const error = new Error("Exit request not found.");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "pending") {
    const error = new Error("This request has already been processed.");
    error.statusCode = 409;
    throw error;
  }

  request.status = "rejected";

  request.remarks = remarks.trim();

  request.reviewedBy = hrId;

  request.reviewedAt = new Date();

  await request.save();

  return request;
};


module.exports = {
  getAllExitRequests,
  getExitRequest,
  approveRequest,
  rejectRequest,
};