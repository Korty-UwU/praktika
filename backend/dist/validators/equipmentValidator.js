"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentSchema = void 0;
const zod_1 = require("zod");
exports.equipmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Название обязательно'),
    type: zod_1.z.string().optional(),
    price: zod_1.z.number().min(0.01, 'Цена должна быть положительной'),
    isAvailable: zod_1.z.boolean(),
    warehouseId: zod_1.z.string().uuid('Некорректный ID склада'),
});
