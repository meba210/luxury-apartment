-- Initialize Luxury Apartments Database
-- Run this file to set up the database from scratch

CREATE DATABASE IF NOT EXISTS luxury_apartments_db;
USE luxury_apartments_db;

-- ── Locations Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Apartments Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS apartments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  size_sqm DECIMAL(10,2),
  price_etb DECIMAL(15,2) NOT NULL,
  price_usd DECIMAL(10,2),
  location_id INT,
  floor INT,
  total_floors INT,
  amenities JSON DEFAULT '[]',
  images JSON DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- ── Inquiries Table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apartment_id INT,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
);

-- ── Admins Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Partners Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(200),
  experience VARCHAR(100),
  message TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Sales Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  place VARCHAR(200) NOT NULL,
  property_type VARCHAR(100) NOT NULL,
  listing_status VARCHAR(50) DEFAULT 'active',
  price_etb DECIMAL(15,2),
  area_sqm DECIMAL(10,2),
  per_sqm_birr DECIMAL(10,2),
  bedrooms INT,
  bathrooms INT,
  floor INT,
  total_floors INT,
  agent_name VARCHAR(200),
  sold_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Populate Locations (Insert Only If Empty) ───────────────
INSERT IGNORE INTO locations (id, name, description, image_url) VALUES
(1, 'Bole', 'The heart of modern Addis Ababa, home to the international airport and upscale neighborhoods', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800'),
(2, 'Megenagna', 'A vibrant commercial and residential hub with excellent connectivity', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'),
(3, 'Mexico', 'Central location with easy access to business districts and amenities', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'),
(4, 'Kazanchis', 'Prestigious neighborhood near embassies and international organizations', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'),
(5, 'CMC', 'Quiet residential area with modern developments and green spaces', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'),
(6, 'Sarbet', 'Upscale area known for luxury residences and fine dining', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800');

-- ── Create Default Admin (if doesn't exist) ──────────────────
INSERT IGNORE INTO admins (id, username, password_hash) VALUES
(1, 'admin', '$2a$10$YourHashedPasswordHere');
