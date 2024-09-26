const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const Company = require("../models/companyModel");
const Share = require("../models/shareModel");
const Sale = require("../models/saleModel");
const UserTransaction = require("../models/userTransactionModel");
const CompanyTransaction = require("../models/companyTransactionModel");

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

const buyCompanyShare = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { shareId, numberOfShares } = req.body;
  try {
    const share = await Share.findById(shareId);

    const sharesToBuy = Number(numberOfShares);

    if (!share || share.status !== "available") {
      return res
        .status(404)
        .json({ message: "Share not found or not available" });
    }
    if (sharesToBuy < share.minSharesToBuy) {
      return res.status(400).json({
        message: `You must buy at least ${share.minSharesToBuy} shares`,
      });
    }

    if (sharesToBuy > share.availableShares) {
      return res.status(400).json({ message: "Not enough shares available" });
    }

    const totalValue = sharesToBuy * share.pricePerShare;

    // Add payment integration here, if success continue
    const transaction = await CompanyTransaction.create({
      buyer: id,
      company: share.company,
      shares: sharesToBuy,
      price: totalValue,
    });

    share.availableShares -= sharesToBuy;
    await share.save();
    let user = await User.findById(id);

    const existingShareIndex = user.shares.findIndex(
      (s) => s.company_name.toString() === share.company.toString()
    );

    if (existingShareIndex >= 0) {
      // Update existing entry
      user.shares[existingShareIndex].quantity += sharesToBuy;
      user.shares[existingShareIndex].value += totalValue;
    } else {
      user.shares.push({
        company_name: share.company,
        quantity: sharesToBuy,
        value: totalValue,
      });
    }
    await user.save();

    return res.status(200).json({
      message: "Purchase successful",
      remainingShares: share.availableShares,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

const sellShare = asyncHandler(async (req, res) => {
  const { company, quantity, pricePerShare, minSharesToBuy } = req.body;
  const { id } = req.user; // Assuming userId is passed in the request parameters

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const companyDocument = await Company.findOne({
      companyName: company,
    }).select("_id");
    if (!companyDocument) {
      return res.status(404).json({ message: "Company not found" });
    }

    const companyId = companyDocument._id; // Extract the _id from the found company document

    // Find user's share for the specific company
    const userShare = user.shares.find((share) => {
      return share.company_name.toString() === companyId.toString(); // Ensure both are strings for comparison
    });

    console.log("usershare: ", userShare);
    console.log("quantity: ", quantity);

    if (!userShare || userShare.quantity < Number(quantity)) {
      return res
        .status(400)
        .json({ message: "You do not have enough shares to sell" });
    }

    let existingSale = await Sale.findOne({
      user: id, // Use user ID directly
      company_name: companyId,
      status: "available",
    });

    if (existingSale) {
      // Update existing sale entry
      existingSale.quantity += Number(quantity); // Increase quantity of shares for sale
      existingSale.pricePerShare = pricePerShare; // Update price per share if needed
      existingSale.minSharesToBuy = minSharesToBuy; // Update minimum shares to buy if needed

      await existingSale.save();
    } else {
      const newSale = new Sale({
        user: id,
        company_name: companyId,
        quantity,
        pricePerShare,
        minSharesToBuy,
      });

      await newSale.save(); // Save the new sale entry
    }

    userShare.quantity -= Number(quantity);

    // If all shares are sold for this company, remove it from user's shares
    if (userShare.quantity === 0) {
      user.shares = user.shares.filter(
        (share) => share.company_name.toString() !== companyId.toString()
      );
    }

    await user.save(); // Save updated user information

    res.status(201).json({
      message: "Shares listed for sale successfully",
      sale: existingSale || newSale,
    });
  } catch (error) {
    console.error("Error selling share:", error);
    res.status(400).json({ message: error.message });
  }
});

const buyUsersShare = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { quantity, saleId } = req.body;

  try {
    const saleEntry = await Sale.findById(saleId);
    if (!saleEntry) {
      return res.status(404).json({ message: "Sale entry not found" });
    }

    if (quantity < saleEntry.minSharesToBuy) {
      return res.status(400).json({
        message: `You must buy at least ${saleEntry.minSharesToBuy} shares`,
      });
    }

    if (saleEntry.quantity < quantity) {
      return res.status(400).json({ message: "Not enough shares available" });
    }

    const totalValue = quantity * Number(saleEntry.pricePerShare);

    const transaction = await UserTransaction.create({
      buyer: id,
      seller: saleEntry.user,
      company: saleEntry.company_name,
      shares: quantity,
      price: totalValue,
    });

    saleEntry.quantity -= Number(quantity);

    // If all shares are sold, mark the sale as sold
    if (saleEntry.quantity === 0) {
      saleEntry.status = "sold";
    }

    await saleEntry.save(); // Save updated sale entry

    // Update buyer's shares
    const buyer = await User.findById(id);
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    const existingBuyerShareIndex = buyer.shares.findIndex(
      (share) =>
        share.company_name.toString() === saleEntry.company_name.toString()
    );

    if (existingBuyerShareIndex >= 0) {
      // Update existing share quantity for the buyer
      buyer.shares[existingBuyerShareIndex].quantity += Number(quantity);
    } else {
      // Add new share entry for the buyer
      buyer.shares.push({
        company_name: saleEntry.company_name,
        quantity: Number(quantity),
      });
    }

    await buyer.save(); // Save updated buyer information

    res.status(200).json({
      message: "Purchase successful",
      remainingShares: saleEntry.quantity,
      buyerShares: buyer.shares,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(400).json({ message: error.message });
  }
});

const deleteShare = asyncHandler(async (req, res) => {
  const { saleId } = req.body;
  const { userId } = req.params;

  try {
    // Find the sale entry by ID
    const saleEntry = await Sale.findById(saleId);
    if (!saleEntry) {
      return res.status(404).json({ message: "Sale entry not found" });
    }

    // Ensure that the user trying to delete the sale is the owner
    if (saleEntry.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this sale" });
    }

    // Update user's shares
    const user = await User.findById(userId);
    const userShare = user.shares.find(
      (share) =>
        share.company_name.toString() === saleEntry.company_name.toString()
    );

    if (userShare) {
      // If user has shares for this company, add back the quantity from the sale
      userShare.quantity += saleEntry.quantity;
    } else {
      // If no existing share entry, create one for this company with the quantity from the sale
      user.shares.push({
        company_name: saleEntry.company_name,
        quantity: saleEntry.quantity,
      });
    }

    await user.save(); // Save updated user information

    // Delete the sale entry
    await Sale.findByIdAndDelete(saleId);

    res
      .status(200)
      .json({ message: "Sale deleted and shares returned successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getAllShares = asyncHandler(async (req, res) => {
  try {
    const shares = await Share.find().populate({
      path: "company",
      select: "companyName -_id",
    });
    console.log(shares);
    res.json(shares);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserShare = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .populate({
        path: "shares.company_name",
        select: "companyName total_shares",
      })
      .select("shares");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User shares retrieved successfully",
      shares: user.shares,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving shares" });
  }
});

const getAllUsersSales = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    const sales = await Sale.find({ user: userId });
    res
      .status(200)
      .json({ message: "All sales retrieved successfully", sales });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllSales = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const sales = await Sale.find({ user: { $ne: id } })
      .populate({
        path: "company_name",
        select: "companyName -_id",
      })
      .populate({
        path: "user",
        select: "fullname -_id",
      });

    res
      .status(200)
      .json({ message: "All sales retrieved successfully", sales });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving sales" });
  }
});

const getBoughtCompanyTransaction = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const transaction = await CompanyTransaction.find({ buyer: id }).populate({
      path: "company",
      select: "companyName -_id",
    });
    const totalTransactions = transaction.length;
    res.status(200).json({
      message: "Company transaction retrieved successfully",
      transaction,
      totalTransactions,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBoughtUsersTransaction = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log(id);
  try {
    const transaction = await UserTransaction.find({ buyer: id })
      .populate({ path: "seller", select: "fullname -_id" })
      .populate({ path: "company", select: "companyName -_id" });
    const totalTransactions = transaction.length;
    console.log(totalTransactions);
    res.status(200).json({
      message: "Company transaction retrieved successfully",
      transaction,
      totalTransactions,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSoldUsersTransaction = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log(id);
  try {
    const transaction = await UserTransaction.find({ seller: id })
      .populate({ path: "buyer", select: "fullname -_id" })
      .populate({ path: "company", select: "companyName -_id" });
    const totalTransactions = transaction.length;
    console.log(totalTransactions);
    res.status(200).json({
      message: "user sold transaction retrieved successfully",
      transaction,
      totalTransactions,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBoughtTransaction = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    //
    const transaction = await UserTransaction.find({ buyer: userId });
    console.log(transaction);
    res.json(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllSoldTransaction = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    //
    const transaction = await UserTransaction.find({ seller: userId });
    res.json(transaction);
  } catch (error) {
    throw new Error(error);
  }
});

// shares the user have in a company
const getCompaniesShare = asyncHandler(async (req, res) => {
  const { id } = req.user; // Assuming req.user contains the authenticated user's ID
  try {
    // Find the user by ID and populate shares with company details
    const user = await User.findById(id).populate({
      path: "shares.company_name", // Populate company_name field in shares
      select: "companyName", // Select only the companyName field
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const companies = user.shares.map(
      (share) => share.company_name.companyName
    );
    // const companyIds = user.shares.map((share) => share.company_name._id);

    // console.log("Company Names:", companyNames);
    // console.log("Company IDs:", companyIds);

    res.status(200).json({
      companies,
    });
  } catch (error) {
    console.error("Error retrieving companies' shares:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// const getCompaniesShare = asyncHandler(async (req, res) => {
//   const { id } = req.user; // Assuming req.user contains the authenticated user's ID
//   try {
//     // Find the user by ID and populate shares with company details
//     const user = await User.findById(id).populate({
//       path: "shares.company_name", // Populate company_name field in shares
//       select: "companyName", // Select only the companyName field
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Extract company names and IDs from shares
//     const companies = user.shares.map((share) => ({
//       id: share.company_name._id, // Get the company ID
//       companyName: share.company_name.companyName, // Get the company name
//     }));

//     res.status(200).json({
//       companies, // Return array of companies with IDs and names
//     });
//   } catch (error) {
//     console.error("Error retrieving companies' shares:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

module.exports = {
  register,
  login,
  logout,
  viewProfile,
  deleteAccount,
  buyCompanyShare,
  sellShare,
  buyUsersShare,
  deleteShare,
  getUserShare,
  getAllShares,
  getAllUsersSales,
  getAllSales,
  getBoughtCompanyTransaction,
  getBoughtUsersTransaction,
  getSoldUsersTransaction,
  getAllBoughtTransaction,
  getAllSoldTransaction,
  getCompaniesShare,
};
