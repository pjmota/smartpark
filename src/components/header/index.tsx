"use client";

import { useRouter } from "next/navigation";
import { Button, InputAdornment } from "@mui/material";
import { LogOut, User } from "lucide-react";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="flex justify-end items-center h-16 px-6 bg-white">
      <div className="flex items-center space-x-4 text-sm">
        <InputAdornment position="start" sx={{color:"#99a1af"}}>
          <User
            className="text-gray-400 cursor-pointer mr-1 w-5 h-5"
            aria-label="Ícone de usuário"
          /> Roberto Freitas
        </InputAdornment>
        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{
            color: "#99a1af",
            border: "none",
            textTransform: "none"
          }}
        >
          <LogOut className="mr-1 w-5 h-5"/> Sair
        </Button>
      </div>
    </header>
  );
};

export default Header;