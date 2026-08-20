const db = require("../database/database");
const bcrypt = require("bcryptjs");

const getProfile = (req, res) => {
    try {
        const userId = req.user.id;

        const user = db.prepare(`
            SELECT id, name, email, role, phone, avatar, created_at
            FROM users
            WHERE id = ?
        `).get(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const addresses = db.prepare(`
            SELECT * FROM addresses
            WHERE user_id = ?
            ORDER BY is_default DESC, created_at DESC
        `).all(userId);

        res.status(200).json({ user, addresses });
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};

const updateProfile = (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, avatar } = req.body;

        db.prepare(`
            UPDATE users
            SET 
                name = COALESCE(?, name),
                phone = COALESCE(?, phone),
                avatar = COALESCE(?, avatar)
            WHERE id = ?
        `).run(name, phone, avatar, userId);

        const updatedUser = db.prepare(`
            SELECT id, name, email, role, phone, avatar, created_at
            FROM users
            WHERE id = ?
        `).get(userId);

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Failed to update profile:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new passwords are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        const user = db.prepare("SELECT password FROM users WHERE id = ?").get(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashedPassword, userId);

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Failed to change password:", error);
        res.status(500).json({ message: "Failed to change password" });
    }
};

const getAddresses = (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = db.prepare(`
            SELECT * FROM addresses
            WHERE user_id = ?
            ORDER BY is_default DESC, created_at DESC
        `).all(userId);

        res.status(200).json({ addresses });
    } catch (error) {
        console.error("Failed to get addresses:", error);
        res.status(500).json({ message: "Failed to fetch addresses" });
    }
};

const addAddress = (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, street, city, state, zip, phone, isDefault } = req.body;

        if (!fullName || !street || !city || !state || !zip || !phone) {
            return res.status(400).json({ message: "All address fields are required" });
        }

        if (isDefault) {
            db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(userId);
        }

        const result = db.prepare(`
            INSERT INTO addresses (user_id, full_name, street, city, state, zip, phone, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(userId, fullName, street, city, state, zip, phone, isDefault ? 1 : 0);

        const newAddress = db.prepare("SELECT * FROM addresses WHERE id = ?").get(result.lastInsertRowid);
        res.status(201).json({ message: "Address saved", address: newAddress });
    } catch (error) {
        console.error("Failed to add address:", error);
        res.status(500).json({ message: "Failed to add address" });
    }
};

const deleteAddress = (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        db.prepare("DELETE FROM addresses WHERE id = ? AND user_id = ?").run(id, userId);
        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Failed to delete address:", error);
        res.status(500).json({ message: "Failed to delete address" });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getAddresses,
    addAddress,
    deleteAddress
};
