import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";
import Toast from "react-native-toast-message";

const initialState = {
  shares: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const getAllShares = createAsyncThunk(
  "user/all-shares",
  async (thunkAPI) => {
    try {
      return await userService.getAllShares();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (data, thunkAPI) => {
    try {
      return await authService.register(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getBoughtCompanyTransaction = createAsyncThunk(
  "user/bought-company-transaction",
  async (thunkAPI) => {
    try {
      return await userService.getBoughtCompanyTransaction();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getBoughtUsersTransaction = createAsyncThunk(
  "user/bought-users-transaction",
  async (thunkAPI) => {
    try {
      return await userService.getBoughtUsersTransaction();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getSoldUsersTransaction = createAsyncThunk(
  "user/sold-users-transaction",
  async (thunkAPI) => {
    try {
      return await userService.getSoldUsersTransaction();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllSales = createAsyncThunk(
  "user/all-sales",
  async (thunkAPI) => {
    try {
      return await userService.getAllSales();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getCompaniesShare = createAsyncThunk(
  "user/users-share",
  async (thunkAPI) => {
    try {
      return await userService.getCompaniesShare();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const sellShare = createAsyncThunk(
  "user/sell-share",
  async (data, thunkAPI) => {
    try {
      return await userService.sellShare(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const buyUsersShare = createAsyncThunk(
  "user/buy-user-share",
  async (data, thunkAPI) => {
    try {
      return await userService.buyUsersShare(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const buyCompanyShare = createAsyncThunk(
  "user/buy-company-share",
  async (data, thunkAPI) => {
    try {
      return await userService.buyCompanyShare(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllShares.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllShares.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.shares = action.payload;
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Got all shares successfully",
        });
      })
      .addCase(getAllShares.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error: Got all shares successfully",
        });
      })
      .addCase(getBoughtCompanyTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBoughtCompanyTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.companyTransaction = action.payload;
      })
      .addCase(getBoughtCompanyTransaction.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
      })
      .addCase(getBoughtUsersTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBoughtUsersTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.userTransaction = action.payload;
      })
      .addCase(getBoughtUsersTransaction.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
      })
      .addCase(getSoldUsersTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSoldUsersTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.soldTransaction = action.payload;
      })
      .addCase(getSoldUsersTransaction.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
      })
      .addCase(getAllSales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.sales = action.payload;
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Got all sales successfully",
        });
      })
      .addCase(getAllSales.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
      })
      .addCase(getCompaniesShare.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompaniesShare.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.companies = action.payload;
      })
      .addCase(getCompaniesShare.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
      })
      .addCase(sellShare.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sellShare.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.soldshares = action.payload;
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "share uploaded successfully",
        });
      })
      .addCase(sellShare.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        console.log(state.message.message);
        Toast.show({
          type: "error",
          text1: state.message.message,
        });
      })
      .addCase(buyUsersShare.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(buyUsersShare.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.soldUserShares = action.payload;
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "share bought uploaded successfully",
        });
      })
      .addCase(buyUsersShare.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        console.log(state.message.message);
        Toast.show({
          type: "error",
          text1: state.message.message,
        });
      })
      .addCase(buyCompanyShare.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(buyCompanyShare.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.soldCompanyShares = action.payload;
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "company share bought uploaded successfully",
        });
      })
      .addCase(buyCompanyShare.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        console.log(state.message.message);
        Toast.show({
          type: "error",
          text1: state.message.message,
        });
      });
  },
});

export const { resetAuthState } = userSlice.actions;
export default userSlice.reducer;
