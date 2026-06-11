const API_URL = 'http://localhost:4000/api';

// Warehouses API
export const warehousesApi = {
  getAll: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}/warehouses?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Ошибка загрузки');
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/warehouses/${id}`);
    if (!response.ok) throw new Error('Склад не найден');
    return response.json();
  },
  
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/warehouses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    return response.json();
  },
  
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/warehouses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/warehouses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
  },
};

// Equipment API
export const equipmentApi = {
  getAll: async (page = 1, limit = 10, warehouseId?: string) => {
    let url = `${API_URL}/equipment?page=${page}&limit=${limit}`;
    if (warehouseId) url += `&warehouseId=${warehouseId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Ошибка загрузки');
    return response.json();
  },
  
  search: async (query: string) => {
    const response = await fetch(`${API_URL}/equipment/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Ошибка поиска');
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/equipment/${id}`);
    if (!response.ok) throw new Error('Оборудование не найдено');
    return response.json();
  },
  
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    return response.json();
  },
  
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/equipment/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/equipment/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
  },
};