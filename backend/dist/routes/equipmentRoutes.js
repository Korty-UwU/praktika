"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../store/store");
const equipmentValidator_1 = require("../validators/equipmentValidator");
const crypto_1 = require("crypto");
const router = (0, express_1.Router)();
// GET все оборудование (с пагинацией, поиском, фильтрацией по складу)
router.get('/', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.q;
    let warehouseId = req.query.warehouseId;
    let filtered = [...store_1.equipment];
    // Поиск по тексту
    if (search) {
        filtered = filtered.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) ||
            (e.type && e.type.toLowerCase().includes(search.toLowerCase())));
    }
    // Фильтрация по складу
    if (warehouseId) {
        filtered = filtered.filter(e => e.warehouseId === warehouseId);
    }
    // Подтягиваем связанный склад для каждого оборудования
    const itemsWithWarehouse = filtered.map(e => ({
        ...e,
        warehouse: store_1.warehouses.find(w => w.id === e.warehouseId)
    }));
    const start = (page - 1) * limit;
    const items = itemsWithWarehouse.slice(start, start + limit);
    res.json({
        items,
        total: filtered.length,
        page,
        pages: Math.ceil(filtered.length / limit),
    });
});
// GET одно оборудование
router.get('/:id', (req, res) => {
    const item = store_1.equipment.find(e => e.id === req.params.id);
    if (!item)
        return res.status(404).json({ error: 'Оборудование не найдено' });
    res.json({
        ...item,
        warehouse: store_1.warehouses.find(w => w.id === item.warehouseId)
    });
});
// POST создание
router.post('/', (req, res) => {
    const result = equipmentValidator_1.equipmentSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({ error: result.error.issues[0].message });
    }
    // Проверка существования склада
    const warehouse = store_1.warehouses.find(w => w.id === result.data.warehouseId);
    if (!warehouse) {
        return res.status(422).json({ error: 'Указанный склад не существует' });
    }
    const newEquipment = {
        id: (0, crypto_1.randomUUID)(),
        ...result.data,
    };
    (0, store_1.addEquipment)(newEquipment);
    res.status(201).json(newEquipment);
});
// PATCH обновление
router.patch('/:id', (req, res) => {
    const item = store_1.equipment.find(e => e.id === req.params.id);
    if (!item)
        return res.status(404).json({ error: 'Оборудование не найдено' });
    const result = equipmentValidator_1.equipmentSchema.partial().safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({ error: result.error.issues[0].message });
    }
    (0, store_1.updateEquipment)(req.params.id, result.data);
    res.json({ ...item, ...result.data });
});
// DELETE удаление
router.delete('/:id', (req, res) => {
    const item = store_1.equipment.find(e => e.id === req.params.id);
    if (!item)
        return res.status(404).json({ error: 'Оборудование не найдено' });
    (0, store_1.deleteEquipment)(req.params.id);
    res.status(204).send();
});
// Поиск отдельный эндпоинт (по заданию)
router.get('/search', (req, res) => {
    const q = req.query.q;
    if (!q)
        return res.json([]);
    const results = store_1.equipment.filter(e => e.name.toLowerCase().includes(q.toLowerCase()) ||
        (e.type && e.type.toLowerCase().includes(q.toLowerCase()))).map(e => ({
        ...e,
        warehouse: store_1.warehouses.find(w => w.id === e.warehouseId)
    }));
    res.json(results);
});
exports.default = router;
