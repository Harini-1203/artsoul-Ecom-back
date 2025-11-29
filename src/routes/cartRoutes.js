import express from "express";
import User from "../models/UserModel.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🛒 Get user cart
router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate("cart.product");
    const cart = user.cart.map(item => ({
    _id: item._id,
    qty: item.qty,
    productId: item.product._id,
    name: item.product.name,
    price: item.product.price,
    images: item.product.images,
    description: item.product.description,
  }));
  res.json(user.cart);
});

// ➕ Add item to cart
router.post("/add/:productId", authMiddleware, async (req, res) => {
  const { qty } = req.body;
  const user = await User.findById(req.user.id);
  const productId = req.params.productId;

  const existing = user.cart.find(item => item.product.toString() === productId);

  if (existing) {
    existing.qty += qty || 1;
  } else {
    user.cart.push({ product: productId, qty: qty || 1 });
  }

  await user.save();
  res.json({ success: true, cart: user.cart });
});

// ✏️ Update item qty
router.put("/update/:productId", authMiddleware, async (req, res) => {
  const { qty } = req.body;
  const user = await User.findById(req.user.id);

  user.cart = user.cart.map(item =>
    item.product.toString() === req.params.productId
      ? { ...item, qty }
      : item
  );

  await user.save();
  res.json({ success: true, cart: user.cart });
});

// ❌ Remove item
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart = user.cart.filter(
    item => item.product.toString() !== req.params.productId
  );
  await user.save();
  res.json({ success: true, cart: user.cart });
});

export default router;
