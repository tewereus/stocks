const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const Company = require("../models/companyModel");
const Share = require("../models/shareModel");

const register = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      const user = await User.create(req.body);
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
    const user = await User.findOne({ email });
    if (user && user.isPasswordMatched(password)) {
      const refreshToken = await generateRefreshToken(user?._id);
      const updateUser = await User.findByIdAndUpdate(
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
  const user = await User.findOne({ refreshToken });
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
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findByIdAndDelete(id);
    res.json({
      message: "Account deleted successfully",
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const buyShare = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { shareId, numberOfShares } = req.body;
  try {
    const share = await Share.findById(shareId);

    // Check if share exists and is available
    if (!share || share.status !== "available") {
      return res
        .status(404)
        .json({ message: "Share not found or not available" });
    }

    // Check if the number of shares is valid
    if (numberOfShares < share.minSharesToBuy) {
      return res
        .status(400)
        .json({
          message: `You must buy at least ${share.minSharesToBuy} shares`,
        });
    }

    if (numberOfShares > share.availableShares) {
      return res.status(400).json({ message: "Not enough shares available" });
    }

    share.availableShares -= numberOfShares;
    await share.save();
    const totalValue = numberOfShares * share.pricePerShare;
    let user = await User.findById(userId);

    const existingShareIndex = user.shares.findIndex(
      (s) => s.company_name.toString() === share.company.toString()
    );

    if (existingShareIndex >= 0) {
      // Update existing entry
      user.shares[existingShareIndex].quantity += numberOfShares;
      user.shares[existingShareIndex].value += totalValue;
    } else {
      // Create new entry for this company
      user.shares.push({
        company_name: share.company,
        quantity: numberOfShares,
        value: totalValue,
      });
    }

    // Save updated user information
    await user.save();

    return res
      .status(200)
      .json({
        message: "Purchase successful",
        remainingShares: share.availableShares,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

const getBoughtShares = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  register,
  login,
  logout,
  viewProfile,
  deleteAccount,
  buyShare,
};
