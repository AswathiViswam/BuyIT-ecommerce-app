const db = require("../database/database");

const getCart = (req, res) => {
    try {
        const userId = req.user.id;

        let cart = db
            .prepare(`
                SELECT *
                FROM carts
                WHERE user_id = ?
            `)
            .get(userId);

        if (!cart) {
            const result = db
                .prepare(`
                    INSERT INTO carts (user_id)
                    VALUES (?)
                `)
                .run(userId);

            cart = db
                .prepare(`
                    SELECT *
                    FROM carts
                    WHERE id = ?
                `)
                .get(result.lastInsertRowid);
        }

        const items = db
            .prepare(`
                SELECT
                    cart_items.id,
                    cart_items.product_id,
                    cart_items.quantity,
                    products.name,
                    products.price,
                    products.image_url
                FROM cart_items
                JOIN products
                    ON cart_items.product_id = products.id
                WHERE cart_items.cart_id = ?
            `)
            .all(cart.id);

        res.status(200).json({
            cartId: cart.id,
            items
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch cart"
        });
    }
};

const addToCart = (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });
        }

        const product = db
            .prepare(`
                SELECT *
                FROM products
                WHERE id = ?
            `)
            .get(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.stock <= 0) {
            return res.status(400).json({
                message: "Product is out of stock"
            });
        }

        let cart = db
            .prepare(`
                SELECT *
                FROM carts
                WHERE user_id = ?
            `)
            .get(userId);

        if (!cart) {
            const result = db
                .prepare(`
                    INSERT INTO carts (user_id)
                    VALUES (?)
                `)
                .run(userId);

            cart = db
                .prepare(`
                    SELECT *
                    FROM carts
                    WHERE id = ?
                `)
                .get(result.lastInsertRowid);
        }

        const existingItem = db
            .prepare(`
                SELECT *
                FROM cart_items
                WHERE cart_id = ?
                AND product_id = ?
            `)
            .get(cart.id, productId);

        const newQuantity = existingItem
            ? existingItem.quantity + quantity
            : quantity;

        if (newQuantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock`
            });
        }

        if (existingItem) {
            db.prepare(`
                UPDATE cart_items
                SET quantity = ?
                WHERE id = ?
            `).run(
                newQuantity,
                existingItem.id
            );
        } else {
            db.prepare(`
                INSERT INTO cart_items
                (cart_id, product_id, quantity)
                VALUES (?, ?, ?)
            `).run(
                cart.id,
                productId,
                quantity
            );
        }

        const cartItem = db
            .prepare(`
                SELECT
                    cart_items.id,
                    cart_items.product_id,
                    cart_items.quantity,
                    products.name,
                    products.price,
                    products.image_url
                FROM cart_items
                JOIN products
                    ON cart_items.product_id = products.id
                WHERE cart_items.cart_id = ?
                AND cart_items.product_id = ?
            `)
            .get(cart.id, productId);

        res.status(201).json({
            message: "Product added to cart",
            item: cartItem
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to add product to cart"
        });
    }
};

const updateCartItem = (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.itemId;
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });
        }

        const cart = db
            .prepare(`
                SELECT *
                FROM carts
                WHERE user_id = ?
            `)
            .get(userId);

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const cartItem = db
            .prepare(`
                SELECT *
                FROM cart_items
                WHERE id = ?
                AND cart_id = ?
            `)
            .get(itemId, cart.id);

        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        const product = db
            .prepare(`
                SELECT stock
                FROM products
                WHERE id = ?
            `)
            .get(cartItem.product_id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock`
            });
        }

        db.prepare(`
            UPDATE cart_items
            SET quantity = ?
            WHERE id = ?
        `).run(quantity, itemId);

        res.status(200).json({
            message: "Cart item updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update cart item"
        });
    }
};

const removeCartItem = (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.itemId;

        const cart = db
            .prepare(`
                SELECT *
                FROM carts
                WHERE user_id = ?
            `)
            .get(userId);

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const result = db
            .prepare(`
                DELETE FROM cart_items
                WHERE id = ?
                AND cart_id = ?
            `)
            .run(itemId, cart.id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        res.status(200).json({
            message: "Cart item removed successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to remove cart item"
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem
};