const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRole");
const express = require("express");

const router = express.Router();

const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", authenticateToken, authorizeRoles("seller"), createProduct);
router.put("/:id", authenticateToken, authorizeRoles("seller"), updateProduct);
router.delete("/:id", authenticateToken, authorizeRoles("seller"), deleteProduct);

module.exports = router;