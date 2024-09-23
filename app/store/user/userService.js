import axios from "axios";
import { baseUrl } from "../../constants/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAllShares = async () => {
  const response = await axios.get(`${baseUrl}/user/all-shares`);
  // console.log(response.data);
  return response.data;
};

const getBoughtCompanyTransaction = async () => {
  // console.log("here at company transaction");
  const userData = await AsyncStorage.getItem("user");
  // console.log("user data: ", userData);
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  // console.log("headers: ", headers);

  const response = await axios.get(
    `${baseUrl}/user/bought-company-transaction`,
    {
      headers,
      withCredentials: true,
    }
  );
  // console.log("passed get bought: ", response.data);
  return response.data;
};

const getBoughtUsersTransaction = async () => {
  // console.log("here at company transaction");
  const userData = await AsyncStorage.getItem("user");
  // console.log("user data: ", userData);
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  // console.log("headers: ", headers);

  const response = await axios.get(`${baseUrl}/user/bought-users-transaction`, {
    headers,
    withCredentials: true,
  });
  // console.log("passed get bought: ", response.data);
  return response.data;
};

const getSoldUsersTransaction = async () => {
  // console.log("here at company transaction");
  const userData = await AsyncStorage.getItem("user");
  // console.log("user data: ", userData);
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    // Accept: "application/json",
  };

  // console.log("headers: ", headers);

  const response = await axios.get(`${baseUrl}/user/sold-users-transaction`, {
    headers,
    withCredentials: true,
  });
  // console.log("passed get bought: ", response.data);
  return response.data;
};

const userService = {
  getAllShares,
  getBoughtCompanyTransaction,
  getBoughtUsersTransaction,
  getSoldUsersTransaction,
};

export default userService;
