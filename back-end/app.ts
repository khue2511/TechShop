import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'
import productRoutes from './routes/productRoutes'
import authRoutes from './routes/authRoutes'
import cartRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'
import cors from 'cors';

dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(cors())

//Connect to mongodb
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

export default app;
