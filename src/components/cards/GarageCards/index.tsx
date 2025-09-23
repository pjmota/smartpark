"use client";

import React from "react";
import { Card, CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import IOSSwitch from "@/components/IOSSwitch";
import { Search } from "lucide-react";
import { IGarageFilterCardProps } from "@/types/garage.types";

const GarageFilterCard = ({
  enabled,
  setEnabled,
  search,
  setSearch,
  count,
}: IGarageFilterCardProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <IOSSwitch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <span className="text-gray-700 font-medium text-sm sm:text-base">Mensalista Digital</span>
          </div>
          <span className="text-xs sm:text-sm text-gray-500">{count} registros</span>
        </div>
        <div className="w-full sm:w-auto">
          <OutlinedInput
            id="search"
            type="text"
            placeholder="Buscar por nome"
            className="h-8 w-full sm:w-auto"
            value={search}
            size="small"
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              </InputAdornment>
            }
            sx={{
              "& input::placeholder": {
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
              },
              minWidth: { xs: "100%", sm: "200px" }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GarageFilterCard;