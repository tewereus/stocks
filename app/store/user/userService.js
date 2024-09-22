import axios from "axios";
import { baseUrl } from "../../constants/axiosConfig";

const getAllShares = async () => {
  const response = await axios.get(`${baseUrl}/user/all-shares`);
  console.log(response.data);
  return response.data;
};

const getBoughtCompanyTransaction = async () => {
  const response = await axios.get(
    `${baseUrl}/user/bought-company-transaction`
  );
  console.log(response.data);
  return response.data;
};

const userService = {
  getAllShares,
  getBoughtCompanyTransaction,
};

export default userService;
