const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { getProductReviews, createReview } = require("../controllers/reviewController");

router.get("/:productId", getProductReviews);
router.post("/:productId", authenticateToken, createReview);

module.exports = router;
