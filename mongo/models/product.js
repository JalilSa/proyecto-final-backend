import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  owner: { 
    type: String, 
    ref: 'users', 
    default: "admin"
  }
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
