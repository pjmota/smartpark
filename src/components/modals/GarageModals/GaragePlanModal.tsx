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
import FormatCurrency from "@/utils/formatCurrency";
import { disableBodyScroll, enableBodyScroll } from "@/utils/modalUtils";
import { createPlan, updatePlan } from "@/services/planServices/plans.service";
import { IPlans } from "@/types/clients.types";
import { logger } from "@/lib/logger";
import { toast } from "react-toastify";

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

  const [errors, setErrors] = useState<{
    description?: string;
    spaces?: string;
    value?: string;
    cancelValue?: string;
    startDate?: string;
    endDate?: string;
  }>({});



  // Funções auxiliares de validação para reduzir complexidade cognitiva
  const validateDescription = (description: string): string | undefined => {
    if (!description.trim()) {
      return "Descrição é obrigatória";
    }
    if (description.trim().length < 3) {
      return "Descrição deve ter pelo menos 3 caracteres";
    }
    return undefined;
  };

  const validateSpaces = (spaces: number): string | undefined => {
    if (!spaces || spaces < 1) {
      return "Número de vagas deve ser maior que 0";
    }
    if (spaces > 1000) {
      return "Número de vagas não pode exceder 1000";
    }
    return undefined;
  };

  const validateMonetaryValue = (value: string, fieldName: string): string | undefined => {
    const valueNumber = parseFloat(value.replace(/[R$\s.]/g, "").replace(",", "."));
    if (!value || valueNumber <= 0) {
      return `${fieldName} deve ser maior que R$ 0,00`;
    }
    if (valueNumber > 99999.99) {
      return `${fieldName} não pode exceder R$ 99.999,99`;
    }
    return undefined;
  };

  const validateDates = (startDate: string, endDate: string, isEdit: boolean): { startDate?: string; endDate?: string } => {
    const dateErrors: { startDate?: string; endDate?: string } = {};

    if (!startDate) {
      dateErrors.startDate = "Data de início é obrigatória";
    }

    if (!endDate) {
      dateErrors.endDate = "Data de fim é obrigatória";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        dateErrors.endDate = "Data de fim deve ser posterior à data de início";
      }

      if (!isEdit) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (start < today) {
          dateErrors.startDate = "Data de início não pode ser no passado";
        }
      }
    }

    return dateErrors;
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validação da descrição
    const descriptionError = validateDescription(formData.description);
    if (descriptionError) {
      newErrors.description = descriptionError;
    }

    // Validação do número de vagas
    const spacesError = validateSpaces(formData.spaces);
    if (spacesError) {
      newErrors.spaces = spacesError;
    }

    // Validação do valor
    const valueError = validateMonetaryValue(formData.value, "Valor");
    if (valueError) {
      newErrors.value = valueError;
    }

    // Validação do valor de cancelamento
    const cancelValueError = validateMonetaryValue(formData.cancelValue, "Valor de cancelamento");
    if (cancelValueError) {
      newErrors.cancelValue = cancelValueError;
    }

    // Validação das datas
    const dateErrors = validateDates(formData.startDate, formData.endDate, isEdit);
    Object.assign(newErrors, dateErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (open) {
      // Limpar estados de erro quando o modal é aberto
      setErrors({});
      
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

  // Controle de acessibilidade do modal
  useEffect(() => {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const parts = dateString.split("/");
    if (parts.length !== 3) return "";
    
    const [day, month, year] = parts;
    
    // Verificar se day, month e year existem antes de usar padStart
    if (!day || !month || !year) return "";
    
    // Garantir que dia e mês tenham sempre 2 dígitos
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  // Função auxiliar para processar valores monetários
  const processMonetaryValue = (value: string): string => {
    return value.replace(/[R$\s.]/g, "").replace(",", ".");
  };

  // Função auxiliar para criar payload de atualização
  const createUpdatePayload = (): IPlanUpdate => ({
    id: formData.id!,
    description: formData.description,
    type: formData.type,
    spaces: formData.spaces,
    spacesBusy: formData.spacesBusy,
    spacesAvailable: formData.spacesAvailable,
    value: processMonetaryValue(formData.value),
    cancelValue: processMonetaryValue(formData.cancelValue),
    startDate: formData.startDate,
    endDate: formData.endDate,
    status: formData.status,
  });

  // Função auxiliar para criar payload de criação
  const createNewPayload = (): IPlanCreate => ({
    description: formData.description,
    type: formData.type,
    spaces: formData.spaces,
    spacesBusy: formData.spacesBusy,
    spacesAvailable: formData.spacesAvailable,
    value: processMonetaryValue(formData.value),
    cancelValue: processMonetaryValue(formData.cancelValue),
    startDate: formData.startDate,
    endDate: formData.endDate,
    status: formData.status,
  });

  // Função auxiliar para criar plano temporário
  const createTempPlan = (): IPlans => ({
    id: formData.id || Date.now(),
    description: formData.description,
    type: formData.type,
    spaces: formData.spaces,
    spacesBusy: formData.spacesBusy,
    spacesAvailable: formData.spacesAvailable,
    value: processMonetaryValue(formData.value),
    cancelValue: processMonetaryValue(formData.cancelValue),
    startDate: formData.startDate,
    endDate: formData.endDate,
    status: formData.status,
  });

  // Função auxiliar para determinar mensagem de erro
  const getErrorMessage = (error: Error): string => {
    if (error.message.includes('Network Error') || 
        error.message.includes('ERR_NETWORK') ||
        error.message.includes('fetch') ||
        !navigator.onLine) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    }
    
    if (error.message.includes('timeout')) {
      return 'Tempo limite excedido. Tente novamente.';
    }
    
    if (error.name === 'AxiosError' || error.message.includes('Request failed')) {
      return 'Erro de comunicação com o servidor.';
    }
    
    return 'Ocorreu um erro inesperado. Tente novamente.';
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let savedPlan: IPlans;

      if (isEdit && formData.id) {
        const updatePayload = createUpdatePayload();
        const response = await updatePlan(formData.id, updatePayload);
        savedPlan = response.data || updatePayload;
        toast.success('Plano atualizado com sucesso!');
        logger.info("Plano atualizado com sucesso", { planId: formData.id });
      } else {
        const createPayload = createNewPayload();
        const response = await createPlan(createPayload);
        savedPlan = response.data || { ...createPayload, id: Date.now() };
        toast.success('Plano criado com sucesso!');
        logger.info("Plano criado com sucesso", { planData: createPayload });
      }

      if (onSaveInMemory && savedPlan) {
        onSaveInMemory(savedPlan);
      }

      onClose();

    } catch (error) {
      logger.error("Erro ao salvar plano", { error, formData });
      
      const tempPlan = createTempPlan();
      if (onSaveInMemory) {
        onSaveInMemory(tempPlan);
      }

      const errorMessage = error instanceof Error 
        ? getErrorMessage(error)
        : 'Erro desconhecido. Tente novamente.';

      toast.error(errorMessage);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      hideBackdrop={false}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      disableRestoreFocus={false}
      slotProps={{
        paper: {
          'aria-modal': true,
          role: 'dialog',
        }
      }}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiDialog-paper': {
            margin: '32px',
            position: 'relative',
            zIndex: 1400, // Maior que o Drawer (1200)
          }
        }
      }}
    >
      <DialogTitle sx={{ paddingBottom: "0px" }}>
        {isEdit ? "Editar Plano" : "Novo Plano"}
      </DialogTitle>
      <DialogContent className="space-y-4" sx={{ padding: "24px 24px 16px 24px" }}>
        <p className="text-gray-500 text-sm">
          Preencha os dados para {isEdit ? "editar o plano" : "criar um novo plano"}.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Descrição *</span>
            <TextField
              fullWidth
              value={formData.description}
              placeholder="Digite a descrição do plano"
              size="small"
              error={!!errors.description}
              helperText={errors.description}
              sx={customStyles}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: undefined });
                }
              }}
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
            <span className="text-sm font-medium text-gray-700">Total de Vagas *</span>
            <TextField
              fullWidth
              type="number"
              value={formData.spaces}
              size="small"
              error={!!errors.spaces}
              helperText={errors.spaces}
              sx={customStyles}
              onChange={(e) => {
                const value = Number(e.target.value);
                setFormData({ ...formData, spaces: value });
                if (errors.spaces) {
                  setErrors({ ...errors, spaces: undefined });
                }
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Valor (R$) *</span>
            <TextField
              fullWidth
              type="text"
              value={formData.value}
              error={!!errors.value}
              helperText={errors.value}
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
                
                if (errors.value) {
                  setErrors({ ...errors, value: undefined });
                }
                
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
            <span className="text-sm font-medium text-gray-700">Início da Validade *</span>
            <TextField
              fullWidth
              type="date"
              value={formData.startDate}
              error={!!errors.startDate}
              helperText={errors.startDate}
              onChange={(e) => {
                setFormData({ ...formData, startDate: e.target.value });
                if (errors.startDate) {
                  setErrors({ ...errors, startDate: undefined });
                }
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              size="small"
              sx={customStyles}
            />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Fim da Validade *</span>
            <TextField
              fullWidth
              type="date"
              value={formData.endDate}
              error={!!errors.endDate}
              helperText={errors.endDate}
              onChange={(e) => {
                setFormData({ ...formData, endDate: e.target.value });
                if (errors.endDate) {
                  setErrors({ ...errors, endDate: undefined });
                }
              }}
              slotProps={{ inputLabel: { shrink: true } }}
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
