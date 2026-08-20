const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
    changePassword,
    getAddresses,
    addAddress,
    deleteAddress
} = require("../controllers/userController");

router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, changePassword);
router.get("/addresses", authenticateToken, getAddresses);
router.post("/addresses", authenticateToken, addAddress);
router.delete("/addresses/:id", authenticateToken, deleteAddress);

module.exports = router;
