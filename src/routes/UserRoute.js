import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleWishlist,
  getWishlist,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);
router.post("/forgot-password",forgotPassword );
router.post("/reset-password/:token",resetPassword );

// POST /api/users/wishlist/:productId
router.put("/wishlist/:productId", authMiddleware,toggleWishlist )
router.get("/wishlist", authMiddleware, getWishlist);


// Get all users
router.get("/", getUsers);

// Get user by ID
router.get("/:id", getUserById);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

export default router;