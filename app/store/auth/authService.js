import axios from "axios";
import { baseUrl } from "../../constants/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const register = async (data) => {
  const response = await axios.post(`${baseUrl}/user/register`, data);
  // console.log(response.data);
  return response.data;
};

const login = async (data) => {
  const response = await axios.post(`${baseUrl}/user/login`, data);
  // console.log(response.data);
  if (response.data.token) {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error storing token:", error); // Log any errors encountered while storing
      throw new Error("Failed to store token"); // Throw an error to be caught in the slice
    }
  }
  // if (response.data.token) {
  //   await AsyncStorage.setItem("token", response.data.token);
  // }
  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;
