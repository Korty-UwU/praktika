import { z } from 'zod';

export const warehouseSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  location: z.string().optional(),
  capacity: z.number().min(1, 'Вместимость должна быть больше 0'),
});

export type WarehouseInput = z.infer<typeof warehouseSchema>;