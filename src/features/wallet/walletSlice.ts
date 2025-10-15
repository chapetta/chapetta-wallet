import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCurrencies = createAsyncThunk(
  "wallet/fetchCurrencies",
  async () => {
    const response = await fetch("https://economia.awesomeapi.com.br/json/all");
    const data = await response.json();

    return Object.keys(data).filter((item) => item !== "USDT");
  }
);

type Expense = {
  id: number;
  value: string;
  description: string;
  currency: string;
  method: string;
  tag: string;
  exchangeRates: Record<string, any>;
};

type walletState = {
  currencies: string[];
  expenses: Expense[];
  loading: boolean;
  error: string | null;
};

const initialState: walletState = {
  currencies: [],
  expenses: [],
  loading: false,
  error: null,
};

export const addExpense = createAsyncThunk(
  "wallet/addExpense",
  async (expenseData: Omit<Expense, "id" | "exchangeRates">, { getState }) => {
    const response = await fetch("https://economia.awesomeapi.com.br/json/all");
    const exchangeRates = await response.json();

    const state = getState() as { wallet: walletState };
    const newId = state.wallet.expenses.length;

    return {
      ...expenseData,
      id: newId,
      exchangeRates,
    };
  }
);

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
      }).addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload)
      })
  },
});

export default walletSlice.reducer;
