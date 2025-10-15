import { useAppSelector } from "@/app/hooks";
import { Coins, User } from "lucide-react";
import Logo from "@/assets/react.svg";

export const Header = () => {
  const email = useAppSelector((state) => state.auth.email);
  const totalDespesas = 320.98;

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Chaps Wallet Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-semibold text-blue-600">
            Trybe<span className="text-emerald-500">Wallet</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Coins className="text-blue-600 w-5 h-5" />
          <span className="text-blue-600 font-semibold">
            Total de despesas:{" "}
            <span className="font-bold">{totalDespesas.toFixed(2)} BRL</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 text-white rounded-full p-1">
            <User className="w-4 h-4" />
          </div>
          <span className="text-emerald-600 font-medium">
            {email || "email@email.com"}
          </span>
        </div>
      </div>
    </header>
  );
};
