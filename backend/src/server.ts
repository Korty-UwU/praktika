import express from 'express';
import cors from 'cors';
import { initStore } from './store/store';
import warehouseRoutes from './routes/warehouseRoutes';
import equipmentRoutes from './routes/equipmentRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({
  origin: '*', 
  credentials: true,
}));

app.use(express.json());

initStore();

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'equipment-backend',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/warehouses', warehouseRoutes);
app.use('/api/equipment', equipmentRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});