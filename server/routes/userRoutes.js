const express = require("express");
const {
  login,
  register,
  logout,
  viewProfile,
  deleteAccount,
  buyShare,
} = require("../controllers/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", viewProfile);
router.delete("/delete", authMiddleware, deleteAccount);
router.post("/buy-share/:userId", buyShare);

module.exports = router;
