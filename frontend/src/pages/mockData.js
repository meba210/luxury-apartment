// ─────────────────────────────────────────────────────────────
// MILEVIA Estates — Mock data (no backend required)
// ─────────────────────────────────────────────────────────────

export const MOCK_CREDENTIALS = {
  admin:   { username: 'admin',   password: 'admin123' },
  partner: { email: 'partner@milevia.com', password: 'partner123' },
}

// ── Sales / Property records ──────────────────────────────────
export const MOCK_SALES = [
  { id: 1,  place: 'MEGENAGNA, TOP VIEW',    property_type: 'Duplex',     listing_status: 'active',     price_etb: 27999000, area_sqm: 201.00, bedrooms: 3, bathrooms: 3, floor: 10, total_floors: 15, agent_name: 'Biruk T.',   sold_date: null,         created_at: '2025-01-10' },
  { id: 2,  place: 'AYAT, ZONE 5',           property_type: 'Apartment',  listing_status: 'active',     price_etb: 11999000, area_sqm: 102.00, bedrooms: 2, bathrooms: 2, floor: 5,  total_floors: 12, agent_name: 'Lidya M.',   sold_date: null,         created_at: '2025-01-15' },
  { id: 3,  place: 'BOLE, ATLAS',            property_type: 'Apartment',  listing_status: 'active',     price_etb: 31999000, area_sqm: 170.00, bedrooms: 3, bathrooms: 3, floor: 14, total_floors: 20, agent_name: 'Samuel A.',  sold_date: null,         created_at: '2025-01-20' },
  { id: 4,  place: 'KAZANCHIS, ENAT BANK',   property_type: 'Penthouse',  listing_status: 'active',     price_etb: 69999000, area_sqm: 490.00, bedrooms: 4, bathrooms: 4, floor: 18, total_floors: 18, agent_name: 'Hana G.',    sold_date: null,         created_at: '2025-01-22' },
  { id: 5,  place: '6 KILLO, AAU',           property_type: 'Apartment',  listing_status: 'active',     price_etb: 11999000, area_sqm:  80.00, bedrooms: 2, bathrooms: 1, floor: 3,  total_floors: 10, agent_name: 'Biruk T.',   sold_date: null,         created_at: '2025-02-01' },
  { id: 6,  place: 'BOLE RWANDA',            property_type: 'Apartment',  listing_status: 'sold',       price_etb: 18500000, area_sqm: 130.00, bedrooms: 3, bathrooms: 2, floor: 12, total_floors: 20, agent_name: 'Lidya M.',   sold_date: '2025-03-15', created_at: '2025-01-05' },
  { id: 7,  place: 'SARBET',                 property_type: 'Villa',      listing_status: 'sold',       price_etb: 45000000, area_sqm: 320.00, bedrooms: 4, bathrooms: 4, floor: 1,  total_floors: 2,  agent_name: 'Samuel A.',  sold_date: '2025-02-20', created_at: '2024-12-10' },
  { id: 8,  place: 'CMC, MICHAEL',           property_type: 'Apartment',  listing_status: 'active',     price_etb:  9800000, area_sqm:  95.00, bedrooms: 2, bathrooms: 2, floor: 6,  total_floors: 14, agent_name: 'Hana G.',    sold_date: null,         created_at: '2025-02-05' },
  { id: 9,  place: 'MEXICO SQUARE',          property_type: 'Apartment',  listing_status: 'active',     price_etb: 13500000, area_sqm: 115.00, bedrooms: 2, bathrooms: 2, floor: 8,  total_floors: 18, agent_name: 'Biruk T.',   sold_date: null,         created_at: '2025-02-10' },
  { id: 10, place: 'SUMMIT, BOLE',           property_type: 'Duplex',     listing_status: 'pending',    price_etb: 22000000, area_sqm: 180.00, bedrooms: 3, bathrooms: 3, floor: 9,  total_floors: 12, agent_name: 'Lidya M.',   sold_date: null,         created_at: '2025-02-15' },
  { id: 11, place: 'GERJI, IMPERIAL',        property_type: 'Apartment',  listing_status: 'active',     price_etb:  8900000, area_sqm:  88.00, bedrooms: 2, bathrooms: 1, floor: 4,  total_floors: 10, agent_name: 'Samuel A.',  sold_date: null,         created_at: '2025-02-18' },
  { id: 12, place: 'LEBU, MEBRAT HAILE',     property_type: 'Apartment',  listing_status: 'sold',       price_etb:  7200000, area_sqm:  75.00, bedrooms: 2, bathrooms: 1, floor: 2,  total_floors: 8,  agent_name: 'Hana G.',    sold_date: '2025-04-01', created_at: '2025-01-28' },
  { id: 13, place: 'JEMO, SITE 1',           property_type: 'Apartment',  listing_status: 'active',     price_etb:  6500000, area_sqm:  70.00, bedrooms: 2, bathrooms: 1, floor: 3,  total_floors: 8,  agent_name: 'Biruk T.',   sold_date: null,         created_at: '2025-03-01' },
  { id: 14, place: 'BOLE, MEDHANIALEM',      property_type: 'Penthouse',  listing_status: 'active',     price_etb: 55000000, area_sqm: 380.00, bedrooms: 4, bathrooms: 4, floor: 20, total_floors: 20, agent_name: 'Lidya M.',   sold_date: null,         created_at: '2025-03-05' },
  { id: 15, place: 'KAZANCHIS, HILTON AREA', property_type: 'Apartment',  listing_status: 'active',     price_etb: 16800000, area_sqm: 125.00, bedrooms: 3, bathrooms: 2, floor: 11, total_floors: 16, agent_name: 'Samuel A.',  sold_date: null,         created_at: '2025-03-10' },
  { id: 16, place: 'BOLE WOLO SEFER',        property_type: 'Apartment',  listing_status: 'active',     price_etb: 15500000, area_sqm: 118.00, bedrooms: 3, bathrooms: 3, floor: 8,  total_floors: 15, agent_name: 'Hana G.',    sold_date: null,         created_at: '2025-03-12' },
  { id: 17, place: 'AYAT CMC',               property_type: 'Apartment',  listing_status: 'active',     price_etb: 12800000, area_sqm: 105.00, bedrooms: 3, bathrooms: 2, floor: 5,  total_floors: 12, agent_name: 'Biruk T.',   sold_date: null,         created_at: '2025-03-15' },
  { id: 18, place: 'SUMMIT AREA',            property_type: 'Townhouse',  listing_status: 'off-market', price_etb: 38000000, area_sqm: 260.00, bedrooms: 4, bathrooms: 3, floor: 1,  total_floors: 3,  agent_name: 'Lidya M.',   sold_date: null,         created_at: '2025-03-18' },
].map(s => ({
  ...s,
  per_sqm_birr: Math.round(s.price_etb / s.area_sqm),
}))

