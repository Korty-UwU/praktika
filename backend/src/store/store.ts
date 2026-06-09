import { Warehouse, Equipment } from '../types';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, 'data.json');

// In-memory массивы
export let warehouses: Warehouse[] = [];
export let equipment: Equipment[] = [];

// Загрузка из JSON при старте
function loadFromFile() {
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    warehouses = data.warehouses || [];
    equipment = data.equipment || [];
  }
}

// Сохранение в JSON после каждой модификации
function saveToFile() {
  fs.writeFileSync(dataPath, JSON.stringify({ warehouses, equipment }, null, 2));
}

// Seed-данные (по 5 штук)
function seedData() {
  if (warehouses.length === 0) {
    warehouses = [
      { id: randomUUID(), name: 'Основной склад', location: 'Москва', capacity: 100 },
      { id: randomUUID(), name: 'Резервный склад', location: 'СПб', capacity: 50 },
      { id: randomUUID(), name: 'Склад запчастей', location: 'Казань', capacity: 30 },
      { id: randomUUID(), name: 'Временное хранение', location: 'Екатеринбург', capacity: 20 },
      { id: randomUUID(), name: 'Логистический центр', location: 'Новосибирск', capacity: 80 },
    ];
  }

  if (equipment.length === 0) {
    equipment = [
      { id: randomUUID(), name: 'Погрузчик', type: 'Спецтехника', price: 500000, isAvailable: true, warehouseId: warehouses[0].id },
      { id: randomUUID(), name: 'Ноутбук', type: 'Офисное', price: 75000, isAvailable: true, warehouseId: warehouses[0].id },
      { id: randomUUID(), name: 'Стеллаж', type: 'Мебель', price: 15000, isAvailable: false, warehouseId: warehouses[1].id },
      { id: randomUUID(), name: 'Генератор', type: 'Электрооборудование', price: 120000, isAvailable: true, warehouseId: warehouses[1].id },
      { id: randomUUID(), name: 'Дрель', type: 'Инструмент', price: 5000, isAvailable: true, warehouseId: warehouses[2].id },
      { id: randomUUID(), name: 'Экскаватор', type: 'Спецтехника', price: 2500000, isAvailable: false, warehouseId: warehouses[3].id },
      { id: randomUUID(), name: 'Принтер', type: 'Офисное', price: 30000, isAvailable: true, warehouseId: warehouses[4].id },
      { id: randomUUID(), name: 'Кондиционер', type: 'Климат', price: 45000, isAvailable: true, warehouseId: warehouses[4].id },
    ];
  }

  saveToFile();
}

// Инициализация хранилища
export function initStore() {
  loadFromFile();
  if (warehouses.length === 0 || equipment.length === 0) {
    seedData();
  }
}

// Обёртки для операций с автосохранением
export function addWarehouse(warehouse: Warehouse) {
  warehouses.push(warehouse);
  saveToFile();
}

export function updateWarehouse(id: string, updates: Partial<Warehouse>) {
  const index = warehouses.findIndex(w => w.id === id);
  if (index !== -1) {
    warehouses[index] = { ...warehouses[index], ...updates };
    saveToFile();
  }
}

export function deleteWarehouse(id: string) {
  warehouses = warehouses.filter(w => w.id !== id);
  // Удаляем всё оборудование этого склада
  equipment = equipment.filter(e => e.warehouseId !== id);
  saveToFile();
}

export function addEquipment(item: Equipment) {
  equipment.push(item);
  saveToFile();
}

export function updateEquipment(id: string, updates: Partial<Equipment>) {
  const index = equipment.findIndex(e => e.id === id);
  if (index !== -1) {
    equipment[index] = { ...equipment[index], ...updates };
    saveToFile();
  }
}

export function deleteEquipment(id: string) {
  equipment = equipment.filter(e => e.id !== id);
  saveToFile();
}