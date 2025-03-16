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
