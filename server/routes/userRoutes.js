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
  getAllUsersSales,
  getBoughtUsersTransaction,
  getSoldUsersTransaction,
  getCompaniesShare,
} = require("../controllers/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", viewProfile);
router.delete("/delete", authMiddleware, deleteAccount);
router.post("/buy-company-share", authMiddleware, buyCompanyShare);
router.post("/sell-share", authMiddleware, sellShare);
router.post("/buy-user-share", authMiddleware, buyUsersShare);
router.delete("/delete-share/:userId", deleteShare);
router.get("/users-share/:userId", getUserShare);
router.get("/all-users-sales", getAllUsersSales);
router.get("/all-sales", authMiddleware, getAllSales);
router.get("/all-shares", getAllShares);
router.get("/all-bought-transaction", getAllBoughtTransaction);
router.get(
  "/bought-company-transaction",
  authMiddleware,
  getBoughtCompanyTransaction
);

router.get(
  "/bought-users-transaction",
  authMiddleware,
  getBoughtUsersTransaction
);

router.get("/sold-users-transaction", authMiddleware, getSoldUsersTransaction);
router.get("/users-company-shares", authMiddleware, getCompaniesShare);
router.get("/all-sold-transaction", getAllSoldTransaction);

module.exports = router;
