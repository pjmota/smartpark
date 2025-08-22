import React from "react";
import { IGarageInfoCard } from "@/types/garage.types";

const GarageInfoCard = ({
  label,
  value,
  icon,
  color = "text-gray-600",
}: IGarageInfoCard) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      <span className={`text-xl font-bold flex items-center gap-2 ${color}`}>
        {icon}
        {value}
      </span>
      <p className="text-sm text-gray-500 mt-2">{label}</p>
    </div>
  );
}

export default GarageInfoCard;