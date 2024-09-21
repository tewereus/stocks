// models/Share.js
const mongoose = require("mongoose");

const shareSchema = mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    availableShares: {
      type: Number,
      required: true,
      min: [1, "Total shares must be at least 1"],
    },
    pricePerShare: {
      type: Number,
      required: true,
      min: [0, "Price per share must be a positive number"],
    },
    minSharesToBuy: {
      type: Number,
      required: true,
      min: [1, "Minimum shares to buy must be at least 1"],
    },
    status: {
      type: String,
      enum: ["available", "sold", "inactive"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Share", shareSchema);
