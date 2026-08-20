const db = require("../database/database");

const getProductReviews = (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = db.prepare(`
            SELECT reviews.*, users.name AS user_name, users.avatar AS user_avatar
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            WHERE reviews.product_id = ?
            ORDER BY reviews.created_at DESC
        `).all(productId);

        const stats = db.prepare(`
            SELECT 
                COUNT(*) AS count,
                AVG(rating) AS average,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS count_5,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS count_4,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS count_3,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS count_2,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS count_1
            FROM reviews
            WHERE product_id = ?
        `).get(productId);

        res.status(200).json({
            reviews,
            stats: {
                count: stats?.count || 0,
                average: Number((stats?.average || 0).toFixed(1)),
                breakdown: {
                    5: stats?.count_5 || 0,
                    4: stats?.count_4 || 0,
                    3: stats?.count_3 || 0,
                    2: stats?.count_2 || 0,
                    1: stats?.count_1 || 0,
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

const createReview = (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { rating, title, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5 stars" });
        }

        const product = db.prepare("SELECT id FROM products WHERE id = ?").get(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Insert or replace review
        db.prepare(`
            INSERT INTO reviews (user_id, product_id, rating, title, comment)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id, product_id) DO UPDATE SET
                rating = excluded.rating,
                title = excluded.title,
                comment = excluded.comment,
                created_at = CURRENT_TIMESTAMP
        `).run(userId, productId, rating, title || null, comment || null);

        // Update product overall rating & review_count
        const ratingStats = db.prepare(`
            SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
            FROM reviews
            WHERE product_id = ?
        `).get(productId);

        if (ratingStats) {
            db.prepare(`
                UPDATE products
                SET rating = ?, review_count = ?
                WHERE id = ?
            `).run(
                Number(ratingStats.avg_rating.toFixed(1)),
                ratingStats.total_reviews,
                productId
            );
        }

        const newReview = db.prepare(`
            SELECT reviews.*, users.name AS user_name, users.avatar AS user_avatar
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            WHERE reviews.user_id = ? AND reviews.product_id = ?
        `).get(userId, productId);

        res.status(201).json({ message: "Review submitted successfully", review: newReview });
    } catch (error) {
        console.error("Failed to submit review:", error);
        res.status(500).json({ message: "Failed to submit review" });
    }
};

module.exports = {
    getProductReviews,
    createReview
};
