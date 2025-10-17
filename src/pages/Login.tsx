import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";
import logo from "@/assets/logo.svg";

const loginSchema = z.object({
  email: z.email({ message: "E-mail inválido" }),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export const Login = () => {
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { setEmail } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const onSubmit = (data: LoginData) => {
    setEmail(data.email);
    navigate("/wallet");
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <img
        src="/backgroundImage.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-emerald-400 mix-blend-multiply"></div>

      <Card className="relative w-[480px] shadow-2xl bg-white h-auto rounded-2xl z-10 border border-gray-200 flex">
        <CardHeader className="text-center flex flex-col items-center gap-2 mt-2">
          <img src={logo} alt="ChapsWallet Logo" className="w-16 h-16" />

          <CardTitle className="text-3xl font-bold tracking-tight">
            <span className="text-[#4C00FF]">Chaps</span>
            <span className="text-[#00BFA6] ml-1">Wallet</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 mt-6 px-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">
                      E-mail:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="exemplo@hotmail.com"
                        className="border-2 border-[#00BFA6]/30 focus:border-[#00BFA6] focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700">
                      Senha:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Digite sua senha"
                        className="border-2 border-[#00BFA6]/30 focus:border-[#00BFA6] focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#4C00FF] hover:bg-[#3a00d1] text-white font-semibold mt-5 transition-all"
                disabled={!form.formState.isValid}
              >
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
