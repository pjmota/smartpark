"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Sidebar from "../../components/Sidebar"
import { useAuth } from "@/context/AuthContext/AuthContext";
import { useRouter } from "next/navigation";

const AuthenticatedLayoutClient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Usuário não autenticado! Redirecionando para login...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside 
        className={`
          fixed left-0 top-0 h-screen bg-white
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-50' : 'w-16'}
        `}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </aside>
      <div 
        className={`
          flex-1 flex flex-col
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'ml-50' : 'ml-16'}
        `}
      >
        <Header />
        <main className="flex-1 px-4 pb-4 pt-0 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayoutClient;