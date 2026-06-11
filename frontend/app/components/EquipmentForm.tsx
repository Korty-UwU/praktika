'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Equipment, Warehouse } from '../types';
import { getWarehouses } from '../lib/api';

interface EquipmentFormProps {
  initialData?: Equipment;
  onSubmit: (data: Partial<Equipment>) => Promise<void>;
  submitLabel: string;
}

export default function EquipmentForm({ initialData, onSubmit, submitLabel }: EquipmentFormProps) {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    price: initialData?.price || 0,
    isAvailable: initialData?.isAvailable ?? true,
    warehouseId: initialData?.warehouseId || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getWarehouses(1, 100).then(data => setWarehouses(data.items));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        name: formData.name,
        type: formData.type || undefined,
        price: Number(formData.price),
        isAvailable: formData.isAvailable,
        warehouseId: formData.warehouseId,
      });
      router.push('/equipment');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Название оборудования <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Тип оборудования</label>
        <input
          type="text"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Цена (₽) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          required
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Статус
        </label>
        <select
          value={formData.isAvailable ? 'true' : 'false'}
          onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="true">В наличии</option>
          <option value="false">Нет в наличии</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Склад <span className="text-red-500">*</span>
        </label>
        <select
          required
          value={formData.warehouseId}
          onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Выберите склад</option>
          {warehouses.map(w => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Сохранение...' : submitLabel}
      </button>
    </form>
  );
}