const express = require("express");
const {
  login,
  register,
  logout,
  viewProfile,
  deleteAccount,
  sellShare,
  buyUsersShare,
  deleteShare,
  getUserShare,
  getAllSales,
  buyCompanyShare,
  getAllBoughtTransaction,
  getAllSoldTransaction,
  getAllShares,
  getBoughtCompanyTransaction,
} = require("../controllers/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", viewProfile);
router.delete("/delete", authMiddleware, deleteAccount);
router.post("/buy-company-share/:userId", buyCompanyShare);
router.post("/sell-share/:userId", sellShare);
router.post("/buy-user-share/:userId", buyUsersShare);
router.delete("/delete-share/:userId", deleteShare);
router.get("/users-share/:userId", getUserShare);
router.get("/all-sales", getAllSales);
router.get("/all-shares", getAllShares);
router.get("/all-bought-transaction", getAllBoughtTransaction);
router.get("/bought-company-transaction", getBoughtCompanyTransaction);
router.get("/all-sold-transaction", getAllSoldTransaction);

module.exports = router;
