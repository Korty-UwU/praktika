'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

interface Equipment {
  id: string;
  name: string;
  type: string;
  price: number;
  isAvailable: boolean;
  warehouseId: string;
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export default function EditEquipmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/equipment/${id}`);

      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setError(error instanceof Error ? error.message : 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/warehouses`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при сохранении');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push(`/equipment/${id}`);
      }, 1500);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setError(error instanceof Error ? error.message : 'Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/equipment/${id}`} className="text-blue-500 hover:underline">
          ← Назад к деталям
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">✏️ Редактирование оборудования</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ Оборудование успешно обновлено! Перенаправление...
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
            disabled={saving || success}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Сохранение...' : '💾 Сохранить изменения'}
          </button>
          <Link
            href={`/equipment/${id}`}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2.5 rounded-lg transition text-center"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}