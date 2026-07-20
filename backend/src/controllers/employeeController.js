const employeeService = require("../services/employee.service");

const submitExitProcess = async (req, res, next) => {
  try {
    const employeeId = req.user.id;

    const { lwd, responses } = req.body;

    if (!lwd) {
      return res.status(400).json({
        success: false,
        message: "Last Working Day is required.",
      });
    }

    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please answer all exit questions.",
      });
    }

    for (const item of responses) {
      if (!item.questionText || !item.response) {
        return res.status(400).json({
          success: false,
          message: "Invalid exit response.",
        });
      }
    }

    const exitProcess = await employeeService.submitExitProcess(
      employeeId,
      {
        lwd,
        responses,
      }
    );

    return res.status(201).json({
      success: true,
      message: "Exit request submitted successfully.",
      data: exitProcess,
    });

  } catch (error) {
    next(error);
  }
};

const getMyExitProcess = async (req, res, next) => {
  try {

    const employeeId = req.user.id;

    const exitProcess =
      await employeeService.getMyExitProcess(employeeId);

    if (!exitProcess) {
      return res.status(404).json({
        success: false,
        message: "No exit request found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: exitProcess,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitExitProcess,
  getMyExitProcess,
};