// ── Partner applications ──────────────────────────────────────
export const MOCK_PARTNERS = [
  { id: 1, full_name: 'Abebe Girma',    email: 'abebe@gmail.com',   phone: '+251 911 111 001', company: 'Girma Realty',      experience: '5-10 years',  message: 'I have been in real estate for 7 years and want to grow with MILEVIA.', status: 'approved', approved_at: '2025-02-01', created_at: '2025-01-25' },
  { id: 2, full_name: 'Tigist Haile',   email: 'tigist@yahoo.com',  phone: '+251 911 111 002', company: null,                experience: '1-3 years',   message: 'Looking to expand my network and earn commissions.',                    status: 'approved', approved_at: '2025-02-10', created_at: '2025-02-05' },
  { id: 3, full_name: 'Dawit Bekele',   email: 'dawit@outlook.com', phone: '+251 911 111 003', company: 'Bekele Properties', experience: '10+ years',   message: 'Senior agent with a large client base in Bole and Kazanchis.',         status: 'pending',  approved_at: null,         created_at: '2025-03-01' },
  { id: 4, full_name: 'Meron Tadesse',  email: 'meron@gmail.com',   phone: '+251 911 111 004', company: null,                experience: '0-1 years',   message: 'New to real estate but very motivated to learn and earn.',              status: 'pending',  approved_at: null,         created_at: '2025-03-10' },
  { id: 5, full_name: 'Yonas Alemu',    email: 'yonas@gmail.com',   phone: '+251 911 111 005', company: 'Alemu Group',       experience: '3-5 years',   message: 'I specialize in luxury properties and have strong connections.',        status: 'pending',  approved_at: null,         created_at: '2025-03-20' },
  { id: 6, full_name: 'Selam Worku',    email: 'selam@gmail.com',   phone: '+251 911 111 006', company: null,                experience: '1-3 years',   message: 'Interested in the buyer commission program.',                           status: 'rejected', approved_at: null,         created_at: '2025-02-20' },
  { id: 7, full_name: 'Henok Tesfaye',  email: 'henok@gmail.com',   phone: '+251 911 111 007', company: 'Tesfaye Estates',   experience: '5-10 years',  message: 'Experienced agent looking for a premium brand to partner with.',        status: 'approved', approved_at: '2025-03-05', created_at: '2025-02-28' },
]
