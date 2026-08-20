const db = require("../database/database");

const validateCoupon = (req, res) => {
    try {
        const { code, orderAmount = 0 } = req.body;

        if (!code || !code.trim()) {
            return res.status(400).json({ message: "Coupon code is required" });
        }

        const coupon = db.prepare(`
            SELECT * FROM coupons
            WHERE UPPER(code) = UPPER(?)
        `).get(code.trim());

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }

        if (orderAmount < coupon.min_order_value) {
            return res.status(400).json({
                message: `This coupon requires a minimum cart value of ₹${coupon.min_order_value}`
            });
        }

        let calculatedDiscount = 0;
        if (coupon.discount_percent > 0) {
            calculatedDiscount = Math.round((orderAmount * coupon.discount_percent) / 100);
        } else if (coupon.discount_amount > 0) {
            calculatedDiscount = Math.min(orderAmount, coupon.discount_amount);
        }

        res.status(200).json({
            message: `Coupon applied: ₹${calculatedDiscount} discount!`,
            coupon: {
                code: coupon.code,
                discountPercent: coupon.discount_percent,
                discountAmount: calculatedDiscount,
                minOrderValue: coupon.min_order_value
            }
        });

    } catch (error) {
        console.error("Failed to validate coupon:", error);
        res.status(500).json({ message: "Failed to validate coupon" });
    }
};

module.exports = {
    validateCoupon
};
