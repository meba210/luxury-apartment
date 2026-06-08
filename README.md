# Addis Luxury Residences

A full-stack luxury apartment showcase website for Addis Ababa, Ethiopia.

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Styling**: Custom CSS with Playfair Display & Inter fonts

## Color Scheme

| Color | Hex |
|-------|-----|
| Chocolate | `#3D1C02` / `#5C2D0A` |
| White | `#FFFFFF` |
| Light Brown | `#C4956A` / `#D4A574` |
| Gold Accent | `#B8860B` / `#DAA520` |

## Project Structure

```
luxury-apartments/
├── backend/          # Express.js API
├── frontend/         # React + Vite app
└── database/         # SQL schema & seed data
```

## Setup Instructions

### 1. Database Setup

Make sure MySQL is running, then import the schema:

```bash
mysql -u root -p < database/schema.sql
```

Or open MySQL Workbench / phpMyAdmin and run the contents of `database/schema.sql`.

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env` if needed (default: root user, no password, port 5000):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=luxury_apartments_db
PORT=5000
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/apartments` | List all apartments (supports filters) |
| GET | `/api/apartments/:id` | Get single apartment |
| GET | `/api/apartments/meta/locations` | List all locations |
| POST | `/api/inquiries` | Submit an inquiry |
| GET | `/api/inquiries` | List all inquiries (admin) |

### Apartment Filter Query Params

- `bedrooms` — Filter by bedroom count (2 or 3)
- `location_id` — Filter by location ID
- `min_price` — Minimum price in ETB
- `max_price` — Maximum price in ETB
- `featured` — Set to `true` for featured only

## Features

- **Home Page**: Hero section, featured apartments, location grid, stats, contact form
- **Apartments Page**: Full listing with filters (bedrooms, location, price range), apartment modal with image gallery
- **About Page**: Company story, mission/vision, values, team, why choose us
- **Contact Page**: Inquiry form, contact details, map placeholder
- **Responsive**: Mobile-first design, works on all screen sizes
- **Animations**: Smooth CSS transitions and entrance animations
- **Form Validation**: Client-side and server-side validation

## Neighborhoods Covered

Bole · Megenagna · Mexico · Kazanchis · CMC · Sarbet
