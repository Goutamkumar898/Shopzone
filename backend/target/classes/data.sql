-- Seed Categories (INSERT IGNORE avoids duplicate errors on restart)
INSERT IGNORE INTO categories (id, name, description, image_url) VALUES
(1, 'Electronics',   'Gadgets, phones, laptops and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
(2, 'Clothing',      'Men and women fashion',                    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'),
(3, 'Books',         'Fiction, non-fiction and textbooks',       'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400'),
(4, 'Home & Garden', 'Home decor and garden tools',              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'),
(5, 'Sports',        'Fitness and sports equipment',             'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400');

-- Seed Products
INSERT IGNORE INTO products (id, name, description, price, stock, category_id, image_url, rating) VALUES
(1,  'iPhone 15 Pro',        'Apple A17 Pro chip, titanium design, 48MP camera',    99999.00, 50,  1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 4.8),
(2,  'Samsung Galaxy S24',   'Snapdragon 8 Gen 3, 200MP camera, AI features',       79999.00, 40,  1, 'https://images.unsplash.com/photo-1707195350426-4cf4ce36c3d9?w=400', 4.7),
(3,  'Sony WH-1000XM5',      'Industry-leading noise cancellation headphones',       29999.00, 100, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 4.9),
(4,  'MacBook Pro 14"',      'M3 Pro chip, Liquid Retina XDR display',             189999.00, 20,  1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 4.9),
(5,  'Men Cotton T-Shirt',   'Premium cotton, available in 10 colours',                599.00, 300, 2, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 4.3),
(6,  'Levi\'s 511 Jeans',   'Slim fit authentic stretch denim',                      2499.00, 150, 2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 4.5),
(7,  'Floral Summer Dress',  'Light chiffon, perfect for summer',                    1299.00, 80,  2, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 4.4),
(8,  'Atomic Habits',        'Tiny changes, remarkable results – James Clear',         499.00, 500, 3, 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400', 4.9),
(9,  'The Pragmatic Prog.',  'Every programmer must read – classic guide',             799.00, 200, 3, 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400', 4.8),
(10, 'Zero to One',          'Notes on Startups by Peter Thiel',                      499.00, 300, 3, 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400', 4.7),
(11, 'Smart LED Bulb',       'WiFi 10W, 16M colours, works with Alexa',               399.00, 500, 4, 'https://images.unsplash.com/photo-1563461660947-507ef49e9c47?w=400', 4.4),
(12, 'Yoga Mat Pro',         'Non-slip 6mm thick premium TPE mat',                   1499.00, 120, 5, 'https://images.unsplash.com/photo-1601925228925-c96ab44d68e5?w=400', 4.6),
(13, 'Adjustable Dumbbells', 'Bowflex SelectTech 552 – 5 to 52.5 lbs',              8999.00, 30,  5, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', 4.7),
(14, 'Running Shoes',        'Nike Air Zoom Pegasus 40, lightweight',                6999.00, 80,  5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 4.6);

-- Admin user  (password: Admin@123  – BCrypt hash)
INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES
(1, 'Admin', 'admin@ecommerce.com',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCkJ3Tl/ayvfAHRVwfRlZ1.',
 '9999999999', 'ADMIN');
