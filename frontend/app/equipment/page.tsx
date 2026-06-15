'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Equipment {
  id: string;
  name: string;
  type?: string;
  price: number;
  isAvailable: boolean;
  warehouseId: string;
  warehouse?: {
    id: string;
    name: string;
  };
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/equipment');
      const data = await response.json();
      setEquipment(data.items);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadEquipment();
      return;
    }
    
    try {
      setSearching(true);
      const response = await fetch(`http://localhost:4000/api/equipment/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setEquipment(data.items);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить оборудование "${name}"?`)) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/equipment/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEquipment(equipment.filter(e => e.id !== id));
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        loadEquipment();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Оборудование</h1>
        <Link href="/equipment/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          + Добавить оборудование
        </Link>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по названию или типу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searching && <p className="text-gray-500 text-sm mt-1">Поиск...</p>}
      </div>

      {equipment.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Оборудование отсутствует</div>
      ) : (
        <div className="grid gap-4">
          {equipment.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  {item.type && <p className="text-gray-600">🔧 Тип: {item.type}</p>}
                  <p className="text-gray-600">💰 Цена: {item.price.toLocaleString()} ₽</p>
                  <p className="text-gray-600">
                    📍 Статус: {item.isAvailable ? '✅ В наличии' : '❌ Недоступен'}
                  </p>
                  {item.warehouse && (
                    <p className="text-gray-600">📦 Склад: {item.warehouse.name}</p>
                  )}
                </div>
                <div className="space-x-2">
                  <Link
                    href={`/equipment/${item.id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
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