const Admin = require("../models/adminModel");
const Company = require("../models/companyModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const User = require("../models/userModel");
const Sale = require("../models/saleModel");
const UserTransaction = require("../models/userTransactionModel");
const CompanyTransaction = require("../models/companyTransactionModel");

const register = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const userExists = await Admin.findOne({ email });
    if (!userExists) {
      const user = await Admin.create(req.body);
      res.json(user);
    } else {
      res.status(401).json({ message: "admin already exists" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (user && user.isPasswordMatched(password)) {
      const refreshToken = await generateRefreshToken(user?._id);
      const updateAdmin = await Admin.findByIdAndUpdate(
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
  const user = await Admin.findOne({ refreshToken });
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
  const { id } = req.params;
  try {
    const user = await Admin.findById(id).select("-password");
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.json({
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "user blocked successfully",
      blockUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const unblockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "user unblocked successfully",
      unblockUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAllUsers = asyncHandler(async (req, res) => {
  try {
    const deleteUser = await User.deleteMany({ role: "user" });
    res.json({
      message: "All users deleted successfully",
      deleteUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    //Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "fields", "search"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = User.find(JSON.parse(queryStr));

    // Search
    if (req.query.search) {
      const searchField = req.query.searchField; // Add this line to get the search field from the query parameters
      let searchQuery = {
        username: { $regex: req.query.search, $options: "i" },
      };
      query = query.find(searchQuery);
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const usersCount = await User.countDocuments();
      if (skip >= usersCount) throw new Error("This Page does not exists");
    }
    const totalUsers = await User.countDocuments(JSON.parse(queryStr));
    const users = await query;
    res.json({ users, totalUsers });
  } catch (error) {
    throw new Error(error);
  }
});

const addCompany = asyncHandler(async (req, res) => {
  // const {id} = req.user
  const { mobile, email, companyName } = req.body;
  try {
    const company = await Company.findOne({ mobile });
    if (company) throw new Error("Company with this mobile already exists");
    const newCompany = await Company.create({ mobile, email, companyName }); // check if it can be added with await company.save()
    const token = await newCompany.createCompanyToken();
    await newCompany.save();
    console.log(token);
    res.json(newCompany);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCompanies = asyncHandler(async (req, res) => {
  try {
    //Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "fields", "search"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = User.find(JSON.parse(queryStr));

    // Search
    if (req.query.search) {
      const searchField = req.query.searchField; // Add this line to get the search field from the query parameters
      let searchQuery = {
        username: { $regex: req.query.search, $options: "i" },
      };
      query = query.find(searchQuery);
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const usersCount = await Company.countDocuments();
      if (skip >= usersCount) throw new Error("This Page does not exists");
    }
    const totalUsers = await Company.countDocuments(JSON.parse(queryStr));
    const users = await query;
    res.json({ users, totalUsers });
  } catch (error) {
    throw new Error(error);
  }
});

const getCompanyInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ message: "Company updated successfully", company });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllSales = asyncHandler(async (req, res) => {
  try {
    const sales = await Sale.find();
    res
      .status(200)
      .json({ message: "All sales retrieved successfully", sales });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUserTransactions = asyncHandler(async (req, res) => {
  try {
    const transactions = await UserTransaction.find();
    res
      .status(200)
      .json({
        message: "All user transacations retrieved successfully",
        transactions,
      });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCompanyTransactions = asyncHandler(async (req, res) => {
  try {
    const transactions = await CompanyTransaction.find();
    res
      .status(200)
      .json({
        message: "All company transacations retrieved successfully",
        transactions,
      });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  register,
  login,
  logout,
  viewProfile,
  getaUser,
  blockUser,
  unblockUser,
  deleteAllUsers,
  getAllUsers,
  addCompany,
  getAllCompanies,
  getCompanyInfo,
  deleteCompany,
  updateCompany,
  getAllSales,
  getAllUserTransactions,
  getAllCompanyTransactions,
};
