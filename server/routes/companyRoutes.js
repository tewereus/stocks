const express = require("express");
const {
  addShares,
  deleteShares,
  getAllSales,
} = require("../controllers/companyCtrl");
const router = express.Router();

router.post("/add-shares", addShares);
router.delete("/delete-shares/:shareId", deleteShares);
router.get("/all-sales", getAllSales);

module.exports = router;
