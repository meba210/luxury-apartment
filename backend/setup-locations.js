const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupLocations() {
  try {
    console.log('Starting location setup...');
    console.log(`Connecting to ${process.env.DB_HOST}...`);

    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'luxury_apartments_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Insert locations with INSERT IGNORE to avoid duplicates
    const locations = [
      [
        'Bole',
        'The heart of modern Addis Ababa, home to the international airport and upscale neighborhoods',
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
      ],
      [
        'Megenagna',
        'A vibrant commercial and residential hub with excellent connectivity',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      ],
      [
        'Mexico',
        'Central location with easy access to business districts and amenities',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      ],
      [
        'Kazanchis',
        'Prestigious neighborhood near embassies and international organizations',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
      [
        'CMC',
        'Quiet residential area with modern developments and green spaces',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
      [
        'Sarbet',
        'Upscale area known for luxury residences and fine dining',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      ],
      [
        '6 Killo',
        'Vibrant neighborhood with shopping centers, restaurants, and modern residential buildings',
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
      ],
      [
        'Arada',
        'Historic commercial and residential area with excellent accessibility',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      ],
      [
        'Piazza',
        'Central business district with diverse amenities and urban lifestyle',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      ],
      [
        'Nifas Silk',
        'Growing residential area with modern developments and family-friendly atmosphere',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
      [
        'Ayat',
        'Peaceful residential location with convenient access to business areas',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
      [
        'Gerji',
        'Developing neighborhood with modern commercial and residential complexes',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      ],
      [
        'Lebu',
        'Quiet and safe residential area ideal for families and professionals',
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
      ],
      [
        'Lideta',
        'Accessible location with diverse commercial and residential options',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      ],
      [
        'Atlas',
        'Premium residential area with modern amenities and luxury apartments',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      ],
      [
        'Old Airport',
        'Well-developed area with good infrastructure and accessibility',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
      [
        'Jemo',
        'Residential neighborhood with growing commercial development',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
      [
        'Bole Wolo Sefer',
        'Upscale residential zone with modern buildings and premium facilities',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      ],
      [
        'Hilton Area',
        'Prime location near major business centers and hospitality district',
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
      ],
      [
        'Summit',
        'Modern residential complex with comprehensive amenities and security',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      ],
    ];

    // Delete existing locations to ensure fresh data
    await pool.execute('DELETE FROM locations');
    console.log('Cleared existing locations');

    // Insert all locations
    for (const [name, description, imageUrl] of locations) {
      await pool.execute(
        'INSERT INTO locations (name, description, image_url) VALUES (?, ?, ?)',
        [name, description, imageUrl]
      );
      console.log(`✓ Added location: ${name}`);
    }

    // Verify
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM locations'
    );
    console.log(
      `\n✅ Successfully added ${rows[0].count} locations to the database!`
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up locations:', error);
    process.exit(1);
  }
}

setupLocations();
