"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Building, 
  ArrowLeft, 
  Users, 
  Plus,
  Edit,
  ToggleLeft,
  ToggleRight,
  AlertCircle
} from "lucide-react";
import { 
  CircularProgress, 
  Alert, 
  Button,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import { IClients, IPlans } from "@/types/clients.type";
import { fetchGarageById } from "@/services/clientsService/clients.service";
import GaragePlanModal from "@/components/modals/GarageModals/GaragePlanModal";
import { toast } from "react-toastify";

const GarageManagementPage = () => {
  const params = useParams();
  const router = useRouter();
  const garageId = params.id as string;

  const [garage, setGarage] = useState<IClients | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<IPlans | null>(null);

  const reloadGarageData = async () => {
    try {
      if (garageId) {
        const data = await fetchGarageById(Number(garageId));
        setGarage(data);
        toast.success('Dados da garagem atualizados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao recarregar dados da garagem:', error);
      toast.error('Erro ao recarregar dados da garagem');
    }
  };

  useEffect(() => {
    const loadGarage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGarageById(Number(garageId));
        setGarage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados da garagem');
      } finally {
        setLoading(false);
      }
    };

    if (garageId) {
      loadGarage();
    }
  }, [garageId]);

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setOpenPlanModal(true);
  };

  const handleEditPlan = (plan: IPlans) => {
    setEditingPlan(plan);
    setOpenPlanModal(true);
  };

  const handleTogglePlanStatus = async (planId: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      
      toast.success('Status do plano alterado com sucesso!');
      
      await reloadGarageData();
    } catch (error) {
      console.error('Erro ao alterar status do plano:', error);
      toast.error('Erro ao alterar status do plano');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <CircularProgress sx={{ color: '#7ad33e' }} />
          <p className="text-gray-600">Carregando dados da garagem...</p>
        </div>
      </div>
    );
  }

  if (error || !garage) {
    return (
      <div className="p-6">
        <Alert 
          severity="error" 
          icon={<AlertCircle className="w-5 h-5" />}
          sx={{ mb: 2 }}
        >
          {error || 'Garagem não encontrada'}
        </Alert>
        <Button 
          onClick={() => router.back()} 
          variant="outlined"
          startIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <IconButton 
          onClick={() => router.back()}
          sx={{ 
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#e0e0e0' }
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </IconButton>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Building2 className="w-7 h-7 text-[#7ad33e]" />
            {garage.name}
          </h1>
          <p className="text-sm text-gray-500">
            Código: {String(garage.code).padStart(6, "0")}
          </p>
        </div>
      </div>

      {/* Informações da garagem */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Informações Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Endereço:</span>
              {garage.address}, {garage.neighborhood}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4" />
              <span className="font-medium">Cidade/UF:</span>
              {garage.city} / {garage.uf}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Filial:</span> {garage.branch}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Regional:</span> {garage.regional}
            </p>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-lg border p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total de Vagas</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">{garage.totalParkingSpace}</p>
            </div>
            <Building2 className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Vagas Ocupadas</p>
              <p className="text-xl md:text-2xl font-bold text-orange-600">{garage.parkingSpaceBusy}</p>
            </div>
            <Users className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4 md:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Vagas Disponíveis</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{garage.parkingSpaceAvailable}</p>
            </div>
            <Users className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Planos disponíveis */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 md:p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Planos Disponíveis</h2>
            <Button
              variant="contained"
              startIcon={<Plus className="w-4 h-4" />}
              onClick={handleCreatePlan}
              size="small"
              sx={{
                backgroundColor: '#7ad33e',
                '&:hover': { backgroundColor: '#6bc02f' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              Novo Plano
            </Button>
          </div>
        </div>
        
        {/* Tabela responsiva */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Versão desktop da tabela */}
            <div className="hidden lg:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Descrição</th>
                    <th className="px-6 py-3 text-left font-semibold">Tipo</th>
                    <th className="px-6 py-3 text-left font-semibold">Valor</th>
                    <th className="px-6 py-3 text-left font-semibold">Vagas</th>
                    <th className="px-6 py-3 text-left font-semibold">Ocupadas</th>
                    <th className="px-6 py-3 text-left font-semibold">Disponíveis</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-center font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {garage.plans.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        Nenhum plano cadastrado. Clique em &quot;Novo Plano&quot; para criar o primeiro.
                      </td>
                    </tr>
                  ) : (
                    garage.plans.map((plan) => (
                      <tr key={plan.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {plan.description}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {plan.type || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          R$ {plan.value}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {plan.spaces}
                        </td>
                        <td className="px-6 py-4 text-orange-600 font-medium">
                          {plan.spacesBusy}
                        </td>
                        <td className="px-6 py-4 text-green-600 font-medium">
                          {plan.spacesAvailable}
                        </td>
                        <td className="px-6 py-4">
                          <Chip
                            label={plan.status ? 'Ativo' : 'Inativo'}
                            size="small"
                            color={plan.status ? 'success' : 'default'}
                            variant={plan.status ? 'filled' : 'outlined'}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Tooltip title="Editar plano">
                              <IconButton
                                size="small"
                                onClick={() => handleEditPlan(plan)}
                                sx={{ color: '#7ad33e' }}
                              >
                                <Edit className="w-4 h-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={plan.status ? 'Desativar plano' : 'Ativar plano'}>
                              <IconButton
                                size="small"
                                onClick={() => handleTogglePlanStatus(plan.id, plan.status)}
                                sx={{ color: plan.status ? '#f59e0b' : '#6b7280' }}
                              >
                                {plan.status ? (
                                  <ToggleRight className="w-4 h-4" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Versão mobile/tablet - Cards */}
            <div className="lg:hidden">
              {garage.plans.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Nenhum plano cadastrado. Clique em &quot;Novo Plano&quot; para criar o primeiro.
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {garage.plans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-sm">{plan.description}</h3>
                          <p className="text-xs text-gray-500 mt-1">{plan.type || 'N/A'}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Chip
                            label={plan.status ? 'Ativo' : 'Inativo'}
                            size="small"
                            color={plan.status ? 'success' : 'default'}
                            variant={plan.status ? 'filled' : 'outlined'}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Valor:</span>
                          <p className="font-medium text-gray-800">R$ {plan.value}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Vagas:</span>
                          <p className="font-medium text-gray-800">{plan.spaces}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Ocupadas:</span>
                          <p className="font-medium text-orange-600">{plan.spacesBusy}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Disponíveis:</span>
                          <p className="font-medium text-green-600">{plan.spacesAvailable}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <Tooltip title="Editar plano">
                          <IconButton
                            size="small"
                            onClick={() => handleEditPlan(plan)}
                            sx={{ color: '#7ad33e' }}
                          >
                            <Edit className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={plan.status ? 'Desativar plano' : 'Ativar plano'}>
                          <IconButton
                            size="small"
                            onClick={() => handleTogglePlanStatus(plan.id, plan.status)}
                            sx={{ color: plan.status ? '#f59e0b' : '#6b7280' }}
                          >
                            {plan.status ? (
                              <ToggleRight className="w-4 h-4" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de plano */}
      <GaragePlanModal
        open={openPlanModal}
        onClose={() => {
          setOpenPlanModal(false);
          setEditingPlan(null);
        }}
        plan={editingPlan}
        garageCode={garage?.code}
        onSaveInMemory={reloadGarageData}
      />
    </div>
  );
};

export default GarageManagementPage;