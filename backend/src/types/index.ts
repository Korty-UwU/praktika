export interface Warehouse {
  id: string;
  name: string;      // обязательное
  location?: string; // опциональное
  capacity: number;  // обязательное
}

export interface Equipment {
  id: string;
  name: string;        // обязательное
  type?: string;       // опциональное
  price: number;       // обязательное
  isAvailable: boolean; // обязательное
  warehouseId: string;  // ссылка на склад
}