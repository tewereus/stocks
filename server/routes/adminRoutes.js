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
} = require("../controllers/adminCtrl");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", viewProfile);
router.get("/get-user", getaUser);
router.put("/block-user", blockUser);
router.put("/unblock-user", unblockUser);
router.delete("/delete-users", deleteAllUsers);
router.get("/get-users", getAllUsers);
router.post("/add-company", addCompany);
router.get("/get-companies", getAllCompanies);
router.get("/get-company/:id", getCompanyInfo);
router.delete("/delete-company", deleteCompany);
router.put("/update-company", updateCompany);

module.exports = router;
