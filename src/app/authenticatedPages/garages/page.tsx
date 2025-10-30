"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Building2, Eye, AlertCircle } from "lucide-react";
import GarageFilterCard from "@/components/cards/GarageCards";
import { IClients } from "@/types/clients.type";
import GarageDrawer from "@/components/modals/GarageModals/GarageDetailsModal";
import { Pagination, CircularProgress, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { setFilters, setPage } from "@/state/slices/garageFilters.slice";
import { fetchGaragesThunk } from "@/state/slices/garages.slice";

const GaragesPage = () => {
  const dispatch = useAppDispatch();
  const q = useAppSelector((s) => s.garageFilters);
  const garagesState = useAppSelector((s) => s.garages);
  const enabled = q.digitalMonthlyPayer ?? true;
  const search = q.search ?? "";
  const [selectedGarage, setSelectedGarage] = useState<IClients | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const pageSize = q.pageSize ?? 10;

  // Inicializa filtros com mensalistas digitais habilitados
  useEffect(() => {
    if (q.digitalMonthlyPayer === undefined) {
      dispatch(setFilters({ digitalMonthlyPayer: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carregar garagens inicialmente apenas uma vez
  useEffect(() => {
    dispatch(fetchGaragesThunk({ search: q.search, digitalMonthlyPayer: q.digitalMonthlyPayer }));
  }, [dispatch, q.search, q.digitalMonthlyPayer]);

  // Handler para mudanças nos filtros
  const handleFiltersChange = useCallback((filters: {
    search?: string;
    digitalMonthlyPayer?: boolean;
  }) => {
    dispatch(setFilters({ search: filters.search, digitalMonthlyPayer: filters.digitalMonthlyPayer }));
  }, [dispatch]);

  // Agora usamos os dados diretamente da API (já filtrados)
  const totalPages = Math.ceil(garagesState.items.length / pageSize);

  const paginated = garagesState.items.slice(
    ((q.page ?? 1) - 1) * pageSize,
    (q.page ?? 1) * pageSize
  );

  if (garagesState.error) {
    return (
      <div className="pl-2.5 pr-4 py-2 md:pl-2.5 md:pr-6 md:py-4 max-w-full overflow-hidden">
        <Alert 
          severity="error" 
          icon={<AlertCircle className="w-5 h-5" />}
          sx={{ mb: 2 }}
        >
          {garagesState.error}
        </Alert>
        <button 
          onClick={() => globalThis.window.location.reload()} 
          className="px-4 py-2 bg-[#7ad33e] text-white rounded hover:bg-[#6bc02f] transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pl-2.5 pr-4 py-2 md:pl-2.5 md:pr-6 md:py-4 space-y-4 md:space-y-6 max-w-full overflow-hidden">
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
        setEnabled={(v: boolean) => dispatch(setFilters({ digitalMonthlyPayer: v }))}
        search={search}
        setSearch={(v: string) => dispatch(setFilters({ search: v }))}
        count={garagesState.items.length}
        onFiltersChange={handleFiltersChange}
      />
      
      {/* Container da tabela com scroll */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white rounded-lg border overflow-hidden w-full flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-full table-fixed">
              <thead className="bg-gray-50 border-b sticky top-0">
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
                {garagesState.status === 'loading' ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <CircularProgress sx={{ color: '#7ad33e' }} />
                        <p className="text-gray-600">Carregando garagens...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((g) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {garagesState.status !== 'loading' && paginated.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {search ? 'Nenhuma garagem encontrada com o termo pesquisado.' : 'Nenhuma garagem disponível.'}
          </div>
        )}

        {/* Paginação responsiva */}
        {garagesState.status !== 'loading' && totalPages > 1 && (
          <div className="flex justify-center mt-6 md:mt-8">
            <Pagination
              count={totalPages}
              page={q.page ?? 1}
              onChange={(_, value) => dispatch(setPage(value))}
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
      </div>
      
      <GarageDrawer
        open={openModal}
        onClose={() => setOpenModal(false)}
        garage={selectedGarage}
      />
    </div>
  );
};

export default GaragesPage;