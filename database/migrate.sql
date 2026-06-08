-- Update existing database to add missing columns and fix foreign key constraints
-- Run this if you have an existing database that needs to be updated

USE luxury_apartments_db;

-- Add JSON columns with defaults if they don't exist
ALTER TABLE apartments
  ADD COLUMN IF NOT EXISTS amenities JSON DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS images JSON DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;

-- Update existing JSON columns to use defaults (only affects new inserts)
ALTER TABLE apartments
  MODIFY COLUMN amenities JSON DEFAULT '[]',
  MODIFY COLUMN images JSON DEFAULT '[]';

-- Ensure locations has data
INSERT IGNORE INTO locations (id, name, description, image_url) VALUES
(1, 'Bole', 'The heart of modern Addis Ababa, home to the international airport and upscale neighborhoods', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800'),
(2, 'Megenagna', 'A vibrant commercial and residential hub with excellent connectivity', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'),
(3, 'Mexico', 'Central location with easy access to business districts and amenities', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'),
(4, 'Kazanchis', 'Prestigious neighborhood near embassies and international organizations', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'),
(5, 'CMC', 'Quiet residential area with modern developments and green spaces', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'),
(6, 'Sarbet', 'Upscale area known for luxury residences and fine dining', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800');

-- Fix foreign key if needed (drop and recreate)
-- First, get the constraint name and drop it
SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE apartments DROP FOREIGN KEY IF EXISTS apartments_ibfk_1;
ALTER TABLE apartments ADD CONSTRAINT apartments_ibfk_1 FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL;
SET FOREIGN_KEY_CHECKS = 1;

-- Add inquiry assignment and status fields
ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS assigned_to INT NULL,
  ADD COLUMN IF NOT EXISTS status ENUM('new','open','closed') DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS handled_at TIMESTAMP NULL;

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apartment_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  stars INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
);

