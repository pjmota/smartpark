"use client";

import React, { useState, useEffect } from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { DollarSign, Tag, Settings, Car, SquarePen, Plus } from "lucide-react";
import { IPlans } from "@/types/clients.types";
import PlanModal from "../../../modals/GarageModals/GaragePlanModal";
import { IGaragePlansProps } from "@/types/garage.types";

const GaragePlans = ({ data, onUpdatePlans }: IGaragePlansProps) => {
  const [activeTab, setActiveTab] = useState<"planos" | "descontos" | "config">("planos");

  const [openModal, setOpenModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<IPlans | null>(null);

  const [temporaryPlans, setTemporaryPlans] = useState<IPlans[]>([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setTemporaryPlans(data);
    } else if (data) {
      setTemporaryPlans([data]);
    } else {
      setTemporaryPlans([]);
    }
  }, [data]);

  const handleNewPlan = () => {
    setEditingPlan(null);
    setOpenModal(true);
  };

  const handleEditPlan = (plan: IPlans) => {
    setEditingPlan(plan);
    setOpenModal(true);
  };

  const handleUpdatePlanInMemory = (updatedPlan: IPlans) => {
    const updatedPlans = temporaryPlans.find((p) => p.id === updatedPlan.id)
      ? temporaryPlans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
      : [...temporaryPlans, updatedPlan];
    
    setTemporaryPlans(updatedPlans);
    
    // Notificar o componente pai (GarageDetailModal) sobre as alterações
    if (onUpdatePlans) {
      onUpdatePlans(updatedPlans);
    }
  };

  return (
    <div className="flex gap-4 border border-gray-300 rounded-lg">
      <div className="w-1/6 border-r border-gray-300">
        <div className="flex flex-col">
          <button
            onClick={() => setActiveTab("planos")}
            className={`relative flex items-center gap-2 p-3 font-medium text-sm cursor-pointer ${
              activeTab === "planos" ? "text-black bg-white" : "text-gray-600 bg-[#ebebeb]"
            }`}
          >
            {activeTab === "planos" && (
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#7ad33e] rounded-tl-md" />
            )}
            <DollarSign className="w-4 h-4 text-gray-500" /> Planos
          </button>
          <button
            onClick={() => setActiveTab("descontos")}
            className={`relative flex items-center gap-2 p-3 font-medium text-sm cursor-pointer ${
              activeTab === "descontos" ? "text-black bg-white" : "text-gray-600 bg-[#ebebeb]"
            }`}
          >
            {activeTab === "descontos" && (
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#7ad33e]" />
            )}
            <Tag className="w-4 h-4 text-gray-500" /> Descontos
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`relative flex items-center gap-2 p-3 font-medium text-sm cursor-pointer ${
              activeTab === "config" ? "text-black bg-white" : "text-gray-600 bg-[#ebebeb]"
            }`}
          >
            {activeTab === "config" && (
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#7ad33e] rounded-bl-md" />
            )}
            <Settings className="w-4 h-4 text-gray-500" /> Configurações
          </button>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        {activeTab === "planos" && (
          <>
            <div className="flex justify-between items-center mb-1 h-12">
              <h3 className="font-medium text-gray-950 text-sm">Planos Disponíveis</h3>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  marginRight: "1rem",
                  borderColor: "#7ad33e",
                  color: "#7ad33e",
                  textTransform: "none",
                }}
                onClick={handleNewPlan}
              >
                <Plus className="w-4 h-4 mr-2" /> Novo Plano
              </Button>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden mr-4">
              <Table size="small">
                <TableHead>
                  <TableRow className="bg-white">
                    <TableCell align="center">Descrição</TableCell>
                    <TableCell align="center">Valor</TableCell>
                    <TableCell align="center">Vagas</TableCell>
                    <TableCell align="center">Ocupadas</TableCell>
                    <TableCell align="center">Disponíveis</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {temporaryPlans.map((d) => (
                    <TableRow
                      key={d.id}
                      className="bg-[#ebebeb]"
                      sx={{ "& td": { color: "#9CA3AF" } }}
                    >
                      <TableCell align="center">
                        <div className="flex items-center justify-center gap-2">
                          <Car className="w-4 h-4" /> {d.description}
                        </div>
                      </TableCell>
                      <TableCell align="center">R$ {d.value}</TableCell>
                      <TableCell align="center">{d.spaces}</TableCell>
                      <TableCell align="center">{d.spacesBusy}</TableCell>
                      <TableCell align="center">{d.spacesAvailable}</TableCell>
                      <TableCell align="center">
                        <span
                          className={`
                            px-2 py-1 text-xs rounded-full border
                            ${d.status === true
                              ? "border-[#7ad33e] text-[#7ad33e]"
                              : "border-gray-300 text-gray-600"}
                          `}
                        >
                          {d.status === true ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ border: "none", minWidth: "auto", p: 0 }}
                          onClick={() => handleEditPlan(d)}
                        >
                          <SquarePen className="w-4 h-4 text-gray-950" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {activeTab === "descontos" && (
          <div className="p-4 text-gray-600">📉 Área de descontos (conteúdo futuro)</div>
        )}

        {activeTab === "config" && (
          <div className="p-4 text-gray-600">⚙️ Configurações da garagem (conteúdo futuro)</div>
        )}
      </div>
      <PlanModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        plan={editingPlan}
        onSaveInMemory={handleUpdatePlanInMemory}
      />
    </div>
  );
};

export default GaragePlans;