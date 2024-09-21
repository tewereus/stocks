const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");

const userRouter = require("./route/userRoutes");

const PORT = process.env.PORT || 9001;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);

app.listen(PORT, (req, res) => {
  console.log(`server running on port ${PORT}`);
});
