
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
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
const allowedOrigins = [
  "https://theartsoul.vercel.app", // production
  "http://localhost:5173",         // local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies / auth headers
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