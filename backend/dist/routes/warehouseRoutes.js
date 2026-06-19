"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../store/store");
const warehouseValidator_1 = require("../validators/warehouseValidator");
const crypto_1 = require("crypto");
const router = (0, express_1.Router)();
// GET все склады (с пагинацией)
router.get('/', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const items = store_1.warehouses.slice(start, start + limit);
    res.json({
        items,
        total: store_1.warehouses.length,
        page,
        pages: Math.ceil(store_1.warehouses.length / limit),
    });
});
// GET один склад
router.get('/:id', (req, res) => {
    const warehouse = store_1.warehouses.find(w => w.id === req.params.id);
    if (!warehouse)
        return res.status(404).json({ error: 'Склад не найден' });
    res.json(warehouse);
});
// POST создание
router.post('/', (req, res) => {
    const result = warehouseValidator_1.warehouseSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({ error: result.error.issues[0].message });
    }
    const newWarehouse = {
        id: (0, crypto_1.randomUUID)(),
        ...result.data,
    };
    (0, store_1.addWarehouse)(newWarehouse);
    res.status(201).json(newWarehouse);
});
// PATCH обновление
router.patch('/:id', (req, res) => {
    const warehouse = store_1.warehouses.find(w => w.id === req.params.id);
    if (!warehouse)
        return res.status(404).json({ error: 'Склад не найден' });
    const result = warehouseValidator_1.warehouseSchema.partial().safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({ error: result.error.issues[0].message });
    }
    (0, store_1.updateWarehouse)(req.params.id, result.data);
    res.json({ ...warehouse, ...result.data });
});
// DELETE удаление
router.delete('/:id', (req, res) => {
    const warehouse = store_1.warehouses.find(w => w.id === req.params.id);
    if (!warehouse)
        return res.status(404).json({ error: 'Склад не найден' });
    (0, store_1.deleteWarehouse)(req.params.id);
    res.status(204).send();
});
exports.default = router;
