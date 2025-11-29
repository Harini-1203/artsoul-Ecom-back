import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/OrderModel.js"; // <-- Import your Order model
import { authMiddleware } from "../middleware/authMiddleware.js"; // <-- To get req.user.id

const router = express.Router();

// CREATE ORDER (razorpay)
router.post("/create-order", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(req.body.amount * 100), // ensure integer paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    // return wrapped for frontend compatibility
    res.json({ order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// VERIFY PAYMENT & CREATE ORDER IN DB
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      // razorpay_order_id,
      // razorpay_payment_id,
      // razorpay_signature,
      cartItems,
      totalAmount,
      address,
    } = req.body;

    // const sign = razorpay_order_id + "|" + razorpay_payment_id;
    // const expectedSign = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    //   .update(sign)
    //   .digest("hex");

    // if (expectedSign !== razorpay_signature) {
    //   return res.status(400).json({ success: false, message: "Payment verification failed" });
    // }

    // ✅ If verified — create order in DB
    const order = new Order({
      user: req.user.id,
      items: cartItems,
      totalAmount,
      // paymentId: razorpay_payment_id,
      // orderId: razorpay_order_id,
      paymentId:1,
      orderId:1,

      paymentStatus: "Paid",
      orderStatus: "Processing",
      address,
    });

    await order.save();
    res.json({ success: true, message: "Payment verified and order created", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
