"use client";

import React, { useEffect, useState } from "react";
import { Building2, Eye } from "lucide-react";
import GarageFilterCard from "@/components/cards/GarageCards";
import { IClients } from "@/types/clients.types";
import GarageModal from "@/components/modals/GarageModals/GarageDetailsModal";
import { Pagination } from "@mui/material";
import { fetchGarages } from "@/services/clientsService/clients.service";

const GaragesPage = () => {
  const [enabled, setEnabled] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGarage, setSelectedGarage] = useState<IClients | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [garages, setGarages] = useState<IClients[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchGarages().then((data) => setGarages(data));
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <span className="text-[#7ad33e]">
            <Building2 className="w-8 h-8" />
          </span>{" "}
          Garagens
        </h1>
        <p className="text-gray-500">
          Visualize as garagens habilitadas para mensalistas digitais.
        </p>
      </div>
      <GarageFilterCard
        enabled={enabled}
        setEnabled={setEnabled}
        search={search}
        setSearch={setSearch}
        count={filtered.length}
      />
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs">
            <tr>
              <th className="px-4 py-2 font-semibold">Código</th>
              <th className="px-4 py-2 font-semibold">Nome</th>
              <th className="px-4 py-2 font-semibold">Endereço</th>
              <th className="px-4 py-2 font-semibold">Cidade/UF</th>
              <th className="px-4 py-2 font-semibold">Regional</th>
              <th className="px-4 py-2 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((g) => (
              <tr
                key={g.code}
                className="border-t border-gray-200 hover:bg-gray-50 text-xs text-gray-900"
              >
                <td className="px-4 py-2">{String(g.code).padStart(6, "0")}</td>
                <td className="px-4 py-2 uppercase">{g.name}</td>
                <td className="px-4 py-2 uppercase">{g.address}</td>
                <td className="px-4 py-2 uppercase">{g.city} / {g.uf}</td>
                <td className="px-4 py-2">{g.regional}</td>
                <td className="px-4 py-2 flex items-center justify-center">
                  <Eye
                    className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-900"
                    onClick={() => {
                      setSelectedGarage(g);
                      setOpenModal(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
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
      <GarageModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        garage={selectedGarage}
      />
    </div>
  );
};

export default GaragesPage;