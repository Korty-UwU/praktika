import { Router } from 'express';
import { equipment, warehouses, addEquipment, updateEquipment, deleteEquipment } from '../store/store';
import { equipmentSchema } from '../validators/equipmentValidator';
import { randomUUID } from 'crypto';

const router = Router();

// GET все оборудование (с пагинацией, поиском, фильтрацией по складу)
router.get('/', (req, res) => {
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;
  let search = req.query.q as string;
  let warehouseId = req.query.warehouseId as string;

  let filtered = [...equipment];

  // Поиск по тексту
  if (search) {
    filtered = filtered.filter(e => 
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.type && e.type.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Фильтрация по складу
  if (warehouseId) {
    filtered = filtered.filter(e => e.warehouseId === warehouseId);
  }

  // Подтягиваем связанный склад для каждого оборудования
  const itemsWithWarehouse = filtered.map(e => ({
    ...e,
    warehouse: warehouses.find(w => w.id === e.warehouseId)
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
  const item = equipment.find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Оборудование не найдено' });
  res.json({
    ...item,
    warehouse: warehouses.find(w => w.id === item.warehouseId)
  });
});

// POST создание
router.post('/', (req, res) => {
  const result = equipmentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: result.error.issues[0].message });
  }
  // Проверка существования склада
  const warehouse = warehouses.find(w => w.id === result.data.warehouseId);
  if (!warehouse) {
    return res.status(422).json({ error: 'Указанный склад не существует' });
  }
  const newEquipment = {
    id: randomUUID(),
    ...result.data,
  };
  addEquipment(newEquipment);
  res.status(201).json(newEquipment);
});

// PATCH обновление
router.patch('/:id', (req, res) => {
  const item = equipment.find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Оборудование не найдено' });

  const result = equipmentSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({ error: result.error.issues[0].message });
  }
  updateEquipment(req.params.id, result.data);
  res.json({ ...item, ...result.data });
});

// DELETE удаление
router.delete('/:id', (req, res) => {
  const item = equipment.find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Оборудование не найдено' });
  deleteEquipment(req.params.id);
  res.status(204).send();
});

// Поиск отдельный эндпоинт (по заданию)
router.get('/search', (req, res) => {
  const q = req.query.q as string;
  if (!q) return res.json([]);
  const results = equipment.filter(e =>
    e.name.toLowerCase().includes(q.toLowerCase()) ||
    (e.type && e.type.toLowerCase().includes(q.toLowerCase()))
  ).map(e => ({
    ...e,
    warehouse: warehouses.find(w => w.id === e.warehouseId)
  }));
  res.json(results);
});

export default router;