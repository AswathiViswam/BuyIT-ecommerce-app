const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");

router.get("/", authenticateToken, getWishlist);
router.post("/", authenticateToken, addToWishlist);
router.delete("/:productId", authenticateToken, removeFromWishlist);

module.exports = router;
