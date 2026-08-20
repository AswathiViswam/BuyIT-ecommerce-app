const db = require("../database/database");

const getProducts = (req, res) => {
    try {
        const {
            search,
            category_id,
            category,
            brand,
            minPrice,
            maxPrice,
            minRating,
            inStock,
            discount,
            sort,
            page = 1,
            limit = 12
        } = req.query;

        let query = `
            SELECT products.*, categories.name AS category_name
            FROM products
            LEFT JOIN categories ON products.category_id = categories.id
            WHERE 1=1
        `;
        let countQuery = `
            SELECT COUNT(*) AS total
            FROM products
            LEFT JOIN categories ON products.category_id = categories.id
            WHERE 1=1
        `;
        let params = [];
        let countParams = [];

        if (search) {
            const searchClause = " AND (products.name LIKE ? OR products.description LIKE ? OR products.brand LIKE ?)";
            const searchVal = `%${search}%`;
            query += searchClause;
            countQuery += searchClause;
            params.push(searchVal, searchVal, searchVal);
            countParams.push(searchVal, searchVal, searchVal);
        }

        if (category_id) {
            query += " AND products.category_id = ?";
            countQuery += " AND products.category_id = ?";
            params.push(category_id);
            countParams.push(category_id);
        } else if (category) {
            query += " AND categories.name = ?";
            countQuery += " AND categories.name = ?";
            params.push(category);
            countParams.push(category);
        }

        if (brand) {
            const brands = brand.split(",").map(b => b.trim()).filter(Boolean);
            if (brands.length > 0) {
                const placeholders = brands.map(() => "?").join(",");
                query += ` AND products.brand IN (${placeholders})`;
                countQuery += ` AND products.brand IN (${placeholders})`;
                params.push(...brands);
                countParams.push(...brands);
            }
        }

        if (minPrice !== undefined && minPrice !== "") {
            query += " AND products.price >= ?";
            countQuery += " AND products.price >= ?";
            params.push(Number(minPrice));
            countParams.push(Number(minPrice));
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            query += " AND products.price <= ?";
            countQuery += " AND products.price <= ?";
            params.push(Number(maxPrice));
            countParams.push(Number(maxPrice));
        }

        if (minRating !== undefined && minRating !== "") {
            query += " AND products.rating >= ?";
            countQuery += " AND products.rating >= ?";
            params.push(Number(minRating));
            countParams.push(Number(minRating));
        }

        if (inStock === "true" || inStock === "1") {
            query += " AND products.stock > 0";
            countQuery += " AND products.stock > 0";
        }

        if (discount !== undefined && discount !== "") {
            query += " AND products.discount_percent >= ?";
            countQuery += " AND products.discount_percent >= ?";
            params.push(Number(discount));
            countParams.push(Number(discount));
        }

        // Sorting
        switch (sort) {
            case "price_asc":
                query += " ORDER BY products.price ASC";
                break;
            case "price_desc":
                query += " ORDER BY products.price DESC";
                break;
            case "rating_desc":
                query += " ORDER BY products.rating DESC, products.review_count DESC";
                break;
            case "discount_desc":
                query += " ORDER BY products.discount_percent DESC";
                break;
            case "name_asc":
                query += " ORDER BY products.name ASC";
                break;
            case "newest":
            default:
                query += " ORDER BY products.created_at DESC";
                break;
        }

        // Pagination
        const totalResult = db.prepare(countQuery).get(...countParams);
        const total = totalResult ? totalResult.total : 0;
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.max(1, parseInt(limit, 10));
        const offset = (pageNum - 1) * limitNum;

        query += " LIMIT ? OFFSET ?";
        params.push(limitNum, offset);

        const products = db.prepare(query).all(...params);

        // Fetch all distinct brands for filter sidebar
        const allBrands = db.prepare("SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL ORDER BY brand ASC").all().map(b => b.brand);

        res.status(200).json({
            products,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
            brands: allBrands
        });

    } catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

const getProductById = (req, res) => {
    try {
        const { id } = req.params;

        const product = db.prepare(`
            SELECT products.*, categories.name AS category_name
            FROM products
            LEFT JOIN categories ON products.category_id = categories.id
            WHERE products.id = ?
        `).get(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Get reviews for this product
        const reviews = db.prepare(`
            SELECT reviews.*, users.name AS user_name, users.avatar AS user_avatar
            FROM reviews
            JOIN users ON reviews.user_id = users.id
            WHERE reviews.product_id = ?
            ORDER BY reviews.created_at DESC
        `).all(id);

        // Get similar products in the same category
        const similarProducts = db.prepare(`
            SELECT * FROM products
            WHERE category_id = ? AND id != ?
            LIMIT 4
        `).all(product.category_id, id);

        res.status(200).json({
            ...product,
            reviews,
            similarProducts
        });

    } catch (error) {
        console.error("Failed to fetch product:", error);
        res.status(500).json({ message: "Failed to fetch product" });
    }
};

const createProduct = (req, res) => {
    try {
        const seller_id = req.user.id;
        const {
            name,
            description,
            price,
            original_price,
            discount_percent,
            stock,
            brand,
            category_id,
            image_url,
            specifications
        } = req.body;
        
        if (!name || price === undefined || !category_id) {
            return res.status(400).json({ message: "Name, price and category are required" });
        }

        const statement = db.prepare(`
            INSERT INTO products
            (name, description, price, original_price, discount_percent, stock, brand, category_id, image_url, specifications, seller_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = statement.run(
            name,
            description || null,
            price,
            original_price || price,
            discount_percent || 0,
            stock || 0,
            brand || "Generic",
            category_id,
            image_url || null,
            typeof specifications === "object" ? JSON.stringify(specifications) : specifications || null
        );

        const newProduct = db.prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid);
        res.status(201).json(newProduct);

    } catch (error) {
        console.error("Failed to create product:", error);
        res.status(500).json({ message: "Failed to create product" });
    }
};

const updateProduct = (req, res) => {
    try {
        const { id } = req.params;
        const product = db
        .prepare("SELECT seller_id FROM products WHERE id = ?")
        .get(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.seller_id !== req.user.id) {
            return res.status(403).json({
                message: "You can only manage your own products",
            });
        }
        
        const {
            name,
            description,
            price,
            original_price,
            discount_percent,
            stock,
            brand,
            category_id,
            image_url,
            specifications
        } = req.body;

        const statement = db.prepare(`
            UPDATE products
            SET
                name = COALESCE(?, name),
                description = COALESCE(?, description),
                price = COALESCE(?, price),
                original_price = COALESCE(?, original_price),
                discount_percent = COALESCE(?, discount_percent),
                stock = COALESCE(?, stock),
                brand = COALESCE(?, brand),
                category_id = COALESCE(?, category_id),
                image_url = COALESCE(?, image_url),
                specifications = COALESCE(?, specifications)
            WHERE id = ?
        `);
        
        statement.run(
            name,
            description,
            price,
            original_price,
            discount_percent,
            stock,
            brand,
            category_id,
            image_url,
            typeof specifications === "object" ? JSON.stringify(specifications) : specifications,
            id
        );

        const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
        res.status(200).json(updated);
    } catch (error) {
        console.error("Failed to update product:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
};

const deleteProduct = (req, res) => {
    try {
        const { id } = req.params;
        const product = db
        .prepare("SELECT seller_id FROM products WHERE id = ?")
        .get(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.seller_id !== req.user.id) {
            return res.status(403).json({
                message: "You can only manage your own products",
            });
        }
        db.prepare("DELETE FROM products WHERE id = ?").run(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Failed to delete product:", error);
        res.status(500).json({ message: "Failed to delete product" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
