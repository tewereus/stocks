const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const companyRouter = require("./routes/companyRoutes");

const { notFound, errorHandler } = require("./middlewares/errorHandler");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = process.env.PORT || 9001;

connectDB();
app.use(morgan("dev"));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/company", companyRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, (req, res) => {
  console.log(`server running on port ${PORT}`);
});
