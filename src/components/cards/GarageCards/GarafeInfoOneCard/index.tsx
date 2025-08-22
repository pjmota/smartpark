import { IGarageIndoOneCard } from "@/types/garage.types";
import React from "react";

const InfoCard = ({ label, value, icon, iconColor = 'text-gray-600', valueColor }: IGarageIndoOneCard) => (
  <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-start justify-center h-25">
    <p className="text-sm text-gray-500 mt-1">{label}</p>
    <div className={`flex items-center gap-2 ${iconColor}`}>
      {icon}
      <span className={`text-xl font-bold ${valueColor}`}>{value}</span>
    </div>
  </div>
);

export default InfoCard;

