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
    console.log("key:", process.env.RAZORPAY_KEY_ID);

    // Ensure Razorpay keys exist
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys are not set in environment variables");
      return res.status(500).json({ error: "Razorpay keys not configured on server" });
    }

    const amountInRupees = Number(req.body.amount) || 0;
    // Razorpay expects amount in paise (integer)
    const options = {
      amount: Math.round(amountInRupees * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    console.log("Creating order with options:", options);
    console.log("Razorpay instance:", instance);
    
    const order = await instance.orders.create(options);
    console.log("Creating order...",order);
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
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      totalAmount,
      address,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    console.log("razorpay_signature (incoming):", razorpay_signature);
    console.log("expectedSign (computed):", expectedSign);

    if (expectedSign !== razorpay_signature) {
      console.error("Signature mismatch during payment verification");
      return res.status(400).json({ success: false, message: "Payment verification failed: signature mismatch" });
    }

    // ✅ If verified — create order in DB
    const orderData = {
      // include both keys to match schema naming (some schemas expect `userId`)
      userId: req.user?.id || req.user?._id || undefined,
      items: cartItems,
      totalAmount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: "Paid",
      orderStatus: "Processing",
      address,
    };

    try {
      const order = new Order(orderData);
      console.log("Order about to save backend:", order);
      await order.save();
      console.log("Order saved backend:", order);
      return res.json({ success: true, message: "Payment verified and order created", order });
    } catch (saveErr) {
      console.error("Order save error:", saveErr);
      return res.status(400).json({ success: false, error: saveErr.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
