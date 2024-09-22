const express = require("express");
const {
  login,
  register,
  logout,
  viewProfile,
  deleteAccount,
  buyShare,
  sellShare,
  buyUsersShare,
  deleteShare,
  getUserShare,
  getAllSales,
} = require("../controllers/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", viewProfile);
router.delete("/delete", authMiddleware, deleteAccount);
router.post("/buy-share/:userId", buyShare);
router.post("/sell-share/:userId", sellShare);
router.post("/buy-user-share/:userId", buyUsersShare);
router.delete("/delete-share/:userId", deleteShare);
router.get("/users-share/:userId", getUserShare);
router.get("/all-sales", getAllSales);

module.exports = router;
