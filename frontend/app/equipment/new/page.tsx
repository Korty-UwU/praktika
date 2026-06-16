'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export default function NewEquipmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: 0,
    isAvailable: true,
    warehouseId: '',
  });
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/warehouses');
        if (!response.ok) {
          throw new Error('Не удалось загрузить склады');
        }
        const data = await response.json();
        setWarehouses(data.items || []);
      } catch (error) {
        console.error('Ошибка загрузки складов:', error);
        setError('Не удалось загрузить список складов');
      } finally {
        setLoading(false);
      }
    };

    loadWarehouses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при создании');
      }

      router.push('/equipment');
    } catch (error) {
      console.error('Ошибка создания:', error);
      setError(error instanceof Error ? error.message : 'Ошибка при создании');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">Загрузка складов...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/equipment" className="text-blue-500 hover:underline">
          ← Назад к списку
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">➕ Новое оборудование</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Название *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Введите название оборудования"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Тип
          </label>
          <input
            id="type"
            type="text"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Например: Электрооборудование"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Цена (₽) *
          </label>
          <input
            id="price"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700 mb-1">
            Склад *
          </label>
          <select
            id="warehouseId"
            required
            value={formData.warehouseId}
            onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Выберите склад</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name} {wh.location ? `(${wh.location})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            id="isAvailable"
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
            Доступен для выдачи
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Создание...' : '➕ Создать оборудование'}
          </button>
          <Link
            href="/equipment"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2.5 rounded-lg transition text-center"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}