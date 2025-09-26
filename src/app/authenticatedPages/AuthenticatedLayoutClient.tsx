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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar com overlay em mobile */}
      <aside 
        className={`
          fixed left-0 top-0 h-screen bg-white z-40
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-50' : 'w-16'}
          lg:relative lg:z-auto
        `}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </aside>
      
      {/* Overlay para mobile quando sidebar está aberta */}
      {isSidebarOpen && (
        <button 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden border-0 p-0 cursor-default"
          onClick={toggleSidebar}
          aria-label="Fechar sidebar"
        />
      )}
      
      <div 
        className={`
          flex-1 flex flex-col min-w-0
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:ml-3' : 'lg:ml-4'}
        `}
      >
        <Header />
        <main className="flex-1 px-2 sm:px-4 pb-4 pt-0 bg-gray-50 overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayoutClient;