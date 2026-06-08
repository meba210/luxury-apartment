CREATE DATABASE IF NOT EXISTS luxury_apartments_db;
USE luxury_apartments_db;

CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

ALTER TABLE apartments
  ADD COLUMN IF NOT EXISTS amenities JSON,
  ADD COLUMN IF NOT EXISTS images JSON,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apartment_id INT,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES apartments(id)
);

-- Insert locations
INSERT INTO locations (name, description, image_url) VALUES
('Bole', 'The heart of modern Addis Ababa, home to the international airport and upscale neighborhoods', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800'),
('Megenagna', 'A vibrant commercial and residential hub with excellent connectivity', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'),
('Mexico', 'Central location with easy access to business districts and amenities', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'),
('Kazanchis', 'Prestigious neighborhood near embassies and international organizations', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'),
('CMC', 'Quiet residential area with modern developments and green spaces', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'),
('Sarbet', 'Upscale area known for luxury residences and fine dining', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800');

-- Insert apartments
INSERT INTO apartments (title, description, bedrooms, bathrooms, size_sqm, price_etb, price_usd, location_id, floor, total_floors, amenities, images, is_featured, is_available) VALUES
('Bole Luxury Residence 2BR', 'Stunning 2-bedroom apartment in the heart of Bole with panoramic city views. Features premium finishes, open-plan living, and access to world-class amenities.', 2, 2, 120.00, 8500000, 15000, 1, 12, 20, '["Swimming Pool","Gym","24/7 Security","Parking","Concierge","Rooftop Terrace","High-Speed Internet","Backup Generator"]', '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800","https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]', TRUE, TRUE),

('Bole Premium 3BR Penthouse', 'Exclusive 3-bedroom penthouse with private terrace overlooking Addis Ababa. Designed for the discerning resident who demands only the finest.', 3, 3, 210.00, 15000000, 26500, 1, 20, 20, '["Private Terrace","Swimming Pool","Gym","24/7 Security","Valet Parking","Concierge","Smart Home System","Wine Cellar","Jacuzzi"]', '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800","https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]', TRUE, TRUE),

('Megenagna Elite 2BR', 'Modern 2-bedroom apartment in Megenagna with stunning views and premium amenities. Perfect for professionals and families.', 2, 2, 105.00, 7200000, 12700, 2, 8, 15, '["Swimming Pool","Gym","24/7 Security","Parking","Concierge","High-Speed Internet","Backup Generator","Children Playground"]', '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800","https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"]', FALSE, TRUE),

('Megenagna Grand 3BR', 'Spacious 3-bedroom apartment offering luxury living in one of Addis Ababa most sought-after locations.', 3, 2, 175.00, 12500000, 22000, 2, 10, 15, '["Swimming Pool","Gym","24/7 Security","Parking","Concierge","Rooftop Garden","High-Speed Internet","Backup Generator","Sauna"]', '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]', TRUE, TRUE),

('Mexico Square 2BR Deluxe', 'Centrally located 2-bedroom deluxe apartment with easy access to business districts. Ideal for executives and diplomats.', 2, 2, 115.00, 7800000, 13800, 3, 6, 18, '["Swimming Pool","Gym","24/7 Security","Parking","Business Center","High-Speed Internet","Backup Generator","Laundry Service"]', '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800","https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800","https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]', FALSE, TRUE),

('Mexico Premium 3BR', 'Prestigious 3-bedroom apartment in Mexico area with sophisticated design and premium facilities.', 3, 3, 190.00, 13800000, 24400, 3, 14, 18, '["Swimming Pool","Gym","24/7 Security","Valet Parking","Concierge","Rooftop Terrace","Smart Home System","High-Speed Internet","Backup Generator"]', '["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]', TRUE, TRUE),

('Kazanchis Diplomat 2BR', 'Elegant 2-bedroom apartment in the prestigious Kazanchis neighborhood, favored by diplomats and executives.', 2, 2, 130.00, 9200000, 16200, 4, 9, 16, '["Swimming Pool","Gym","24/7 Security","Parking","Concierge","High-Speed Internet","Backup Generator","Meeting Rooms"]', '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800","https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800","https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]', FALSE, TRUE),

('Kazanchis Royal 3BR', 'Magnificent 3-bedroom royal apartment with embassy-district prestige and unmatched luxury amenities.', 3, 3, 220.00, 16500000, 29100, 4, 15, 16, '["Private Pool","Gym","24/7 Security","Valet Parking","Butler Service","Rooftop Terrace","Smart Home System","Wine Cellar","Jacuzzi","Sauna"]', '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]', TRUE, TRUE),

('CMC Serene 2BR', 'Peaceful 2-bedroom apartment in CMC with green surroundings and modern amenities. Perfect for families.', 2, 2, 110.00, 6800000, 12000, 5, 5, 12, '["Swimming Pool","Gym","24/7 Security","Parking","Children Playground","Garden","High-Speed Internet","Backup Generator"]', '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800","https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800","https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"]', FALSE, TRUE),

('CMC Garden 3BR', 'Spacious 3-bedroom garden apartment in CMC with private garden access and family-friendly amenities.', 3, 2, 165.00, 11200000, 19800, 5, 3, 12, '["Private Garden","Swimming Pool","Gym","24/7 Security","Parking","Children Playground","BBQ Area","High-Speed Internet","Backup Generator"]', '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]', FALSE, TRUE),

('Sarbet Elite 2BR', 'Sophisticated 2-bedroom apartment in upscale Sarbet, surrounded by fine dining and luxury boutiques.', 2, 2, 125.00, 8900000, 15700, 6, 7, 14, '["Swimming Pool","Gym","24/7 Security","Parking","Concierge","Rooftop Bar","High-Speed Internet","Backup Generator","Spa"]', '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800","https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800","https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"]', FALSE, TRUE),

('Sarbet Prestige 3BR', 'The pinnacle of luxury living in Sarbet. This 3-bedroom masterpiece redefines sophisticated urban living in Addis Ababa.', 3, 3, 200.00, 14500000, 25600, 6, 12, 14, '["Swimming Pool","Gym","24/7 Security","Valet Parking","Concierge","Rooftop Terrace","Smart Home System","Spa","Wine Cellar","Jacuzzi","Sauna"]', '["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]', TRUE, TRUE);
