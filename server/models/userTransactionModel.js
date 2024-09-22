const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var userTransactionSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shares: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("UserTransaction", userTransactionSchema);
