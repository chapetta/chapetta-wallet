import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import useExpensesStore from "@/stores/WalletStore";

export const Wallet = () => {
  const {
    currencies,
    fetchCurrencies,
    expenses,
    addExpense,
    getTotalExpenses,
    deleteExpense,
  } = useExpensesStore((state) => state);

  const [form, setForm] = useState({
    value: "",
    description: "",
    currency: "",
    tag: "Alimentação",
    method: "Dinheiro",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.value || !form.description || !form.currency) return;

    addExpense(form);

    setForm({
      ...form,
      value: "",
      description: "",
    });

    getTotalExpenses();
  };

  useEffect(() => {
    getTotalExpenses();
  }, [expenses]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-400 to-blue-600">
      <Header />

      <main className="max-w-6xl mx-auto px-6 mt-8 flex flex-col gap-10">
        <Card className="bg-white shadow-xl rounded-lg">
          <CardContent className="p-6">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Descrição da despesa
                  </label>
                  <Input
                    placeholder="Ex: Restaurante"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Categoria da despesa
                  </label>
                  <Select
                    name="tag"
                    value={form.tag}
                    onValueChange={(value) => setForm({ ...form, tag: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alimentação">Alimentação</SelectItem>
                      <SelectItem value="Lazer">Lazer</SelectItem>
                      <SelectItem value="Trabalho">Trabalho</SelectItem>
                      <SelectItem value="Transporte">Transporte</SelectItem>
                      <SelectItem value="Saúde">Saúde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Valor</label>
                  <Input
                    type="number"
                    name="value"
                    placeholder="0.00"
                    value={form.value}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Método de pagamento
                  </label>
                  <Select
                    name="method"
                    value={form.method}
                    onValueChange={(value) =>
                      setForm({ ...form, method: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartao-credito">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="cartao-debito">
                        Cartão de Débito
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-1/3">
                  <label className="text-sm font-medium">Moeda</label>
                  <Select
                    name="currency"
                    value={form.currency}
                    onValueChange={(value) =>
                      setForm({ ...form, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold mt-4 md:mt-6 cursor-pointer"
                >
                  Adicionar despesa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="bg-blue-700 text-white rounded-lg shadow-lg p-4">
          <Table>
            <TableHeader className="text-center">
              <TableRow>
                <TableHead className="text-white text-center">
                  Descrição
                </TableHead>
                <TableHead className="text-white text-center">Tag</TableHead>
                <TableHead className="text-white text-center">
                  Método de pagamento
                </TableHead>
                <TableHead className="text-white text-center">Valor</TableHead>
                <TableHead className="text-white text-center">Moeda</TableHead>
                <TableHead className="text-white text-center">
                  Câmbio utilizado
                </TableHead>
                <TableHead className="text-white text-center">
                  Valor convertido
                </TableHead>
                <TableHead className="text-white text-center">
                  Moeda de conversão
                </TableHead>
                <TableHead className="text-white text-center">
                  Excluir
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((exp) => {
                const rate = Number(exp.exchangeRates[exp.currency].ask);
                const converted = Number(exp.value) * rate;
                return (
                  <TableRow className="hover:bg-blue-800/60 transition text-center">
                    <TableCell>{exp.description}</TableCell>
                    <TableCell>{exp.tag}</TableCell>
                    <TableCell>{exp.method}</TableCell>
                    <TableCell>{Number(exp.value).toFixed(2)}</TableCell>
                    <TableCell>{exp.currency}</TableCell>
                    <TableCell>{rate.toFixed(2)}</TableCell>
                    <TableCell>{converted.toFixed(2)}</TableCell>
                    <TableCell>BRL</TableCell>
                    <TableCell className="text-center">
                      <button
                        className="cursor-pointer"
                        onClick={() => deleteExpense(exp.id)}
                      >
                        🗑️
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};
