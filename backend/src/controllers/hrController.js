const hrService = require("../services/hr.service");

// Get All Exit Requests

const getAllExitRequests = async (req, res, next) => {
  try {
    const requests = await hrService.getAllExitRequests();

    return res.status(200).json({
      success: true,
      data: requests

    })
  }
  catch (error) {
    next(error);
  }
};

// Get Single Exit Request

const getExitRequest = async (req, res, next) => {
  try {
    const request = await hrService.getExitRequest(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Exit request not found.",
      });
    }

    return res.status(200).json({

      success: true,
      data: request

    });
  }
  catch (error) {
    next(error);
  }
};


// Approve Request

const approveRequest = async (req, res, next) => {
  try {
    const request = await hrService.approveRequest(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      message: "Exit request approved successfully.",
      data: request,
    });
  }
  catch (error) {
    next(error);
  }
};

// Reject Request

const rejectRequest = async (req, res, next) => {
  try {

    const { remarks } = req.body;

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        success: false,
        message: "Remarks are required.",
      });
    }

    const request = await hrService.rejectRequest(
      req.params.id,
      req.user.id,
      remarks
    );

    return res.status(200).json({
      success: true,
      message: "Exit request rejected successfully.",
      data: request,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExitRequests,
  getExitRequest,
  approveRequest,
  rejectRequest,
};