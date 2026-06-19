"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseSchema = void 0;
const zod_1 = require("zod");
exports.warehouseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Название обязательно'),
    location: zod_1.z.string().optional(),
    capacity: zod_1.z.number().min(1, 'Вместимость должна быть больше 0'),
});
