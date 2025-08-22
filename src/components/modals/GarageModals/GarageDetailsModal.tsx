"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import {
  Building2,
  MapPin,
  Building,
} from "lucide-react";
import GarageInfoSection from "@/components/cards/GarageCards/GarageInfoSection";
import GaragePlans from "@/components/cards/GarageCards/GaragePlansCard";
import { IGarageModalProps } from "@/types/garageModals.types";


const GarageModal = ({ open, onClose, garage }: IGarageModalProps) => {
  const [tab, setTab] = React.useState(0);

  if (!garage) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth={false}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '1100px',
          width: '100%',
        },
      }}
    >
      <DialogContent className="p-6 space-y-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
              <Building2 className="w-6 h-6 text-gray-700" />
              {garage.name}
            </h2>
            <p className="text-sm text-gray-500 mb-6">Código: {String(garage.code).padStart(6, "0")}</p>
            <p className="flex items-center gap-2 text-gray-600 text-sm mt-1 mb-2">
              <MapPin className="w-4 h-4" /> {garage.address}, {garage.neighborhood}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Building className="w-4 h-4" /> Filial: {garage.branch} - {garage.city} / {garage.uf} · Regional: {garage.regional}
            </p>
          </div>
        </div>
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
        <GarageInfoSection
          totalSpaces={garage.totalParkingSpace}
          occupiedSpaces={garage.parkingSpaceBusy}
          availableSpaces={garage.parkingSpaceAvailable}
          qrCodeValue="https://www.estapar.com.br/"
        />
        <GaragePlans
          data={garage.plans}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GarageModal;