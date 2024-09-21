const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const companySchema = mongoose.Schema(
  {
    unique_id: String,
    companyName: {
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

    password: {
      type: String,
      // required: true,
      select: false,
    },
    role: {
      type: String,
      default: "company",
    },
    status: {
      // this is for the companys to make it inactive incase of an emergency
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    main_status: {
      // this is for the admin to make them active after verifying the company info
      type: String,
      require: true,
      enum: ["active", "inactive", "waiting", "unavailable"], // unavailable if the company is not working anymore(change/ fired/ retired)
      default: "inactive",
    },
    company_info: {
      type: String,
    },
    total_shares: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

companySchema.pre("save", function (next) {
  this.role = "company";
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
