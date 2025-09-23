"use client";

import React from "react";
import {
  Drawer,
  Tabs,
  Tab,
  Box,
  IconButton,
} from "@mui/material";
import {
  Building2,
  MapPin,
  Building,
  X,
} from "lucide-react";
import GarageInfoSection from "@/components/cards/GarageCards/GarageInfoSection";
import GaragePlans from "@/components/cards/GarageCards/GaragePlansCard";
import { IGarageModalProps } from "@/types/garageModals.types";
import { IPlans } from "@/types/clients.types";
import { disableBodyScroll, enableBodyScroll } from "@/utils/modalUtils";

const GarageDrawer = ({ open, onClose, garage }: IGarageModalProps) => {
  const [tab, setTab] = React.useState(0);
  const [temporaryPlans, setTemporaryPlans] = React.useState<IPlans[]>([]);

  // Inicializar planos temporários quando o modal abrir
  React.useEffect(() => {
    if (open && garage?.plans) {
      setTemporaryPlans(Array.isArray(garage.plans) ? garage.plans : [garage.plans]);
    }
  }, [open, garage?.plans]);

  // Controle de acessibilidade do modal
  React.useEffect(() => {
    if (open) {
      // Desabilitar scroll do body quando modal abrir
      disableBodyScroll();
    } else {
      // Reabilitar scroll do body quando modal fechar
      enableBodyScroll();
    }

    // Cleanup: sempre reabilitar scroll quando componente desmontar
    return () => {
      enableBodyScroll();
    };
  }, [open]);

  // Função para atualizar planos temporários
  const handleUpdateTemporaryPlans = (updatedPlans: IPlans[]) => {
    setTemporaryPlans(updatedPlans);
  };

  // Função personalizada para fechar o modal e descartar alterações
  const handleClose = () => {
    // Descartar alterações temporárias
    setTemporaryPlans([]);
    onClose();
  };

  if (!garage) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '98%', md: '90%', lg: '85%' },
          maxWidth: '1600px',
        },
      }}
    >
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        {/* Header com botão de fechar */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
              <Building2 className="w-6 h-6 text-gray-700" />
              {garage.name}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Código: {String(garage.code).padStart(6, "0")}
            </p>
            <p className="flex items-center gap-2 text-gray-600 text-sm mt-1 mb-2">
              <MapPin className="w-4 h-4" /> 
              {garage.address}, {garage.neighborhood}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Building className="w-4 h-4" /> 
              Filial: {garage.branch} - {garage.city} / {garage.uf} · Regional: {garage.regional}
            </p>
          </div>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'gray.600',
              '&:hover': {
                backgroundColor: 'gray.100',
              },
            }}
          >
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Tabs */}
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#ebebeb',
            borderRadius: '8px 8px 0 0',
            p: 0.5,
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': {
                height: '2px',
                backgroundColor: '#7ad33e',
              },
            }}
          >
            <Tab
              label="Mensalista Digital"
              sx={{
                minHeight: '36px',
                padding: '6px 16px',
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'text.secondary',
                '&.Mui-selected': {
                  backgroundColor: '#ffffff',
                  color: 'text.primary',
                  borderRadius: '6px',
                },
              }}
            />
          </Tabs>
        </Box>

        {/* Conteúdo */}
        <div className="space-y-6">
          <GarageInfoSection
            totalSpaces={garage.totalParkingSpace}
            occupiedSpaces={garage.parkingSpaceBusy}
            availableSpaces={garage.parkingSpaceAvailable}
            qrCodeValue="https://www.estapar.com.br/"
          />
          <GaragePlans
            data={temporaryPlans}
            onUpdatePlans={handleUpdateTemporaryPlans}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default GarageDrawer;