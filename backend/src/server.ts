import express from 'express';
import cors from 'cors';
import { initStore } from './store/store';
import warehouseRoutes from './routes/warehouseRoutes';
import equipmentRoutes from './routes/equipmentRoutes';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Инициализация хранилища
initStore();

// Роуты
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/equipment', equipmentRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Ваши роуты
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/equipment', equipmentRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});