import express from 'express';
import cors from 'cors';
import { initStore } from './store/store';
import warehouseRoutes from './routes/warehouseRoutes';
import equipmentRoutes from './routes/equipmentRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 4000;  // 👈 ПРЕОБРАЗУЕМ В ЧИСЛО

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Инициализация хранилища
initStore();

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'equipment-backend',
    timestamp: new Date().toISOString()
  });
});

// Роуты
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/equipment', equipmentRoutes);

// Обработка 404 (должна быть ПОСЛЕ всех роутов)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});