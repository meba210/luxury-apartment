-- ============================================================
-- MILEVIA Estates — Partner & Sales Schema
-- Run this AFTER the main schema.sql
-- ============================================================

USE luxury_apartments_db;

-- ── Partners (sales agents who register to join) ──────────────
CREATE TABLE IF NOT EXISTS partners (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(200) NOT NULL,
  email         VARCHAR(200) NOT NULL UNIQUE,
  phone         VARCHAR(50)  NOT NULL,
  company       VARCHAR(200),
  experience    VARCHAR(100),
  message       TEXT,
  password_hash VARCHAR(255) NOT NULL,
  status        ENUM('pending','approved','rejected') DEFAULT 'pending',
  approved_at   TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Admin users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin: username=admin  password=admin123
INSERT IGNORE INTO admins (username, password_hash)
VALUES ('admin', 'admin123');
-- NOTE: The plain-text password is auto-upgraded to bcrypt on first login.

-- ── Sales / Sold listings (visible to approved partners) ──────
CREATE TABLE IF NOT EXISTS sales (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  place           VARCHAR(200) NOT NULL,
  property_type   ENUM('Apartment','Duplex','Penthouse','Villa','Townhouse','Commercial','Land') NOT NULL,
  listing_status  ENUM('active','sold','pending','off-market') DEFAULT 'active',
  price_etb       DECIMAL(15,2) NOT NULL,
  area_sqm        DECIMAL(10,2) NOT NULL,
  per_sqm_birr    DECIMAL(10,2) GENERATED ALWAYS AS (ROUND(price_etb / area_sqm, 0)) STORED,
  bedrooms        INT,
  bathrooms       INT,
  floor           INT,
  total_floors    INT,
  agent_name      VARCHAR(200),
  sold_date       DATE,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Seed sample sales data ─────────────────────────────────────
INSERT INTO sales (place, property_type, listing_status, price_etb, area_sqm, bedrooms, bathrooms, floor, total_floors, agent_name, sold_date) VALUES
('MEGENAGNA, TOP VIEW',    'Duplex',     'active',  27999000, 201.00, 3, 3, 10, 15, 'Biruk T.',   NULL),
('AYAT, ZONE 5',           'Apartment',  'active',  11999000, 102.00, 2, 2,  5, 12, 'Lidya M.',   NULL),
('BOLE, ATLAS',            'Apartment',  'active',  31999000, 170.00, 3, 3, 14, 20, 'Samuel A.',  NULL),
('KAZANCHIS, ENAT BANK',   'Penthouse',  'active',  69999000, 490.00, 4, 4, 18, 18, 'Hana G.',    NULL),
('6 KILLO, AAU',           'Apartment',  'active',  11999000,  80.00, 2, 1,  3, 10, 'Biruk T.',   NULL),
('BOLE RWANDA',            'Apartment',  'sold',    18500000, 130.00, 3, 2, 12, 20, 'Lidya M.',   '2025-03-15'),
('SARBET',                 'Villa',      'sold',    45000000, 320.00, 4, 4,  1,  2, 'Samuel A.',  '2025-02-20'),
('CMC, MICHAEL',           'Apartment',  'active',   9800000,  95.00, 2, 2,  6, 14, 'Hana G.',    NULL),
('MEXICO SQUARE',          'Apartment',  'active',  13500000, 115.00, 2, 2,  8, 18, 'Biruk T.',   NULL),
('SUMMIT, BOLE',           'Duplex',     'pending', 22000000, 180.00, 3, 3,  9, 12, 'Lidya M.',   NULL),
('GERJI, IMPERIAL',        'Apartment',  'active',   8900000,  88.00, 2, 1,  4, 10, 'Samuel A.',  NULL),
('LEBU, MEBRAT HAILE',     'Apartment',  'sold',     7200000,  75.00, 2, 1,  2,  8, 'Hana G.',    '2025-04-01'),
('JEMO, SITE 1',           'Apartment',  'active',   6500000,  70.00, 2, 1,  3,  8, 'Biruk T.',   NULL),
('BOLE, MEDHANIALEM',      'Penthouse',  'active',  55000000, 380.00, 4, 4, 20, 20, 'Lidya M.',   NULL),
('KAZANCHIS, HILTON AREA', 'Apartment',  'active',  16800000, 125.00, 3, 2, 11, 16, 'Samuel A.',  NULL);
