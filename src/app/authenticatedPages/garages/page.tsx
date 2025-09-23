"use client";

import React, { useEffect, useState } from "react";
import { Building2, Eye, AlertCircle } from "lucide-react";
import GarageFilterCard from "@/components/cards/GarageCards";
import { IClients } from "@/types/clients.types";
import GarageDrawer from "@/components/modals/GarageModals/GarageDetailsModal";
import { Pagination, CircularProgress, Alert } from "@mui/material";
import { fetchGarages } from "@/services/clientsService/clients.service";
import { toast } from "react-toastify";

const GaragesPage = () => {
  const [enabled, setEnabled] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGarage, setSelectedGarage] = useState<IClients | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [garages, setGarages] = useState<IClients[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const loadGarages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGarages();
        setGarages(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar garagens';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadGarages();
  }, []);

  const filtered: IClients[] = garages.filter((g) => {
    const isDigitalMonthlyPayer = !enabled || g.digitalMonthlyPayer;
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    return isDigitalMonthlyPayer && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) {
    return (
      <div className="pl-2.5 pr-4 py-2 md:pl-2.5 md:pr-6 md:py-4 flex items-center justify-center min-h-[400px] max-w-full overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <CircularProgress sx={{ color: '#7ad33e' }} />
          <p className="text-gray-600">Carregando garagens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pl-2.5 pr-4 py-2 md:pl-2.5 md:pr-6 md:py-4 max-w-full overflow-hidden">
        <Alert 
          severity="error" 
          icon={<AlertCircle className="w-5 h-5" />}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-[#7ad33e] text-white rounded hover:bg-[#6bc02f] transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="pl-2.5 pr-4 py-2 md:pl-2.5 md:pr-6 md:py-4 space-y-4 md:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 md:w-7 md:h-7 text-[#7ad33e]" />
            Garagens
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Visualize as garagens habilitadas para mensalistas digitais.
          </p>
        </div>
      </div>
      
      <GarageFilterCard
        enabled={enabled}
        setEnabled={setEnabled}
        search={search}
        setSearch={setSearch}
        count={filtered.length}
      />
      
      {/* Tabela de garagens */}
      <div className="bg-white rounded-lg border overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-full table-fixed">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  Código
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-44">
                  Nome
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-52">
                  Endereço
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Cidade/UF
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Regional
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.map((g) => (
                <tr key={g.code} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 truncate">
                    {String(g.code).padStart(6, "0")}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 truncate">
                    {g.name}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 truncate">
                    {g.address}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 truncate">
                    {g.city}/{g.uf}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 truncate">
                    {g.regional}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 text-center">
                    <button
                      onClick={() => {
                        setSelectedGarage(g);
                        setOpenModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-[#7ad33e] transition-colors cursor-pointer rounded-full hover:bg-gray-100"
                      aria-label={`Visualizar detalhes da garagem ${g.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {paginated.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {search ? 'Nenhuma garagem encontrada com o termo pesquisado.' : 'Nenhuma garagem disponível.'}
        </div>
      )}

      {/* Paginação responsiva */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 md:mt-8">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "#f0f0f0",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#7ad33e",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#6bc02f",
                },
              },
            }}
          />
        </div>
      )}
      
      <GarageDrawer
        open={openModal}
        onClose={() => setOpenModal(false)}
        garage={selectedGarage}
      />
    </div>
  );
};

export default GaragesPage;