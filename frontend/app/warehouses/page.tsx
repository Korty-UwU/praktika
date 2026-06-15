'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Warehouse {
  id: string;
  name: string;
  location?: string;
  capacity: number;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/warehouses')
      .then(res => res.json())
      .then(data => {
        setWarehouses(data.items);
        setLoading(false);
      })
      .catch(err => {
        setError('Ошибка подключения к серверу');
        setLoading(false);
        console.error(err);
      });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить склад "${name}"?`)) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/warehouses/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setWarehouses(warehouses.filter(w => w.id !== id));
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Склады</h1>
        <Link href="/warehouses/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          + Добавить склад
        </Link>
      </div>

      {warehouses.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Склады отсутствуют</div>
      ) : (
        <div className="grid gap-4">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{warehouse.name}</h2>
                  {warehouse.location && <p className="text-gray-600">📍 {warehouse.location}</p>}
                  <p className="text-gray-600">📦 Вместимость: {warehouse.capacity} ед.</p>
                </div>
                <div className="space-x-2">
                  <Link
                    href={`/warehouses/${warehouse.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Подробнее
                  </Link>
                  <Link
                    href={`/warehouses/${warehouse.id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => handleDelete(warehouse.id, warehouse.name)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Удалить
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