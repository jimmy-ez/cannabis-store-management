import { Timestamp } from "firebase/firestore";

export interface ICannabis {
  type: "indica" | "sativa" | "hybrid";
  thc: number;
  cbd: number;
  feeling: string;
  taste: string;
}

export interface IProduct {
  id?: string;
  shopId: string;
  name: string;
  detail: string;
  cost: number;
  price: number;
  localPrice?: number;
  stock: number;
  isActive: boolean;
  isStrain: boolean;
  cannabis?: ICannabis;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderProduct {
  product: {
    id: string;
    name: string;
  }
  quantity: number;
  total: number;
}

export interface IOrder {
  id?: string;
  shopId: string;
  sellerId: string;
  customerName: string;
  products: IOrderProduct[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  note?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}
