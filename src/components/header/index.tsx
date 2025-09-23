"use client";

import { Button, InputAdornment } from "@mui/material";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex justify-end items-center h-12 sm:h-16 px-2 sm:px-6 bg-white">
      <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
        <InputAdornment position="start" sx={{color:"#99a1af"}}>
          <User
            className="text-gray-400 cursor-pointer mr-1 w-4 h-4 sm:w-5 sm:h-5"
            aria-label="Ícone de usuário"
          /> 
          <span className="hidden sm:inline">{user?.username || 'Usuário'}</span>
          <span className="sm:hidden">{(user?.username || 'Usuário').split(' ')[0]}</span>
        </InputAdornment>
        <Button
          variant="outlined"
          onClick={handleLogout}
          size="small"
          sx={{
            color: "#99a1af",
            border: "none",
            textTransform: "none",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            padding: { xs: "4px 8px", sm: "6px 16px" }
          }}
        >
          <LogOut className="mr-1 w-4 h-4 sm:w-5 sm:h-5"/> 
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;