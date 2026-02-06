import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      image: String,
      qty: Number,
      price: Number,
    },
  ],
  paymentId: String,
  orderId: String,

  totalAmount: Number,
  paymentStatus: { type: String, default: "Pending" },
  orderStatus: {
  type: String,
  enum: ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
  default: "Processing",
},

  // ✅ New field: delivery address
  address: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: "India" },
  },

  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
