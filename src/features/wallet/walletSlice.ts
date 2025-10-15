import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCurrencies = createAsyncThunk(
  "wallet/fetchCurrencies",
  async () => {
    const response = await fetch("https://economia.awesomeapi.com.br/json/all");
    const data = await response.json();

    return Object.keys(data).filter((item) => item !== "USDT");
  }
);

type walletState = {
  currencies: string[];
  loading: boolean;
  error: string | null;
};

const initialState: walletState = {
  currencies: [],
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Erro ao carregar as moedas";
      });
  },
});

export default walletSlice.reducer;
