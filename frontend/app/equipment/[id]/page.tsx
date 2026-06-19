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
  warehouse?: {
    id: string;
    name: string;
    location: string;
    capacity: number;
  };
}

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/equipment/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Оборудование не найдено');
        }
        throw new Error(`Ошибка: ${response.status}`);
      }
      
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setError(error instanceof Error ? error.message : 'Не удалось загрузить оборудование');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить это оборудование?')) return;
    
    try {
      setDeleting(true);
      const response = await fetch(`${API_URL}/api/equipment/${id}`);
      
      if (!response.ok) {
        throw new Error('Не удалось удалить оборудование');
      }
      
      router.push('/equipment');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert(error instanceof Error ? error.message : 'Ошибка при удалении');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadEquipment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">Загрузка...</div>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка</h1>
        <p className="text-gray-600">{error || 'Оборудование не найдено'}</p>
        <Link href="/equipment" className="mt-4 inline-block text-blue-500 hover:underline">
          ← Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/equipment" className="text-blue-500 hover:underline">
          ← Назад к списку
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{equipment.name}</h1>
          <div className="space-x-2">
            <Link
              href={`/equipment/${id}/edit`}
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
            <span className="font-semibold">Тип:</span>
            <span className="ml-2 text-gray-600">{equipment.type || 'Не указан'}</span>
          </div>
          
          <div>
            <span className="font-semibold">Цена:</span>
            <span className="ml-2 text-gray-600">{equipment.price.toLocaleString()} ₽</span>
          </div>
          
          <div>
            <span className="font-semibold">Статус:</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              equipment.isAvailable 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {equipment.isAvailable ? '✅ Доступен' : '❌ Недоступен'}
            </span>
          </div>

          <div>
            <span className="font-semibold">Склад:</span>
            <Link 
              href={`/warehouses/${equipment.warehouseId}`}
              className="ml-2 text-blue-500 hover:underline"
            >
              {equipment.warehouse?.name || equipment.warehouseId || 'Не указан'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}