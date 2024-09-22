const Company = require("../models/companyModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const Share = require("../models/shareModel");

// const register = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   try {
//     const userExists = await Company.findOne({ email });
//     if (!userExists) {
//       const user = await Company.create(req.body);
//       res.json(user);
//     } else {
//       res.status(401).json({ message: "user already exists" });
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await Company.findOne({ email });
//     if (user && user.isPasswordMatched(password)) {
//       const refreshToken = await generateRefreshToken(user?._id);
//       const updateCompany = await Company.findByIdAndUpdate(
//         user.id,
//         { refreshToken: refreshToken },
//         { new: true }
//       );
//       res.cookie("refreshToken", refreshToken, {
//         httpOnly: true,
//         sameSite: "strict",
//         maxAge: 72 * 60 * 60 * 1000,
//       });
//       res.json({
//         message: "logged in successfully",
//         _id: user?._id,
//         name: user?.fullname,
//         username: user?.username,
//         email: user?.email,
//         mobile: user?.mobile,
//         profile: user?.profile,
//         token: generateToken(user?._id),
//       });
//     } else {
//       throw new Error("invalid credentials");
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

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
    // Find the company by ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if a share entry already exists for this company
    let existingShare = await Share.findOne({ company: companyId });

    if (existingShare) {
      // Update existing share entry
      existingShare.availableShares += Number(availableShares);
      // Optionally update price per share and minimum shares to buy if provided
      existingShare.pricePerShare =
        pricePerShare || existingShare.pricePerShare;
      existingShare.minSharesToBuy =
        minSharesToBuy || existingShare.minSharesToBuy;

      await existingShare.save();

      // Update total shares in the company model
      company.total_shares += Number(availableShares);
      await company.save();

      return res.status(200).json(existingShare); // Return updated share information
    } else {
      // Create a new share entry if none exists
      const newShare = new Share({
        company: companyId,
        availableShares,
        pricePerShare,
        minSharesToBuy,
      });

      await newShare.save();

      // Update total shares in the company model
      company.total_shares += Number(availableShares);
      await company.save();

      return res.status(201).json(newShare); // Return newly created share information
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const deleteShares = asyncHandler(async (req, res) => {
  const { shareId } = req.params; // Get shareId from request parameters

  try {
    // Find the share entry by ID
    const shareEntry = await Share.findById(shareId);
    if (!shareEntry) {
      return res.status(404).json({ message: "Share entry not found" });
    }

    // Find the company associated with this share
    const company = await Company.findById(shareEntry.company);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update company's total shares by adding back the available shares
    company.total_shares += shareEntry.availableShares;

    await company.save(); // Save updated company information

    // Delete the share entry
    await Share.findByIdAndDelete(shareId);

    res.status(200).json({
      message:
        "Share deleted successfully, remaining shares returned to company",
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(400).json({ message: error.message });
  }
});

module.exports = {
  // register,
  // login,
  logout,
  viewProfile,
  deleteAccount,
  addShares,
  deleteShares,
};
