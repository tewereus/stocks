const express = require("express");
const { addShares, deleteShares } = require("../controllers/companyCtrl");
const router = express.Router();

router.post("/add-shares", addShares);
router.delete("/delete-shares/:shareId", deleteShares);

module.exports = router;
