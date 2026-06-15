'use client';

import WarehouseForm from '@/app/components/WarehouseForm';

export default function NewWarehousePage() {
  const handleSubmit = async (data: any) => {
    const response = await fetch('http://localhost:4000/api/warehouses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
  };

  return <WarehouseForm onSubmit={handleSubmit} submitLabel="Создать" />;
}