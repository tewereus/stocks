const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      const user = await User.create(req.body);
      res.json(user);
    } else {
      res.status(401).json({ message: "user already exists" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  register,
};
