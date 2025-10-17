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
import { useEffect } from "react";
import useExpensesStore from "@/stores/WalletStore";
import { Trash2Icon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema de validação
const expenseSchema = z.object({
  value: z
    .string()
    .min(1, "O valor é obrigatório")
    .refine((v) => parseFloat(v) > 0, "O valor deve ser maior que 0"),
  description: z.string().min(1, "A descrição é obrigatória"),
  currency: z.string().min(1, "Selecione uma moeda"),
  tag: z.string().min(1, "Selecione uma categoria"),
  method: z.string().min(1, "Selecione um método de pagamento"),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export const Wallet = () => {
  const {
    currencies,
    fetchCurrencies,
    expenses,
    addExpense,
    getTotalExpenses,
    deleteExpense,
  } = useExpensesStore((state) => state);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      value: "",
      description: "",
      currency: "",
      tag: "Alimentação",
      method: "Dinheiro",
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    addExpense(data);
    reset({
      value: "",
      description: "",
      currency: "",
      tag: "Alimentação",
      method: "Dinheiro",
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
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Descrição */}
                <div>
                  <label className="text-sm font-medium">
                    Descrição da despesa
                  </label>
                  <Input
                    placeholder="Ex: Restaurante"
                    {...register("description")}
                    className={
                      errors.description ? "animate-shake border-red-500" : ""
                    }
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Categoria */}
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <Select
                    onValueChange={(value) => setValue("tag", value)}
                    defaultValue="Alimentação"
                  >
                    <SelectTrigger
                      className={
                        errors.tag ? "animate-shake border-red-500" : ""
                      }
                    >
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
                  {errors.tag && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.tag.message}
                    </p>
                  )}
                </div>

                {/* Valor */}
                <div>
                  <label className="text-sm font-medium">Valor</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("value")}
                    className={
                      errors.value ? "animate-shake border-red-500" : ""
                    }
                  />
                  {errors.value && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.value.message}
                    </p>
                  )}
                </div>

                {/* Método */}
                <div>
                  <label className="text-sm font-medium">
                    Método de pagamento
                  </label>
                  <Select
                    onValueChange={(value) => setValue("method", value)}
                    defaultValue="Dinheiro"
                  >
                    <SelectTrigger
                      className={
                        errors.method ? "animate-shake border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Selecionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Cartão de Crédito">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="Cartão de Débito">
                        Cartão de Débito
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.method && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.method.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Moeda */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-1/3">
                  <label className="text-sm font-medium">Moeda</label>
                  <Select
                    onValueChange={(value) => setValue("currency", value)}
                    defaultValue=""
                  >
                    <SelectTrigger
                      className={
                        errors.currency ? "animate-shake border-red-500" : ""
                      }
                    >
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
                  {errors.currency && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.currency.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold mt-4 md:mt-6"
                >
                  Adicionar despesa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tabela */}
        <div className="bg-blue-700 text-white rounded-lg shadow-lg p-4">
          <Table>
            <TableHeader className="text-center">
              <TableRow>
                <TableHead className="text-white text-center">
                  Descrição
                </TableHead>
                <TableHead className="text-white text-center">Tag</TableHead>
                <TableHead className="text-white text-center">Método</TableHead>
                <TableHead className="text-white text-center">Valor</TableHead>
                <TableHead className="text-white text-center">Moeda</TableHead>
                <TableHead className="text-white text-center">Câmbio</TableHead>
                <TableHead className="text-white text-center">
                  Convertido
                </TableHead>
                <TableHead className="text-white text-center">BRL</TableHead>
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
                  <TableRow
                    key={exp.id}
                    className="hover:bg-blue-800/60 transition text-center"
                  >
                    <TableCell>{exp.description}</TableCell>
                    <TableCell>{exp.tag}</TableCell>
                    <TableCell>{exp.method}</TableCell>
                    <TableCell>{Number(exp.value).toFixed(2)}</TableCell>
                    <TableCell>{exp.currency}</TableCell>
                    <TableCell>{rate.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(converted)}
                    </TableCell>
                    <TableCell>BRL</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        className="cursor-pointer hover:bg-red-600"
                        onClick={() => deleteExpense(exp.id)}
                      >
                        <Trash2Icon />
                      </Button>
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
