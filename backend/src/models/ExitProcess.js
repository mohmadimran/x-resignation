const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const exitProcessSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    employeeName: {
      type: String,
      required: true,
    },

    employeeEmail: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      default: "",
    },

    lwd: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    responses: [responseSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExitProcess", exitProcessSchema);