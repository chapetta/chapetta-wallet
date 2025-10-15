import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { Wallet } from "@/pages/Wallet";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/wallet" element={<Wallet />} />
    </Routes>
  );
};
