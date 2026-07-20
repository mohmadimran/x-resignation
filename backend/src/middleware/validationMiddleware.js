const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    errors: result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    })),
  });
};

module.exports = validate;