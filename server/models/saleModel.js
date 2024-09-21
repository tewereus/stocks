// models/Sale.js
const mongoose = require("mongoose");

const saleSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
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
    status: { type: String, enum: ["available", "sold"], default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
