import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";


// Create new order after payment success
export const createOrder = async (req, res) => {
  try {
    const { userId,items, totalAmount, paymentId, orderId,address } = req.body;
    const order = new Order({
      userId,
      items,
      totalAmount,
      paymentId,
      orderId,
      paymentStatus: "Paid",
      orderStatus: "Processing",
      address
    });
    await order.save();
    const user = await User.findById(userId);
    user.cart = []; 
    await user.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get orders of logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items._id");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin - view all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.orderStatus !== "Processing")
      return res.status(400).json({ error: "Cannot cancel this order" });

    order.orderStatus = "Cancelled";
    order.cancelable = false;
    await order.save();
    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
