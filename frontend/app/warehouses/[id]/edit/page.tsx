'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WarehouseForm from '@/app/components/WarehouseForm';

export default function EditWarehousePage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/warehouses/${id}`)
      .then(res => res.json())
      .then(data => {
        setInitialData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (data: any) => {
    const response = await fetch(`http://localhost:4000/api/warehouses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    router.push('/warehouses');
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (!initialData) return <div className="text-center py-10">Склад не найден</div>;

  return <WarehouseForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Сохранить" />;
}