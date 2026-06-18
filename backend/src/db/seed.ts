import pool from './connection';

async function seedDatabase() {
  try {
    console.log('Seeding database with sample courses...');

    // Sample courses data
    const courses = [
      {
        name: 'Pebble Beach Golf Links',
        location: 'Pebble Beach, California',
      },
      {
        name: 'Augusta National Golf Club',
        location: 'Augusta, Georgia',
      },
      {
        name: 'Bethpage Black',
        location: 'Farmingdale, New York',
      },
      {
        name: 'Torrey Pines Golf Course',
        location: 'San Diego, California',
      },
    ];

    for (const course of courses) {
      const courseResult = await pool.query(
        'INSERT INTO courses (name, location) VALUES ($1, $2) RETURNING id',
        [course.name, course.location]
      );

      const courseId = courseResult.rows[0].id;

      // Add tee boxes
      const teeBoxes = [
        { name: 'Blue Tees', color: 'blue', rating: 74.5, slope: 148 },
        { name: 'White Tees', color: 'white', rating: 72.0, slope: 140 },
        { name: 'Red Tees', color: 'red', rating: 70.5, slope: 130 },
      ];

      for (const teeBox of teeBoxes) {
        const teeBoxResult = await pool.query(
          'INSERT INTO tee_boxes (course_id, name, color, rating, slope) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [courseId, teeBox.name, teeBox.color, teeBox.rating, teeBox.slope]
        );

        const teeBoxId = teeBoxResult.rows[0].id;

        // Add sample holes (18 holes)
        const samplePars = [
          4, 5, 4, 4, 3, 5, 4, 3, 4, 4, 4, 5, 3, 4, 4, 5, 4, 5,
        ];

        for (let i = 0; i < samplePars.length; i++) {
          await pool.query(
            'INSERT INTO holes (tee_box_id, hole_number, par, yardage, handicap) VALUES ($1, $2, $3, $4, $5)',
            [
              teeBoxId,
              i + 1,
              samplePars[i],
              Math.floor(Math.random() * 200 + 300),
              Math.floor(Math.random() * 18 + 1),
            ]
          );
        }
      }
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default seedDatabase;
