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
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addExpense, fetchCurrencies } from "@/features/wallet/walletSlice";

export const Wallet = () => {
  const dispatch = useAppDispatch();
  const { currencies, loading, expenses } = useAppSelector(
    (state) => state.wallet
  );

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

    dispatch(addExpense(form));

    setForm({
      ...form,
      value: "",
      description: "",
    });
  };

  useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);

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
                  className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold mt-4 md:mt-6"
                >
                  Adicionar despesa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="bg-blue-700 text-white rounded-lg shadow-lg p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Descrição</TableHead>
                <TableHead className="text-white">Tag</TableHead>
                <TableHead className="text-white">
                  Método de pagamento
                </TableHead>
                <TableHead className="text-white">Valor</TableHead>
                <TableHead className="text-white">Moeda</TableHead>
                <TableHead className="text-white">Câmbio utilizado</TableHead>
                <TableHead className="text-white">Valor convertido</TableHead>
                <TableHead className="text-white">Moeda de conversão</TableHead>
                <TableHead className="text-white">Editar/Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((exp) => {
                const rate = Number(exp.exchangeRates[exp.currency].ask);
                const converted = Number(exp.value) * rate;
                return (
                  <TableRow className="hover:bg-blue-800/60 transition">
                    <TableCell>{exp.description}</TableCell>
                    <TableCell>{exp.tag}</TableCell>
                    <TableCell>{exp.method}</TableCell>
                    <TableCell>{Number(exp.value).toFixed(2)}</TableCell>
                    <TableCell>{exp.currency}</TableCell>
                    <TableCell>{rate}</TableCell>
                    <TableCell>{converted.toFixed(2)}</TableCell>
                    <TableCell>BRL</TableCell>
                    <TableCell>✏️ 🗑️</TableCell>
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
