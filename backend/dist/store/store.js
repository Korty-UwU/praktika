"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipment = exports.warehouses = void 0;
exports.initStore = initStore;
exports.addWarehouse = addWarehouse;
exports.updateWarehouse = updateWarehouse;
exports.deleteWarehouse = deleteWarehouse;
exports.addEquipment = addEquipment;
exports.updateEquipment = updateEquipment;
exports.deleteEquipment = deleteEquipment;
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dataPath = path_1.default.join(__dirname, 'data.json');
// In-memory массивы
exports.warehouses = [];
exports.equipment = [];
// Загрузка из JSON при старте
function loadFromFile() {
    if (fs_1.default.existsSync(dataPath)) {
        const data = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
        exports.warehouses = data.warehouses || [];
        exports.equipment = data.equipment || [];
    }
}
// Сохранение в JSON после каждой модификации
function saveToFile() {
    fs_1.default.writeFileSync(dataPath, JSON.stringify({ warehouses: exports.warehouses, equipment: exports.equipment }, null, 2));
}
// Seed-данные (по 5 штук)
function seedData() {
    if (exports.warehouses.length === 0) {
        exports.warehouses = [
            { id: (0, crypto_1.randomUUID)(), name: 'Основной склад', location: 'Москва', capacity: 100 },
            { id: (0, crypto_1.randomUUID)(), name: 'Резервный склад', location: 'СПб', capacity: 50 },
            { id: (0, crypto_1.randomUUID)(), name: 'Склад запчастей', location: 'Казань', capacity: 30 },
            { id: (0, crypto_1.randomUUID)(), name: 'Временное хранение', location: 'Екатеринбург', capacity: 20 },
            { id: (0, crypto_1.randomUUID)(), name: 'Логистический центр', location: 'Новосибирск', capacity: 80 },
        ];
    }
    if (exports.equipment.length === 0) {
        exports.equipment = [
            { id: (0, crypto_1.randomUUID)(), name: 'Погрузчик', type: 'Спецтехника', price: 500000, isAvailable: true, warehouseId: exports.warehouses[0].id },
            { id: (0, crypto_1.randomUUID)(), name: 'Ноутбук', type: 'Офисное', price: 75000, isAvailable: true, warehouseId: exports.warehouses[0].id },
            { id: (0, crypto_1.randomUUID)(), name: 'Стеллаж', type: 'Мебель', price: 15000, isAvailable: false, warehouseId: exports.warehouses[1].id },
            { id: (0, crypto_1.randomUUID)(), name: 'Генератор', type: 'Электрооборудование', price: 120000, isAvailable: true, warehouseId: exports.warehouses[1].id },
            { id: (0, crypto_1.randomUUID)(), name: 'Дрель', type: 'Инструмент', price: 5000, isAvailable: true, warehouseId: exports.warehouses[2].id },
            { id: (0, crypto_1.randomUUID)(), name: 'Экскаватор', type: 'Спецтехника', price: 2500000, isAvailable: false, warehouseId: exports.warehouses[3].id },
            { id: (0, crypto_1.randomUUID)(), name: 'Принтер', type: 'Офисное', price: 30000, isAvailable: true, warehouseId: exports.warehouses[4].id },
            { id: (0, crypto_1.randomUUID)(), name: 'Кондиционер', type: 'Климат', price: 45000, isAvailable: true, warehouseId: exports.warehouses[4].id },
        ];
    }
    saveToFile();
}
// Инициализация хранилища
function initStore() {
    loadFromFile();
    if (exports.warehouses.length === 0 || exports.equipment.length === 0) {
        seedData();
    }
}
// Обёртки для операций с автосохранением
function addWarehouse(warehouse) {
    exports.warehouses.push(warehouse);
    saveToFile();
}
function updateWarehouse(id, updates) {
    const index = exports.warehouses.findIndex(w => w.id === id);
    if (index !== -1) {
        exports.warehouses[index] = { ...exports.warehouses[index], ...updates };
        saveToFile();
    }
}
function deleteWarehouse(id) {
    exports.warehouses = exports.warehouses.filter(w => w.id !== id);
    // Удаляем всё оборудование этого склада
    exports.equipment = exports.equipment.filter(e => e.warehouseId !== id);
    saveToFile();
}
function addEquipment(item) {
    exports.equipment.push(item);
    saveToFile();
}
function updateEquipment(id, updates) {
    const index = exports.equipment.findIndex(e => e.id === id);
    if (index !== -1) {
        exports.equipment[index] = { ...exports.equipment[index], ...updates };
        saveToFile();
    }
}
function deleteEquipment(id) {
    exports.equipment = exports.equipment.filter(e => e.id !== id);
    saveToFile();
}
