'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

interface Equipment {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

interface Warehouse {
  id: string;
  name: string;
  capacity: number;
}

export default function HomePage() {
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [warehouseCount, setWarehouseCount] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentEquipment, setRecentEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const eqResponse = await fetch(`${API_URL}/api/equipment`);
        const eqData = await eqResponse.json();
        const equipment = eqData.items || [];
        setEquipmentCount(equipment.length);
        setAvailableCount(equipment.filter((e: Equipment) => e.isAvailable).length);
        setRecentEquipment(equipment.slice(0, 5));

        const whResponse = await fetch(`${API_URL}/api/warehouses`);
        const whData = await whResponse.json();
        const warehouses = whData.items || [];
        setWarehouseCount(warehouses.length);
        setTotalCapacity(warehouses.reduce((sum: number, w: Warehouse) => sum + w.capacity, 0));
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500 text-lg">Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секция — ЧЁРНАЯ ПЛАШКА С ЗАКРУГЛЕНИЯМИ */}
      <div className="bg-gray-900 rounded-b-3xl shadow-2xl mx-4 mt-4">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <h1 className="text-5xl font-bold text-white mb-4">📦 Система учёта оборудования</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Управляйте складами и оборудованием в одном месте. 
            Отслеживайте наличие, стоимость и местоположение техники.
          </p>
          <div className="flex gap-4 mt-8">
            <Link
              href="/equipment"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              📋 Оборудование
            </Link>
            <Link
              href="/warehouses"
              className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition shadow-lg"
            >
              🏢 Склады
            </Link>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Всего оборудования</p>
                <p className="text-3xl font-bold text-gray-800">{equipmentCount}</p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Доступно</p>
                <p className="text-3xl font-bold text-green-600">{availableCount}</p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Всего складов</p>
                <p className="text-3xl font-bold text-gray-800">{warehouseCount}</p>
              </div>
              <span className="text-4xl">🏢</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Общая вместимость</p>
                <p className="text-3xl font-bold text-blue-600">{totalCapacity}</p>
              </div>
              <span className="text-4xl">📐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">⚡ Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/equipment/new"
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 hover:bg-blue-100 transition flex items-center gap-4 group"
          >
            <span className="text-3xl group-hover:scale-110 transition">➕</span>
            <div>
              <p className="font-semibold text-gray-800">Добавить оборудование</p>
              <p className="text-sm text-gray-500">Создать новую единицу техники</p>
            </div>
          </Link>
          <Link
            href="/warehouses/new"
            className="bg-green-50 border-2 border-green-200 rounded-xl p-6 hover:bg-green-100 transition flex items-center gap-4 group"
          >
            <span className="text-3xl group-hover:scale-110 transition">🏗️</span>
            <div>
              <p className="font-semibold text-gray-800">Добавить склад</p>
              <p className="text-sm text-gray-500">Создать новое место хранения</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Последнее оборудование */}
      {recentEquipment.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🆕 Последнее оборудование</h2>
            <Link href="/equipment" className="text-blue-500 hover:underline">
              Смотреть все →
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-100">
              {recentEquipment.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price.toLocaleString()} ₽</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isAvailable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.isAvailable ? '✅ Доступен' : '❌ Недоступен'}
                    </span>
                    <Link
                      href={`/equipment/${item.id}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Подробнее →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}