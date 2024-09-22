const express = require("express");
const {
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
} = require("../controllers/adminCtrl");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile/:id", viewProfile);
router.get("/get-user/:id", getaUser);
router.post("/block-user/:id", blockUser);
router.post("/unblock-user/:id", unblockUser);
router.delete("/delete-users", deleteAllUsers);
router.get("/get-users", getAllUsers);
router.post("/add-company", addCompany);
router.get("/get-companies", getAllCompanies);
router.get("/get-company/:id", getCompanyInfo);
router.delete("/delete-company/:id", deleteCompany);
router.put("/update-company/:id", updateCompany);
router.get("/all-sales", getAllSales);

module.exports = router;
