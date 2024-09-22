const express = require("express");
const {
  addShares,
  deleteShares,
  getAllSales,
  getCompanyTransactions,
} = require("../controllers/companyCtrl");
const router = express.Router();

router.post("/add-shares", addShares);
router.delete("/delete-shares/:shareId", deleteShares);
router.get("/all-sales", getAllSales);
router.get("/all-transaction", getCompanyTransactions);

module.exports = router;
