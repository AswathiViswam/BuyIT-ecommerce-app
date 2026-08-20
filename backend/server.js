require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./database/database");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const wishlistRoutes = require("./routes/wishlist");
const reviewRoutes = require("./routes/reviews");
const couponRoutes = require("./routes/coupons");
const userRoutes = require("./routes/user");

app.use(
    cors({
        origin: "https://buy-it-ecommerce-app-9kq9.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "E-commerce Enterprise API is running!",
        version: "2.0.0"
    });
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module .exports = app;