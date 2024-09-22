const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const adminSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    fullname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "administrator",
    },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", function (next) {
  this.role = "administrator";
  next();
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    next(err);
  }
  next();
});

adminSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
