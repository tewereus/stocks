import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
  shares: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const getAllShares = createAsyncThunk("auth/login", async (thunkAPI) => {
  try {
    return await userService.getAllShares();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      return await authService.register(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getBoughtCompanyTransaction = createAsyncThunk(
  "auth/bought-company-transaction",
  async (thunkAPI) => {
    try {
      return await authService.getBoughtCompanyTransaction();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
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
      })
      .addCase(getAllShares.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
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
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
