'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Warehouse {
  id: string;
  name: string;
  location?: string;
  capacity: number;
}

interface Equipment {
  id: string;
  name: string;
  type?: string;
  price: number;
  isAvailable: boolean;
}

export default function WarehouseDetailPage() {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем склад
        const warehouseRes = await fetch(`http://localhost:4000/api/warehouses/${id}`);
        const warehouseData = await warehouseRes.json();
        setWarehouse(warehouseData);

        // Загружаем оборудование на складе
        const equipmentRes = await fetch(`http://localhost:4000/api/equipment?warehouseId=${id}`);
        const equipmentData = await equipmentRes.json();
        setEquipment(equipmentData.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (!warehouse) return <div className="text-center py-10">Склад не найден</div>;

  return (
    <div>
      <div className="mb-6">
        <Link href="/warehouses" className="text-blue-500 hover:underline">
          ← Назад к списку
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">{warehouse.name}</h1>
        {warehouse.location && (
          <p className="text-gray-600 mb-2">📍 {warehouse.location}</p>
        )}
        <p className="text-gray-600 mb-4">📦 Вместимость: {warehouse.capacity} ед.</p>
        
        <Link
          href={`/warehouses/${warehouse.id}/edit`}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 inline-block"
        >
          Редактировать
        </Link>

        <h2 className="text-xl font-semibold mt-6 mb-4">Оборудование на складе</h2>
        {equipment.length === 0 ? (
          <p className="text-gray-500">На этом складе пока нет оборудования</p>
        ) : (
          <div className="grid gap-3">
            {equipment.map((item) => (
              <div key={item.id} className="border rounded p-3">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-600">
                  Тип: {item.type || 'Не указан'} | Цена: {item.price.toLocaleString()} ₽
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}