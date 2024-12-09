import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string,
  description: string,
  price: number,
  quantity: number,
  imageUrl?: string
}

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
