import express from "express";
import { createOrder, getUserOrders, getAllOrders,cancelOrder } from "../controllers/OrderController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"// if you have JWT auth

const router = express.Router();

// User creates order

router.post("/", createOrder);

// User sees their orders
router.get("/my-orders",authMiddleware, getUserOrders);
router.put("/:id/cancel",authMiddleware, cancelOrder);
// Admin sees all orders
router.get("/", getAllOrders);

export default router;
