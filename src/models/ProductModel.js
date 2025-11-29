import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: String,
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  sizes: [String],
  stock: { type: Number, default: 0 },
  rating: Number,
  reviews: [
    {
      userId: String,
      comment: String,
      rating: Number,
      date: Date,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", ProductSchema);