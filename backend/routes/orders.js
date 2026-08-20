const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    createOrder,
    getOrders,
    getOrderById
} = require("../controllers/orderController");

router.post(
    "/",
    authenticateToken,
    createOrder
);

router.get(
    "/",
    authenticateToken,
    getOrders
);

router.get(
    "/:id",
    authenticateToken,
    getOrderById
);
module.exports = router;