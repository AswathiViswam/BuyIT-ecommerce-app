const db = require("./database");

const seedDatabase = () => {
    console.log("Seeding rich e-commerce database...");

    // 1. Categories
    const categories = [
        { name: "Electronics", description: "Smartphones, laptops, audio gear, and cutting-edge gadgets", image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80" },
        { name: "Fashion & Apparel", description: "Designer clothing, premium footwear, and modern wear", image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80" },
        { name: "Home & Living", description: "Furniture, ambient lighting, decor, and smart home appliances", image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80" },
        { name: "Beauty & Wellness", description: "Skincare, fragrance, organic haircare, and personal grooming", image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80" },
        { name: "Sports & Fitness", description: "Fitness trackers, workout gear, sportswear, and equipment", image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80" }
    ];

    const insertCat = db.prepare(`
        INSERT OR IGNORE INTO categories (name, description, image_url)
        VALUES (?, ?, ?)
    `);

    for (const cat of categories) {
        insertCat.run(cat.name, cat.description, cat.image_url);
    }

    const catMap = {};
    const allCats = db.prepare("SELECT id, name FROM categories").all();
    for (const c of allCats) {
        catMap[c.name] = c.id;
    }

    // 2. Comprehensive Products
    const products = [
        {
            name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
            description: "Industry-leading noise cancellation with two processors and 8 microphones. Magnificent sound quality engineered with the new Integrated Processor V1, up to 30-hour battery life with quick charging.",
            price: 29990,
            original_price: 34990,
            discount_percent: 14,
            stock: 25,
            brand: "Sony",
            rating: 4.8,
            review_count: 142,
            specifications: JSON.stringify({
                "Connectivity": "Bluetooth 5.2, 3.5mm Aux",
                "Battery Life": "Up to 30 Hours",
                "Noise Cancellation": "Dual Processor Active Noise Cancellation",
                "Weight": "250g",
                "Warranty": "1 Year Manufacturer Warranty"
            }),
            category_id: catMap["Electronics"] || 1,
            image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Apple MacBook Air M3 (16GB RAM, 512GB SSD)",
            description: "Supercharged by the next-generation M3 chip, delivering lightning-fast performance, incredible power efficiency, and up to 18 hours of battery life in a breathtakingly thin aluminum body.",
            price: 114900,
            original_price: 124900,
            discount_percent: 8,
            stock: 12,
            brand: "Apple",
            rating: 4.9,
            review_count: 98,
            specifications: JSON.stringify({
                "Processor": "Apple M3 8-core CPU / 10-core GPU",
                "Memory": "16GB Unified RAM",
                "Storage": "512GB NVMe SSD",
                "Display": "13.6-inch Liquid Retina Display (2560x1664)",
                "Weight": "1.24 kg"
            }),
            category_id: catMap["Electronics"] || 1,
            image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Apple Watch Series 9 GPS + Cellular 45mm",
            description: "Advanced health sensors, stunning Always-On Retina display with 2000 nits peak brightness, S9 SiP chip, double tap gesture control, and comprehensive fitness tracking.",
            price: 44900,
            original_price: 49900,
            discount_percent: 10,
            stock: 18,
            brand: "Apple",
            rating: 4.7,
            review_count: 67,
            specifications: JSON.stringify({
                "Case Size": "45mm Midnight Aluminum",
                "Display": "Always-On Retina OLED (2000 nits)",
                "Sensors": "ECG, Blood Oxygen, Temperature Sensor",
                "Water Resistance": "50m (Swimproof)",
                "Battery": "18-36 hours Low Power Mode"
            }),
            category_id: catMap["Electronics"] || 1,
            image_url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Samsung Galaxy S24 Ultra 5G (Titanium Gray)",
            description: "Galaxy AI powered flagship featuring a 200MP camera system with 5x optical zoom, Snapdragon 8 Gen 3 processor, integrated S-Pen stylus, and flat Dynamic AMOLED 2X display.",
            price: 129999,
            original_price: 144999,
            discount_percent: 10,
            stock: 9,
            brand: "Samsung",
            rating: 4.8,
            review_count: 215,
            specifications: JSON.stringify({
                "Camera": "200MP Main + 50MP Periscope + 12MP Ultra-Wide",
                "Display": "6.8\" QHD+ 120Hz Dynamic AMOLED",
                "Processor": "Snapdragon 8 Gen 3 for Galaxy",
                "Battery": "5000 mAh with 45W Fast Charging",
                "Stylus": "Embedded Bluetooth S-Pen"
            }),
            category_id: catMap["Electronics"] || 1,
            image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Nike Air Max 270 React Running Shoes",
            description: "Nike's first lifestyle Air Max meets the softest, smoothest, and most resilient foam, Nike React, for a design that is impossible to ignore and delivers all-day comfort.",
            price: 11995,
            original_price: 14995,
            discount_percent: 20,
            stock: 30,
            brand: "Nike",
            rating: 4.6,
            review_count: 89,
            specifications: JSON.stringify({
                "Material": "Breathable Knit Mesh Upper",
                "Sole": "React Foam & 270 Max Air Unit",
                "Closure": "Speed lacing system",
                "Gender": "Unisex",
                "Color": "Triple Black / Mystic Red"
            }),
            category_id: catMap["Fashion & Apparel"] || 2,
            image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Levi's Men's Vintage Denim Trucker Jacket",
            description: "An iconic timeless silhouette crafted from 100% non-stretch cotton denim. Features point collar, front button placket, button-flap patch pockets at chest, and adjustable side tabs.",
            price: 4999,
            original_price: 6999,
            discount_percent: 28,
            stock: 45,
            brand: "Levi's",
            rating: 4.5,
            review_count: 53,
            specifications: JSON.stringify({
                "Fabric": "100% Heavyweight Cotton Denim",
                "Fit": "Regular Classic Fit",
                "Care": "Machine wash cold inside out",
                "Country of Origin": "India"
            }),
            category_id: catMap["Fashion & Apparel"] || 2,
            image_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Dyson V15 Detect Cordless Vacuum Cleaner",
            description: "Engineered with a laser that reveals invisible dust on hard floors. Acoustic piezo sensor continuously sizes and counts dust particles, automatically ramping up suction when needed.",
            price: 59900,
            original_price: 65900,
            discount_percent: 9,
            stock: 14,
            brand: "Dyson",
            rating: 4.9,
            review_count: 112,
            specifications: JSON.stringify({
                "Suction Power": "240 AW in Boost Mode",
                "Run Time": "Up to 60 minutes",
                "Filtration": "Whole-machine HEPA filtration (99.99%)",
                "Bin Volume": "0.77 Litres",
                "Weight": "3.1 kg"
            }),
            category_id: catMap["Home & Living"] || 3,
            image_url: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Philips Hue Smart LED Ambient Starter Kit",
            description: "Transform your home lighting with 16 million colors and shades of warm-to-cool white. Control effortlessly with voice assistants, app scheduling, and sync with music or movies.",
            price: 8499,
            original_price: 11999,
            discount_percent: 29,
            stock: 22,
            brand: "Philips",
            rating: 4.6,
            review_count: 47,
            specifications: JSON.stringify({
                "Color Output": "16 Million Colors + RGB White Spectrum",
                "Base": "E27 Screw Fitting",
                "Connectivity": "Zigbee + Bluetooth Bridge Included",
                "Lifespan": "25,000 Hours",
                "Smart Voice Support": "Alexa, Google Assistant, Apple HomeKit"
            }),
            category_id: catMap["Home & Living"] || 3,
            image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Estée Lauder Advanced Night Repair Serum (50ml)",
            description: "Revolutionary patented multi-recovery serum with Chronolux Power Signal Technology. Fast visible repair and youth-generating power that reduces all key signs of aging.",
            price: 7900,
            original_price: 8900,
            discount_percent: 11,
            stock: 35,
            brand: "Estée Lauder",
            rating: 4.8,
            review_count: 310,
            specifications: JSON.stringify({
                "Volume": "50 ml",
                "Skin Type": "Suitable for all skin types, non-comedogenic",
                "Key Benefit": "Hyaluronic Acid + Deep Hydration Repair",
                "Free From": "Parabens, Phthalates, Sulfites, Mineral Oil"
            }),
            category_id: catMap["Beauty & Wellness"] || 4,
            image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Bowflex SelectTech 552 Adjustable Dumbbells (Pair)",
            description: "Combines 15 sets of weights into one compact design using a unique dial system. Rapidly adjusts from 5 to 52.5 lbs in 2.5 lb increments up to the first 25 lbs.",
            price: 34999,
            original_price: 42999,
            discount_percent: 18,
            stock: 8,
            brand: "Bowflex",
            rating: 4.9,
            review_count: 85,
            specifications: JSON.stringify({
                "Weight Range": "5 to 52.5 lbs (2.27 to 23.8 kg) each",
                "Settings": "15 distinct weight settings",
                "Material": "Steel with durable molding for smooth lift-off",
                "Dimensions": "40 x 20 x 23 cm"
            }),
            category_id: catMap["Sports & Fitness"] || 5,
            image_url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Sony Alpha 7 IV Full-Frame Mirrorless Camera (Body Only)",
            description: "Groundbreaking hybrid camera with 33MP Exmor R CMOS sensor, 4K 60p recording, Real-time Eye AF for humans, animals, and birds, and 10-bit 4:2:2 color depth.",
            price: 219990,
            original_price: 249990,
            discount_percent: 12,
            stock: 6,
            brand: "Sony",
            rating: 4.9,
            review_count: 73,
            specifications: JSON.stringify({
                "Sensor": "33MP Full-Frame Exmor R BSI CMOS",
                "Video": "4K 60p 10-Bit 4:2:2 / S-Cinetone",
                "Autofocus": "759 Phase-Detection AF Points",
                "Stabilization": "5-Axis In-Body Image Stabilization (5.5 stops)"
            }),
            category_id: catMap["Electronics"] || 1,
            image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
        },
        {
            name: "Ray-Ban Classic Aviator Polarized Sunglasses",
            description: "Originally designed for U.S. aviators in 1937, featuring gold-tone metal frame, crystal green polarized lenses offering 100% UV protection and exceptional optical clarity.",
            price: 9890,
            original_price: 12500,
            discount_percent: 21,
            stock: 20,
            brand: "Ray-Ban",
            rating: 4.7,
            review_count: 154,
            specifications: JSON.stringify({
                "Frame Material": "Metal Alloy (Polished Gold)",
                "Lens": "G-15 Green Polarized Glass",
                "Lens Width": "58 mm",
                "Bridge": "14 mm",
                "UV Protection": "100% UVA/UVB"
            }),
            category_id: catMap["Fashion & Apparel"] || 2,
            image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"
        }
    ];

    // Clear existing products and reinsert to populate rich metadata
    db.prepare("DELETE FROM products").run();

    const insertProd = db.prepare(`
        INSERT INTO products 
        (name, description, price, original_price, discount_percent, stock, brand, rating, review_count, specifications, category_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of products) {
        insertProd.run(
            p.name,
            p.description,
            p.price,
            p.original_price,
            p.discount_percent,
            p.stock,
            p.brand,
            p.rating,
            p.review_count,
            p.specifications,
            p.category_id,
            p.image_url
        );
    }

    console.log(`Inserted ${products.length} rich product records with specifications and ratings!`);
};

seedDatabase();
