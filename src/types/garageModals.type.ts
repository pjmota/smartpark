import { IClients, IPlans } from "./clients.type";


export interface IGarageModalProps {
  open: boolean;
  onClose: () => void;
  garage: IClients | null;
};

export interface IPlanModalProps {
  open: boolean;
  onClose: () => void;
  plan: IPlans | null;
};