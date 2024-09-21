const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const companySchema = mongoose.Schema(
  {
    unique_id: String,
    fullname: {
      type: String,
      // required: [true, "full name is required"],
      set: (v) => v.trim().replace(/\s+/g, " "),
    },
    email: {
      type: String,
      required: true,
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
    password: {
      type: String,
      // required: true,
      select: false,
    },
    role: {
      type: String,
      default: "manager",
    },
    status: {
      // this is for the managers to make it inactive incase of an emergency
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    main_status: {
      // this is for the admin to make them active after verifying the manager info
      type: String,
      require: true,
      enum: ["active", "inactive", "waiting", "unavailable"], // unavailable if the manager is not working anymore(change/ fired/ retired)
      default: "inactive",
    },
    printers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Printer",
      },
    ],
    payment: [
      {
        bankName: String,
        bankAccount: String, //hash this if needed
      },
    ],
    profile: {
      type: String,
      default: "",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    // may be remove this
    shopInfo: {
      type: Object,
      default: {},
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

companySchema.pre("save", function (next) {
  this.role = "manager";
  next();
});

companySchema.pre("save", async function (next) {
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

companySchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

companySchema.methods.createCompanyToken = async function () {
  const token = crypto.randomBytes(3).toString("hex");
  this.unique_id = token;

  console.log("token: ", token);
  return token;
};

module.exports = mongoose.model("Company", companySchema);
