import Product from "../models/ProductModel.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, attributes } = req.body;
    
    // Get Cloudinary URLs from multer-storage-cloudinary
    const imageUrls = req.files.map((file) => file.path);

    const product = new Product({
      name,
      price,
      description,
      category,
      attributes: JSON.parse(attributes), // Comes from formData
      images: imageUrls,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }   };
  
export default {
  createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};