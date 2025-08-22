"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Sidebar from "../../components/Sidebar"

const AuthenticatedLayoutClient = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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