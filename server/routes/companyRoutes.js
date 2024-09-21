const express = require("express");
const { addShares } = require("../controllers/companyCtrl");
const router = express.Router();

router.post("/add-shares", addShares);

module.exports = router;
