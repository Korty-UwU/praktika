import { Router } from 'express';
import { warehouses, addWarehouse, updateWarehouse, deleteWarehouse } from '../store/store';
import { warehouseSchema } from '../validators/warehouseValidator';
import { randomUUID } from 'crypto';

const router = Router();

// GET все склады (с пагинацией)
router.get('/', (req, res) => {
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const items = warehouses.slice(start, start + limit);
  res.json({
    items,
    total: warehouses.length,
    page,
    pages: Math.ceil(warehouses.length / limit),
  });
});

// GET один склад
router.get('/:id', (req, res) => {
  const warehouse = warehouses.find(w => w.id === req.params.id);
  if (!warehouse) return res.status(404).json({ error: 'Склад не найден' });
  res.json(warehouse);
});

// POST создание
router.post('/', (req, res) => {
  const result = warehouseSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: result.error.issues[0].message });
  }
  const newWarehouse = {
    id: randomUUID(),
    ...result.data,
  };
  addWarehouse(newWarehouse);
  res.status(201).json(newWarehouse);
});

// PATCH обновление
router.patch('/:id', (req, res) => {
  const warehouse = warehouses.find(w => w.id === req.params.id);
  if (!warehouse) return res.status(404).json({ error: 'Склад не найден' });

  const result = warehouseSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: result.error.issues[0].message });
  }
  updateWarehouse(req.params.id, result.data);
  res.json({ ...warehouse, ...result.data });
});

// DELETE удаление
router.delete('/:id', (req, res) => {
  const warehouse = warehouses.find(w => w.id === req.params.id);
  if (!warehouse) return res.status(404).json({ error: 'Склад не найден' });
  deleteWarehouse(req.params.id);
  res.status(204).send();
});

export default router;