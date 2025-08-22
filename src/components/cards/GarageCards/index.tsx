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
      <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-2">
          <IOSSwitch
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span className="text-gray-700 font-medium">Mensalista Digital</span>
        </div>
        <span className="text-sm text-gray-500">{count} registros</span>
        <div>
          <OutlinedInput
            id="search"
            type="text"
            placeholder="Buscar por nome"
            className="h-8"
            value={search}
            size="small"
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search className="text-gray-400 w-5 h-5" />
              </InputAdornment>
            }
            sx={{
              "& input::placeholder": {
                fontSize: "0.85rem",
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GarageFilterCard;