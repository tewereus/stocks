const Company = require("../models/companyModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const Share = require("../models/shareModel");

const register = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const userExists = await Company.findOne({ email });
    if (!userExists) {
      const user = await Company.create(req.body);
      res.json(user);
    } else {
      res.status(401).json({ message: "user already exists" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Company.findOne({ email });
    if (user && user.isPasswordMatched(password)) {
      const refreshToken = await generateRefreshToken(user?._id);
      const updateCompany = await Company.findByIdAndUpdate(
        user.id,
        { refreshToken: refreshToken },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        message: "logged in successfully",
        _id: user?._id,
        name: user?.fullname,
        username: user?.username,
        email: user?.email,
        mobile: user?.mobile,
        profile: user?.profile,
        token: generateToken(user?._id),
      });
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await Company.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  user.refreshToken = "";
  await user.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  // Remove the token from headers.authorization
  if (req.headers.authorization) {
    req.headers.authorization = ""; // Clear the Authorization header
  }
  res.sendStatus(204); // forbidden
});

const viewProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const user = await Company.findById(id).select("-password");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const user = await Company.findByIdAndDelete(id);
    res.json({
      message: "Account deleted successfully",
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const addShares = asyncHandler(async (req, res) => {
  const { companyId, availableShares, pricePerShare, minSharesToBuy } =
    req.body;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const sharesToAdd = Number(availableShares);
    // Create a new share entry
    const newShare = new Share({
      company: companyId,
      availableShares,
      pricePerShare,
      minSharesToBuy,
    });

    await newShare.save();

    company.total_shares += sharesToAdd;
    await company.save();

    res.status(201).json(newShare);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  register,
  login,
  logout,
  viewProfile,
  deleteAccount,
  addShares,
};
