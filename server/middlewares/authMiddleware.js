const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Company = require("../models/companyModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          req.user = user;
          next();
        } else {
          throw new Error("User not found with the provided token");
        }
      } else {
        throw new Error("No token provided in the authorization header");
      }
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  } else {
    throw new Error("Authorization header with Bearer token is required");
  }
});

const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(
          token,
          "056d5e46c64d02bca6313aed117e88d4617a2cf3f9174f1406bb42058266a417"
        );
        const user = await Admin.findById(decoded.id).select("-password");
        if (user) {
          req.admin = user;
          next();
        } else {
          throw new Error("User not found with the provided token");
        }
      } else {
        throw new Error("No token provided in the authorization header");
      }
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  } else {
    throw new Error("Authorization header with Bearer token is required");
  }
});

const companyAuthMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Company.findById(decoded.id).select("-password");
        if (user) {
          req.company = user;
          next();
        } else {
          throw new Error("User not found with the provided token");
        }
      } else {
        throw new Error("No token provided in the authorization header");
      }
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  } else {
    throw new Error("Authorization header with Bearer token is required");
  }
});

module.exports = {
  authMiddleware,
  adminAuthMiddleware,
  companyAuthMiddleware,
};
