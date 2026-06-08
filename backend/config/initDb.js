const pool = require('./db');

/**
 * Initialize database with required tables and data
 * Runs on server startup to ensure locations exist
 */
async function initializeDatabase() {
  try {
    // Ensure locations table exists and has data
    const [locations] = await pool.execute(
      'SELECT COUNT(*) as count FROM locations'
    );

    if (locations[0].count === 0) {
      console.log('📍 Initializing locations...');

      const locationData = [
        {
          id: 1,
          name: 'Bole',
          description:
            'The heart of modern Addis Ababa, home to the international airport and upscale neighborhoods',
          image_url:
            'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
        },
        {
          id: 2,
          name: 'Megenagna',
          description:
            'A vibrant commercial and residential hub with excellent connectivity',
          image_url:
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        },
        {
          id: 3,
          name: 'Mexico',
          description:
            'Central location with easy access to business districts and amenities',
          image_url:
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        },
        {
          id: 4,
          name: 'Kazanchis',
          description:
            'Prestigious neighborhood near embassies and international organizations',
          image_url:
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        },
        {
          id: 5,
          name: 'CMC',
          description:
            'Quiet residential area with modern developments and green spaces',
          image_url:
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        },
        {
          id: 6,
          name: 'Sarbet',
          description:
            'Upscale area known for luxury residences and fine dining',
          image_url:
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
        },
      ];

      for (const loc of locationData) {
        await pool.execute(
          'INSERT IGNORE INTO locations (id, name, description, image_url) VALUES (?, ?, ?, ?)',
          [loc.id, loc.name, loc.description, loc.image_url]
        );
      }

      console.log('✅ Locations initialized successfully');
    } else {
      console.log(
        `✅ Locations table ready (${locations[0].count} locations found)`
      );
    }
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    // Don't crash the server, just log the error
  }
}

module.exports = initializeDatabase;
