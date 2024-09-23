import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

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
      });
  },
});

export const { resetAuthState } = userSlice.actions;
export default userSlice.reducer;
