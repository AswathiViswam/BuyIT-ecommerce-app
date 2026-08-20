const db = require("../database/database");

const createOrder = (req, res) => {
    try {
        const userId = req.user.id;
        const {
            shippingAddress,
            paymentMethod = "COD",
            deliveryOption = "standard",
            couponCode = null,
            discountAmount = 0
        } = req.body;

        if (!shippingAddress || !shippingAddress.trim()) {
            return res.status(400).json({ message: "Shipping address is required" });
        }

        const createOrderTransaction = db.transaction(() => {
            const cart = db.prepare("SELECT * FROM carts WHERE user_id = ?").get(userId);
            if (!cart) {
                throw new Error("Cart not found");
            }

            const cartItems = db.prepare(`
                SELECT
                    cart_items.id,
                    cart_items.product_id,
                    cart_items.quantity,
                    products.name,
                    products.price,
                    products.stock
                FROM cart_items
                JOIN products ON cart_items.product_id = products.id
                WHERE cart_items.cart_id = ?
            `).all(cart.id);

            if (cartItems.length === 0) {
                throw new Error("Cart is empty");
            }

            let subtotal = 0;
            for (const item of cartItems) {
                if (item.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.name}`);
                }
                subtotal += item.price * item.quantity;
            }

            const deliveryFee = deliveryOption === "express" ? 99 : (subtotal > 500 ? 0 : 49);
            const appliedDiscount = Math.min(Number(discountAmount) || 0, subtotal);
            const totalAmount = Math.max(0, subtotal - appliedDiscount + deliveryFee);

            const orderResult = db.prepare(`
                INSERT INTO orders
                (
                    user_id,
                    total_amount,
                    status,
                    payment_status,
                    payment_method,
                    delivery_option,
                    shipping_address,
                    coupon_code,
                    discount_amount
                )
                VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?)
            `).run(
                userId,
                totalAmount,
                paymentMethod === "COD" ? "pending" : "paid",
                paymentMethod,
                deliveryOption,
                shippingAddress.trim(),
                couponCode,
                appliedDiscount
            );

            const orderId = orderResult.lastInsertRowid;

            const insertOrderItem = db.prepare(`
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)
            `);

            const updateStock = db.prepare(`
                UPDATE products
                SET stock = stock - ?
                WHERE id = ? AND stock >= ?
            `);

            for (const item of cartItems) {
                insertOrderItem.run(orderId, item.product_id, item.quantity, item.price);
                const stockResult = updateStock.run(item.quantity, item.product_id, item.quantity);
                if (stockResult.changes !== 1) {
                    throw new Error(`Unable to update stock for ${item.name}`);
                }
            }

            // Clear cart
            db.prepare("DELETE FROM cart_items WHERE cart_id = ?").run(cart.id);

            return { orderId, totalAmount };
        });

        const result = createOrderTransaction();
        const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(result.orderId);

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error("Order creation failed:", error);
        res.status(400).json({ message: error.message || "Failed to create order" });
    }
};

const getOrders = (req, res) => {
    try {
        const userId = req.user.id;
        const orders = db.prepare(`
            SELECT * FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
        `).all(userId);

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

const getOrderById = (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        const order = db.prepare(`
            SELECT * FROM orders
            WHERE id = ? AND user_id = ?
        `).get(orderId, userId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const items = db.prepare(`
            SELECT
                order_items.id,
                order_items.product_id,
                order_items.quantity,
                order_items.price,
                products.name,
                products.image_url
            FROM order_items
            JOIN products ON order_items.product_id = products.id
            WHERE order_items.order_id = ?
        `).all(orderId);

        res.status(200).json({ order, items });
    } catch (error) {
        console.error("Failed to fetch order:", error);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById
};