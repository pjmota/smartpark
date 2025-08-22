"use client";

import React from "react";
import { Settings } from "lucide-react";

const MonthlyPayers = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 text-gray-700">
      <Settings className="w-20 h-20 text-[#7ad33e] animate-spin-slow mb-6" />
      <h1 className="text-2xl font-bold">Página em construção</h1>
      <p className="text-gray-500 mt-2 text-center max-w-md">
        Estamos trabalhando para trazer novidades em breve. 
        Volte mais tarde para conferir 🚧
      </p>
    </div>
  );
};

export default MonthlyPayers;