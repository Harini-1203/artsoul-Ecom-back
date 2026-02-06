import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { upload } from "../config/multer.js";



const router = express.Router();
// Create product
router.post("/", upload.array("images",5), createProduct);

// Get all products
router.get("/", getProducts);

// Get product by ID
router.get("/:id", getProductById);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;