import { ReactNode } from "react";
import { IPlans } from "./clients.types";

export interface IGarageFilterCardProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  search: string;
  setSearch: (value: string) => void;
  count: number;
};

export interface IGarageInfoCard {
  label: string;
  value: number;
  icon: ReactNode;
  color?: string;
};

export interface IGarageIndoOneCard {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconColor?: string;
  valueColor?: string;
};

export interface IGarageInfoSection {
  totalSpaces: number;
  occupiedSpaces: number;
  availableSpaces: number;
  qrCodeValue: string;
};

export interface IGaragePlansProps {
  data: IPlans[];
};