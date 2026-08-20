const db = require("../database/database");

const getCategories = (req, res) => {
    try {
        const categories = db
            .prepare("SELECT * FROM categories")
            .all();

        res.status(200).json(categories);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch categories"
        });
    }
};


const createCategory = (req, res) => {
    try {
        const {
            name,
            description
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const statement = db.prepare(`
            INSERT INTO categories
            (name, description)
            VALUES (?, ?)
        `);

        const result = statement.run(
            name,
            description || null
        );

        const newCategory = db
            .prepare("SELECT * FROM categories WHERE id = ?")
            .get(result.lastInsertRowid);

        res.status(201).json(newCategory);

    } catch (error) {
        console.error(error);

        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        res.status(500).json({
            message: "Failed to create category"
        });
    }
};


module.exports = {
    getCategories,
    createCategory
};