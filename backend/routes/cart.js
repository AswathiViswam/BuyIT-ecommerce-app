const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem
} = require("../controllers/cartController");

router.get(
    "/",
    authenticateToken,
    getCart
);

router.post(
    "/",
    authenticateToken,
    addToCart
);

router.put(
    "/:itemId",
    authenticateToken,
    updateCartItem
);

router.delete(
    "/:itemId",
    authenticateToken,
    removeCartItem
);

module.exports = router;