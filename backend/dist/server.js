"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const store_1 = require("./store/store");
const warehouseRoutes_1 = __importDefault(require("./routes/warehouseRoutes"));
const equipmentRoutes_1 = __importDefault(require("./routes/equipmentRoutes"));
const app = (0, express_1.default)();
const PORT = 4000;
// Middleware
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
app.use(express_1.default.json());
// Инициализация хранилища
(0, store_1.initStore)();
// Роуты
app.use('/api/warehouses', warehouseRoutes_1.default);
app.use('/api/equipment', equipmentRoutes_1.default);
// Обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
