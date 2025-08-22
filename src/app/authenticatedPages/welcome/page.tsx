"use client";

import React from "react";
import WelcomeCard from "@/components/cards/WelcomeCards/index";
import { Building2, Car } from "lucide-react";


const WelcomePage = () => {

  const welcomeDataCards = [
    {
      title: "Garagens",
      description: "Veja a lista de garagens disponíveis e suas configurações.",
      icon:  <Building2 />,
      route: "/authenticatedPages/garages"
    },
    {
      title: "Mensalistas",
      description: "Contrate vagas adicionais para seus funcionários ou visitantes.",
      icon:  <Car />,
      route: "/authenticatedPages/monthlyPayers"
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">
        Bem-vindo ao Portal Estapar B2B
      </h1>
      <p className="text-base text-gray-700 max-w-2xl">
        Gerencie seus serviços de estacionamento, acesse relatórios, configure
        credenciados e contrate planos de mensalidade em um só lugar.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {welcomeDataCards.map((card) => (
          <WelcomeCard
            key={card.title}
            title={card.title}
            description={card.description}
            icon={card.icon}
            route={card.route}
          />
        ))}
      </div>
    </div>
  );
}

export default WelcomePage;