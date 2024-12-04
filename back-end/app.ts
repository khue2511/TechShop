import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'
import productRoutes from './routes/productRoutes'
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
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes) 

export default app;
