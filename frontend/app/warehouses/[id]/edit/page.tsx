'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditWarehousePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadWarehouse = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:4000/api/warehouses/${id}`);
        if (!response.ok) {
          throw new Error('Склад не найден');
        }
        const data = await response.json();
        
        setFormData({
          name: data.name || '',
          location: data.location || '',
          capacity: data.capacity || 0,
        });
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setError(error instanceof Error ? error.message : 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadWarehouse();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:4000/api/warehouses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при сохранении');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push(`/warehouses/${id}`);
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
        <Link href={`/warehouses/${id}`} className="text-blue-500 hover:underline">
          ← Назад к деталям
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">✏️ Редактирование склада</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ Склад успешно обновлён! Перенаправление...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Название склада *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Введите название склада"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Местоположение
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Например: г. Москва, ул. Ленина, 1"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
            Вместимость (ед.) *
          </label>
          <input
            id="capacity"
            type="number"
            required
            min="0"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="0"
          />
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
            href={`/warehouses/${id}`}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2.5 rounded-lg transition text-center"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}