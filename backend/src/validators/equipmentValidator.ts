import { z } from 'zod';

export const equipmentSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  type: z.string().optional(),
  price: z.number().min(0.01, 'Цена должна быть положительной'),
  isAvailable: z.boolean(),
  warehouseId: z.string().uuid('Некорректный ID склада'),
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;