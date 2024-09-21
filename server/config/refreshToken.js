const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    "056d5e46c64d02bca6313aed117e88d4617a2cf3f9174f1406bb42058266a417",
    { expiresIn: "3d" }
  );
};

module.exports = { generateRefreshToken };
