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

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Инициализация хранилища
initStore();

// Роуты
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/equipment', equipmentRoutes);

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});