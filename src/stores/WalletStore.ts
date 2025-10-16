import { create } from "zustand";
import { persist } from "zustand/middleware";

type Expense = {
  id: number;
  value: string;
  description: string;
  currency: string;
  method: string;
  tag: string;
  exchangeRates: Record<string, any>;
};

type WalletStore = {
  expenses: Expense[];
  currencies: string[];
  fetchCurrencies: () => Promise<void>;
  error: string | null;
  addExpense: (expense: Omit<Expense, "id" | "exchangeRates">) => Promise<void>;
  totalExpenses: number;
  getTotalExpenses: () => void;
};

const useExpensesStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      currencies: [],
      error: null,
      totalExpenses: 0,
      fetchCurrencies: async () => {
        try {
          const response = await fetch(
            "https://economia.awesomeapi.com.br/json/all"
          );
          const data = await response.json();
          const currencies = Object.keys(data).filter(
            (item) => item !== "USDT"
          );
          set({ currencies, error: null });
        } catch (e) {
          console.log(e);
          set({ error: "Erro ao carregar as moedas" });
        }
      },
      addExpense: async (expense) => {
        try {
          const response = await fetch(
            "https://economia.awesomeapi.com.br/json/all"
          );
          const exchangeRates = await response.json();

          const newExpense: Expense = {
            id: Date.now(),
            ...expense,
            exchangeRates,
          };
          set({ expenses: [...get().expenses, newExpense] });
        } catch (error) {
          console.log("Error ao adicionar despesa", error);
        }
      },
      getTotalExpenses: () => {
        const expenses = get().expenses;

        const total = expenses.reduce((acc, exp) => {
          const rate = Number(exp.exchangeRates[exp.currency].ask);
          const converted = Number(exp.value) * rate;
          return acc + converted;
        }, 0);

        set({ totalExpenses: total });
      },
    }),
    {
      name: "wallet-storage",
    }
  )
);

export default useExpensesStore;
