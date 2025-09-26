"use client";

import React from "react";
import { Card, CardContent, InputAdornment, OutlinedInput, IconButton } from "@mui/material";
import IOSSwitch from "@/components/IOSSwitch";
import { IGarageFilterCardProps } from "@/types/garage.type";
import { Search, ArrowRight } from "lucide-react";

export const GarageFilterCard = ({
  count,
  search,
  setSearch,
  enabled,
  setEnabled,
  onFiltersChange,
}: IGarageFilterCardProps) => {
  
  // Função para executar a busca
  const executeSearch = () => {
    if (onFiltersChange) {
      onFiltersChange({
        search: search || undefined,
        digitalMonthlyPayer: enabled, // true = apenas mensalistas digitais, false = todos
      });
    }
  };
  
  // Handler para mudança no campo de busca (apenas atualiza o estado)
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  
  // Handler para pressionar Enter
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      executeSearch();
    }
  };
  
  // Handler para mudança no switch
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEnabled = event.target.checked;
    setEnabled(newEnabled);
    
    // Aplicar filtro do switch imediatamente
    if (onFiltersChange) {
      onFiltersChange({
        search: search || undefined,
        digitalMonthlyPayer: newEnabled,
      });
    }
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, py: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IOSSwitch
              checked={enabled}
              onChange={handleSwitchChange}
            />
            <span style={{ color: '#374151', fontWeight: 500, fontSize: '14px' }}>Mensalista Digital</span>
          </div>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>{count} registros</span>
        </div>
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <OutlinedInput
            placeholder="Buscar por nome ou código"
            value={search || ''}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            startAdornment={
              <InputAdornment position="start">
                <Search style={{ width: '16px', height: '16px', color: '#9CA3AF' }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={executeSearch}
                  size="small"
                  sx={{ 
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ArrowRight style={{ width: '16px', height: '16px', color: '#6B7280' }} />
                </IconButton>
              </InputAdornment>
            }
            sx={{
              width: "100%",
              height: "40px",
              "& .MuiOutlinedInput-input": {
                padding: "8px 14px",
                fontSize: "14px",
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GarageFilterCard;