'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

interface Equipment {
  id: string;
  name: string;
  type: string;
  price: number;
  isAvailable: boolean;
  warehouseId: string;
}

export default function EquipmentPage() {
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/equipment`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEquipment(data.items || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setError('Не удалось загрузить оборудование. Убедитесь, что бэкенд запущен.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить "${name}"?`)) return;
    
    try {
      setDeletingId(id);
      const response = await fetch(`${API_URL}/api/equipment`);
      
      if (!response.ok) {
        throw new Error('Не удалось удалить оборудование');
      }
      
      setEquipment(equipment.filter(item => item.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить оборудование');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📦 Оборудование</h1>
        <Link
          href="/equipment/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span className="text-xl">+</span> Добавить оборудование
        </Link>
      </div>

      {equipment.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Нет оборудования</p>
          <Link href="/equipment/new" className="text-blue-500 hover:underline mt-2 inline-block">
            Добавить первое оборудование
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-1 truncate">
                  {item.name}
                </h2>
                
                {item.type && (
                  <p className="text-sm text-gray-500 mb-2">
                    📂 {item.type}
                  </p>
                )}

                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {item.price.toLocaleString()} ₽
                </p>

                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    item.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isAvailable ? '✅ Доступен' : '❌ Недоступен'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/equipment/${item.id}`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center font-medium px-3 py-2 rounded-lg transition text-sm"
                  >
                    Подробнее →
                  </Link>
                  <Link
                    href={`/equipment/${item.id}/edit`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-3 py-2 rounded-lg transition text-sm"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    disabled={deletingId === item.id}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-2 rounded-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === item.id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}