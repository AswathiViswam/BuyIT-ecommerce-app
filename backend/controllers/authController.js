const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../database/database");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/tokens");

const register = (req, res) => {
    try {
        const { name, email, password, role = "customer" } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        if (!["customer", "seller"].includes(role)) {
            return res.status(400).json({ message: "Role must be either customer or seller" });
        }

        const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = bcrypt.hashSync(password, 12);
        const statement = db.prepare(`
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `);

        const result = statement.run(name, email, hashedPassword, role);
        const user = db.prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?").get(result.lastInsertRowid);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        db.prepare(`
            INSERT INTO refresh_tokens (user_id, token, expires_at)
            VALUES (?, ?, datetime('now', '+7 days'))
        `).run(user.id, refreshToken);

        res.status(201).json({
            message: "Registration successful",
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed" });
    }
};

const login = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        db.prepare(`
            INSERT INTO refresh_tokens (user_id, token, expires_at)
            VALUES (?, ?, datetime('now', '+7 days'))
        `).run(user.id, refreshToken);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
};

const refreshAccessToken = (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }

        const storedToken = db.prepare("SELECT * FROM refresh_tokens WHERE token = ?").get(refreshToken);
        if (!storedToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_key");
        const user = db.prepare("SELECT id, name, email, role, phone, avatar FROM users WHERE id = ?").get(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken, user });

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

const logout = (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            db.prepare("DELETE FROM refresh_tokens WHERE token = ?").run(refreshToken);
        }

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Logout failed" });
    }
};

const forgotPassword = (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (!user) {
            return res.status(404).json({ message: "No account found with this email address" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

        db.prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?").run(resetToken, expires, user.id);

        res.status(200).json({
            message: "Password reset link generated successfully",
            resetToken,
            instructions: `Use reset token '${resetToken}' to reset password within 1 hour.`
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Failed to process forgot password" });
    }
};

const resetPassword = (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: "Reset token and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = db.prepare("SELECT * FROM users WHERE reset_token = ? AND reset_expires > datetime('now')").get(resetToken);
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired password reset token" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 12);
        db.prepare("UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?").run(hashedPassword, user.id);

        res.status(200).json({ message: "Password has been successfully reset. Please log in." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
};
