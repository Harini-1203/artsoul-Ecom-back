import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import productRoutes from "./routes/ProductRoute.js";
import userRoutes from "./routes/UserRoute.js";
import bodyParser from "body-parser";
// const routes = require('./routes/index');
import dbConfig from "./config/db.js";
import paymentRoutes from "./routes/PaymentRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";

//admin
import adminOrderRoutes from "./routes/admin/adminOrders.js";   

//cart and wishlist routes 
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://theartsoul.vercel.app", // ✅ your frontend URL
    credentials: true,                // ✅ allow cookies / auth headers
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

// Database connection
dbConfig();

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

//payment route
app.use("/api/payments", paymentRoutes);

//order route
app.use("/api/orders", orderRoutes);
// Cart routes
app.use("/api/cart", cartRoutes);

// Wishlist routes
app.use("/api/wishlist", wishlistRoutes);

// Admin order routes
app.use("/api/admin/orders", adminOrderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});