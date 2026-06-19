'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WarehouseFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  submitLabel: string;
}

export default function WarehouseForm({ initialData, onSubmit, submitLabel }: WarehouseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    capacity: initialData?.capacity || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      router.push('/warehouses');
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{submitLabel} склад</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Название <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Расположение</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Вместимость <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          required
          min="1"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Сохранение...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push('/warehouses')}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}