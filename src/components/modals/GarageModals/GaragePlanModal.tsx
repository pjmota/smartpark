"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import { IPlanModalProps } from "@/types/garageModals.types";
import IOSSwitch from "@/components/IOSSwitch";
import FormatCurrency from "@/function/formatCurrency";
import { createPlan, updatePlan } from "@/services/planServices/plans.service";
import { IPlans } from "@/types/clients.types";

const customStyles = {
  "& .MuiInputBase-root": { height: 30, padding: "0 8px" },
  "& .MuiInputBase-input": {
    padding: 0,
    fontSize: "0.8rem",
    "&::placeholder": { fontSize: "0.8rem" },
  },
};

type IPlanCreate = Omit<IPlans, "id">;
type IPlanUpdate = IPlans;

interface IPlanModalWithMemory extends IPlanModalProps {
  onSaveInMemory?: (plan: IPlans) => void;
}

const PlanModal = ({ open, onClose, plan, onSaveInMemory }: IPlanModalWithMemory) => {
  const isEdit = !!plan;

  const [formData, setFormData] = useState<{
    id?: number;
    description: string;
    type: "Carro" | "Moto";
    spaces: number;
    spacesBusy: number;
    spacesAvailable: number;
    value: string;
    cancelValue: string;
    startDate: string;
    endDate: string;
    status: boolean;
  }>({
    id: plan?.id,
    description: plan?.description || "",
    type: (plan?.type as "Carro" | "Moto") || "Carro",
    spaces: plan?.spaces || 1,
    spacesBusy: plan?.spacesBusy ?? 0,
    spacesAvailable: plan?.spacesAvailable ?? (plan?.spaces || 1),
    value: FormatCurrency(plan?.value?.toString() || "0"),
    cancelValue: FormatCurrency(plan?.cancelValue?.toString() || "0"),
    startDate: plan?.startDate || "",
    endDate: plan?.endDate || "",
    status: plan?.status ?? true,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        id: plan?.id,
        description: plan?.description || "",
        type: (plan?.type as "Carro" | "Moto") || "Carro",
        spaces: plan?.spaces || 1,
        spacesBusy: plan?.spacesBusy ?? 0,
        spacesAvailable: plan?.spacesAvailable ?? (plan?.spaces || 1),
        value: FormatCurrency(plan?.value?.toString() || "0"),
        cancelValue: FormatCurrency(plan?.cancelValue?.toString() || "0"),
        startDate: formatDate(plan?.startDate || ""),
        endDate: formatDate(plan?.endDate || ""),
        status: plan?.status ?? true,
      });
    }
  }, [open, plan]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    try {
      let savedPlan: IPlans;

      if (isEdit && formData.id) {
        const updatePayload: IPlanUpdate = {
          id: formData.id,
          description: formData.description,
          type: formData.type,
          spaces: formData.spaces,
          spacesBusy: formData.spacesBusy,
          spacesAvailable: formData.spacesAvailable,
          value: formData.value.replace(/[R$\s.]/g, "").replace(",", "."),
          cancelValue: formData.cancelValue.replace(/[R$\s.]/g, "").replace(",", "."),
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
        }; 

        const response = await updatePlan(formData.id, updatePayload);
        savedPlan = response.data || updatePayload;
        console.log("Plano atualizado com sucesso!");

      } else {
        const createPayload: IPlanCreate = {
          description: formData.description,
          type: formData.type,
          spaces: formData.spaces,
          spacesBusy: formData.spacesBusy,
          spacesAvailable: formData.spacesAvailable,
          value: formData.value.replace(/[R$\s.]/g, "").replace(",", "."),
          cancelValue: formData.cancelValue.replace(/[R$\s.]/g, "").replace(",", "."),
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
        };

        const response = await createPlan(createPayload);
        savedPlan = response.data || { ...createPayload, id: Date.now() };
        console.log("Plano criado com sucesso!");
      }

      if (onSaveInMemory && savedPlan) {
        onSaveInMemory(savedPlan);
      }

      onClose();
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ paddingBottom: "0px" }}>
        {isEdit ? "Editar Plano" : "Novo Plano"}
      </DialogTitle>
      <DialogContent className="space-y-4" sx={{ padding: "24px 24px 16px 24px" }}>
        <p className="text-gray-500 text-sm">
          Preencha os dados para {isEdit ? "editar o plano" : "criar um novo plano"}.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Descrição</span>
            <TextField
              fullWidth
              value={formData.description}
              placeholder="Digite a descrição do plano"
              size="small"
              sx={customStyles}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <div className="ml-3">
              <FormControlLabel
                control={
                  <IOSSwitch
                    checked={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.checked })
                    }
                  />
                }
                label={
                  <span
                    className={`ml-2 ${
                      formData.status ? "text-[#7ad33e]" : "text-gray-400"
                    }`}
                  >
                    {formData.status ? "Ativo" : "Inativo"}
                  </span>
                }
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Tipo de Veículo</span>
            <TextField
              fullWidth
              select
              value={formData.type}
              size="small"
              sx={customStyles}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "Carro" | "Moto",
                })
              }
            >
              <MenuItem value="Carro">Carro</MenuItem>
              <MenuItem value="Moto">Moto</MenuItem>
            </TextField>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Total de Vagas</span>
            <TextField
              fullWidth
              type="number"
              value={formData.spaces}
              size="small"
              sx={customStyles}
              onChange={(e) =>
                setFormData({ ...formData, spaces: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Valor (R$)</span>
            <TextField
              fullWidth
              type="text"
              value={formData.value}
              onChange={(e) => {
                const input = e.target;
                const rawValue = input.value.replace(/\D/g, '');
                
                const selectionStart = input.selectionStart || 0;
                
                const number = parseFloat(rawValue || '0') / 100;
                const formattedValue = number.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                
                const diff = formattedValue.length - input.value.length;

                setFormData({ ...formData, value: formattedValue });
                
                requestAnimationFrame(() => {
                  input.setSelectionRange(selectionStart + diff, selectionStart + diff);
                });
              }}
              size="small"
              sx={customStyles}
            />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">
              Valor do Cancelamento (R$)
            </span>
            <TextField
              fullWidth
              type="text"
              value={formData.cancelValue}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  cancelValue: FormatCurrency(e.target.value),
                });
              }}
              size="small"
              sx={customStyles}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Início da Validade</span>
            <TextField
              fullWidth
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={customStyles}
            />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Fim da Validade</span>
            <TextField
              fullWidth
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={customStyles}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: "0px 24px 24px 24px" }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="inherit"
          sx={{
            textTransform: "none",
            background: "none",
            boxShadow: "none",
            border: "1px solid #b7bdc7",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: "#7ad33e", textTransform: "none" }}
        >
          {isEdit ? "Salvar" : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanModal;
