const db = require("../database/database");

const getWishlist = (req, res) => {
    try {
        const userId = req.user.id;

        const items = db.prepare(`
            SELECT 
                wishlist.id AS wishlist_id,
                wishlist.created_at AS added_at,
                products.*,
                categories.name AS category_name
            FROM wishlist
            JOIN products ON wishlist.product_id = products.id
            LEFT JOIN categories ON products.category_id = categories.id
            WHERE wishlist.user_id = ?
            ORDER BY wishlist.created_at DESC
        `).all(userId);

        res.status(200).json({ items, count: items.length });
    } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        res.status(500).json({ message: "Failed to fetch wishlist" });
    }
};

const addToWishlist = (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = db.prepare("SELECT id FROM products WHERE id = ?").get(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        db.prepare(`
            INSERT OR IGNORE INTO wishlist (user_id, product_id)
            VALUES (?, ?)
        `).run(userId, productId);

        const items = db.prepare(`
            SELECT 
                wishlist.id AS wishlist_id,
                wishlist.created_at AS added_at,
                products.*
            FROM wishlist
            JOIN products ON wishlist.product_id = products.id
            WHERE wishlist.user_id = ?
        `).all(userId);

        res.status(201).json({ message: "Item added to wishlist", items, count: items.length });
    } catch (error) {
        console.error("Failed to add to wishlist:", error);
        res.status(500).json({ message: "Failed to add to wishlist" });
    }
};

const removeFromWishlist = (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        db.prepare(`
            DELETE FROM wishlist
            WHERE user_id = ? AND product_id = ?
        `).run(userId, productId);

        const items = db.prepare(`
            SELECT 
                wishlist.id AS wishlist_id,
                wishlist.created_at AS added_at,
                products.*
            FROM wishlist
            JOIN products ON wishlist.product_id = products.id
            WHERE wishlist.user_id = ?
        `).all(userId);

        res.status(200).json({ message: "Item removed from wishlist", items, count: items.length });
    } catch (error) {
        console.error("Failed to remove from wishlist:", error);
        res.status(500).json({ message: "Failed to remove from wishlist" });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
