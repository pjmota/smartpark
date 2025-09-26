"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "../../assets/smartpark_logo.png";
import Logo2 from "../../assets/smartpark_S_logo.png";
import { Building2, Car, ChevronLeft, House } from "lucide-react";
import { ISidebarProps } from "@/types/sidebar.type";

const Sidebar = ({ isOpen, toggleSidebar }: ISidebarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      path: "/authenticatedPages/welcome",
      icon: House,
      label: "Home",
    },
    {
      path: "/authenticatedPages/garages",
      icon: Building2,
      label: "Garagens",
    },
    {
      path: "/authenticatedPages/monthlyPayers",
      icon: Car,
      label: "Mensalistas",
    },
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className={`${isOpen ? 'p-6' : 'p-2'} border-b border-gray-200 relative`}>
        {isOpen ? (
          <>
            <Image
              src={Logo}
              alt="Logo SmartPark"
              width={130}
              height={90}
              className="ml-2"
            />
            <button
              onClick={toggleSidebar}
              className="absolute top-17 left-46 p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none border border-gray-200"
              aria-label="Fechar sidebar"
            >
              <ChevronLeft className="w-3 h-3 text-gray-400" />
            </button>
          </>
        ) : (
          <div className="flex justify-center">
            <Image
              src={Logo2}
              alt="Logo SmartPark Reduzida"
              width={40}
              height={40}
              className="cursor-pointer rounded-md"
              onClick={toggleSidebar}
            />
          </div>
        )}
      </div>
      <nav className={`flex-1 ${isOpen ? 'p-4' : 'p-2'} space-y-2`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center'} 
                ${isOpen ? 'py-2' : 'p-3'} rounded-md transition-colors
                ${
                  isActive(item.path)
                    ? "bg-[#7ad33e] text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }
              `}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5" />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;