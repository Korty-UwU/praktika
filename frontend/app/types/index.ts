export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  capacity: number;
}

export interface Equipment {
  id: string;
  name: string;
  type?: string;
  price: number;
  isAvailable: boolean;
  warehouseId: string;
  warehouse?: Warehouse; // для вложенных данных
}