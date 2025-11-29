import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String
});


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: [addressSchema],
  phone: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: { type: Number, default: 1 },
    },
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
