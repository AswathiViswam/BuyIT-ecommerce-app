const db = require("./database");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        phone TEXT,
        avatar TEXT,
        reset_token TEXT,
        reset_expires DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        original_price REAL,
        discount_percent INTEGER DEFAULT 0,
        stock INTEGER NOT NULL DEFAULT 0,
        brand TEXT DEFAULT 'Generic',
        rating REAL DEFAULT 4.5,
        review_count INTEGER DEFAULT 0,
        specifications TEXT,
        category_id INTEGER NOT NULL,
        image_url TEXT,
        seller_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS carts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cart_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE (cart_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE (user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_status TEXT NOT NULL DEFAULT 'pending',
        payment_method TEXT DEFAULT 'COD',
        delivery_option TEXT DEFAULT 'standard',
        shipping_address TEXT NOT NULL,
        coupon_code TEXT,
        discount_amount REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title TEXT,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE (user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        street TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip TEXT NOT NULL,
        phone TEXT NOT NULL,
        is_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        discount_percent INTEGER DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        min_order_value REAL DEFAULT 0,
        valid_until DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`);

// Add columns safely if tables existed prior without them
const alterColumns = [
    { table: "users", column: "phone TEXT" },
    { table: "users", column: "avatar TEXT" },
    { table: "users", column: "reset_token TEXT" },
    { table: "users", column: "reset_expires DATETIME" },
    { table: "categories", column: "image_url TEXT" },
    { table: "products", column: "brand TEXT DEFAULT 'Generic'" },
    { table: "products", column: "rating REAL DEFAULT 4.5" },
    { table: "products", column: "review_count INTEGER DEFAULT 0" },
    { table: "products", column: "original_price REAL" },
    { table: "products", column: "discount_percent INTEGER DEFAULT 0" },
    { table: "products", column: "specifications TEXT" },
    { table: "orders", column: "payment_method TEXT DEFAULT 'COD'" },
    { table: "orders", column: "delivery_option TEXT DEFAULT 'standard'" },
    { table: "orders", column: "coupon_code TEXT" },
    { table: "orders", column: "discount_amount REAL DEFAULT 0" },
    { table: "reviews", column: "title TEXT" },
    { table: "products", column: "seller_id INTEGER" },
];

for (const { table, column } of alterColumns) {
    try {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column};`);
    } catch (e) {
        // column already exists
    }
}

// Seed default coupons
const insertCoupon = db.prepare(`
    INSERT OR IGNORE INTO coupons (code, discount_percent, discount_amount, min_order_value)
    VALUES (?, ?, ?, ?)
`);
insertCoupon.run("WELCOME10", 10, 0, 499);
insertCoupon.run("SAVE20", 20, 0, 999);
insertCoupon.run("FLAT100", 0, 100, 599);
insertCoupon.run("SUPER50", 50, 0, 1999);

console.log("Database schema initialized and updated successfully!");