'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment?: Array<{
    id: string;
    name: string;
    type: string;
    price: number;
    isAvailable: boolean;
  }>;
}

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadWarehouse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/warehouses/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Склад не найден');
        }
        throw new Error(`Ошибка: ${response.status}`);
      }
      
      const data = await response.json();
      setWarehouse(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setError(error instanceof Error ? error.message : 'Не удалось загрузить склад');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот склад?')) return;
    
    try {
      setDeleting(true);
      const response = await fetch(`${API_URL}/api/warehouses/${id}`);
      
      if (!response.ok) {
        throw new Error('Не удалось удалить склад');
      }
      
      router.push('/warehouses');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert(error instanceof Error ? error.message : 'Ошибка при удалении');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadWarehouse();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">Загрузка...</div>
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка</h1>
        <p className="text-gray-600">{error || 'Склад не найден'}</p>
        <Link href="/warehouses" className="mt-4 inline-block text-blue-500 hover:underline">
          ← Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/warehouses" className="text-blue-500 hover:underline">
          ← Назад к списку
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{warehouse.name}</h1>
          <div className="space-x-2">
            <Link
              href={`/warehouses/${id}/edit`}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              ✏️ Редактировать
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              {deleting ? 'Удаление...' : '🗑️ Удалить'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className="font-semibold">Местоположение:</span>
            <span className="ml-2 text-gray-600">{warehouse.location || 'Не указано'}</span>
          </div>
          
          <div>
            <span className="font-semibold">Вместимость:</span>
            <span className="ml-2 text-gray-600">{warehouse.capacity} единиц</span>
          </div>

          {warehouse.equipment && warehouse.equipment.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-3">📦 Оборудование на складе</h2>
              <div className="space-y-2">
                {warehouse.equipment.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({item.type || 'Без типа'})</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">{item.price.toLocaleString()} ₽</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                        item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.isAvailable ? 'Доступен' : 'Недоступен'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}