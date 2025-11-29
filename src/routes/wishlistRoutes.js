import express from "express";
import User from "../models/UserModel.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 💖 Get wishlist
router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate("wishlist");
  res.json(user.wishlist);
});

// 💖 Toggle wishlist item
router.put("/:productId", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const productId = req.params.productId;

  const exists = user.wishlist.includes(productId);
  if (exists) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

export default router;
