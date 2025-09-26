export interface IClients {
  code: number;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  uf: string,
  regional: string;
  digitalMonthlyPayer: boolean;
  totalParkingSpace: number;
  parkingSpaceBusy: number;
  parkingSpaceAvailable: number;
  plans: IPlans[],
  branch: string;
};

export interface IPlans {
  id: number;
  description: string;
  value: string;
  spaces: number;
  spacesBusy: number;
  spacesAvailable: number;
  status: boolean;
  type?: string;
  cancelValue?: string;
  startDate?: string;
  endDate?: string;
};