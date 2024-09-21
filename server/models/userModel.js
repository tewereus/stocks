const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username already exists"],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [12, "Username cannot exceed 12 characters"],
    },
    fullname: {
      type: String,
      required: [true, "full name is required"],
      set: (v) => v.trim().replace(/\s+/g, " "),
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already registered"],
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v); // Validate that the email follows a specific format
        },
        message: (props) => `please input a valid email address`,
      },
    },
    mobile: {
      type: String,
      required: [true, "mobile is required"],
      unique: [true, "mobile number already registered"],
      validate: {
        validator: function (v) {
          return /^\d{9}$/.test(v); // Validate that mobile contains exactly 9 digits
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (v) {
          // Check if the password contains at least one uppercase letter, one lowercase letter, one number, and one special character
          const hasUpper = /[A-Z]/.test(v);
          const hasLower = /[a-z]/.test(v);
          const hasNumber = /\d/.test(v);
          const hasSpecial = /[!@#$%^&*]/.test(v);
          return hasUpper && hasLower && hasNumber && hasSpecial;
        },
        message: (props) =>
          `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character`,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    preference: {
      mode: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      language: {
        type: String,
        enum: ["en", "am"],
        default: "en",
      },
    },
    shares: [
      {
        company_name: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
        quantity: { type: Number, default: 0 },
      },
    ],
    address: {
      type: String,
      set: (v) => v.trim().replace(/\s+/g, " "), // Trim and normalize address
    },
    lastLoginIp: String, // Store the last login IP address
    lastLoginAt: Date, // Store the last login timestamp
    loginAttempts: {
      type: Number,
      default: 0,
      select: false, // Hide this field by default
    },
    lockUntil: Date, // Store the lock expiration date
    refreshToken: { type: String },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
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

userSchema.pre("save", function (next) {
  this.role = "user";
  next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createResetPasswordToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = new Date();
  this.passwordResetExpires.setMinutes(
    this.passwordResetExpires.getMinutes() + 10
  );
  return resettoken;
};

module.exports = mongoose.model("User", userSchema);
