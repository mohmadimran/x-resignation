const ExitProcess = require("../models/ExitProcess");
const User = require("../models/User");

const submitExitProcess = async (employeeId, data) => {

  const existingRequest = await ExitProcess.findOne({
    employeeId,
    status: "pending",
  });

  if (existingRequest) {
    const error = new Error(
      "You already have a pending resignation request."
    );

    error.statusCode = 409;

    throw error;
  }

  const employee = await User.findById(employeeId);

  if (!employee) {
    const error = new Error("Employee not found");

    error.statusCode = 404;

    throw error;
  }

  const exitProcess = await ExitProcess.create({
    employeeId,

    employeeName: employee.username,

    employeeEmail: employee.email,

    department: employee.department,

    designation: employee.designation,

    lwd: data.lwd,

    responses: data.responses,
  });

  return exitProcess;
};

const getMyExitProcess = async (employeeId) => {

  return await ExitProcess.findOne({
    employeeId,
  }).sort({
    createdAt: -1,
  });

};

module.exports = {
  submitExitProcess,
  getMyExitProcess,
};