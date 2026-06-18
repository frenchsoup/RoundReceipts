import pool from './connection';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('Seeding database with sample courses and test data...');

    // ===== SEED COURSES & TEES =====
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

    const courseIds: string[] = [];

    for (const course of courses) {
      const courseResult = await pool.query(
        'INSERT INTO courses (name, location) VALUES ($1, $2) RETURNING id',
        [course.name, course.location]
      );

      const courseId = courseResult.rows[0].id;
      courseIds.push(courseId);

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

    // ===== SEED SAMPLE USERS =====
    console.log('Creating sample golfers...');
    
    const testUsers = [
      {
        username: 'tiger',
        email: 'tiger@example.com',
        password: 'password123',
        first_name: 'Tiger',
        last_name: 'Woods',
      },
      {
        username: 'rory',
        email: 'rory@example.com',
        password: 'password123',
        first_name: 'Rory',
        last_name: 'McIlroy',
      },
      {
        username: 'dustin',
        email: 'dustin@example.com',
        password: 'password123',
        first_name: 'Dustin',
        last_name: 'Johnson',
      },
      {
        username: 'brooks',
        email: 'brooks@example.com',
        password: 'password123',
        first_name: 'Brooks',
        last_name: 'Koepka',
      },
    ];

    const userIds: { [key: string]: string } = {};

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [user.username, user.email, hashedPassword, user.first_name, user.last_name]
      );
      userIds[user.username] = result.rows[0].id;
    }

    // ===== SEED FRIENDSHIPS =====
    console.log('Creating friendships...');
    
    const friendshipPairs = [
      ['tiger', 'rory'],
      ['tiger', 'dustin'],
      ['rory', 'dustin'],
      ['dustin', 'brooks'],
      ['rory', 'brooks'],
    ];

    for (const [user1, user2] of friendshipPairs) {
      await pool.query(
        'INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, $3)',
        [userIds[user1], userIds[user2], 'confirmed']
      );
      // Add reverse friendship
      await pool.query(
        'INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, $3)',
        [userIds[user2], userIds[user1], 'confirmed']
      );
    }

    // ===== SEED SAMPLE ROUNDS & SCORES =====
    console.log('Creating sample rounds with scores...');

    const teeBoxResult = await pool.query(
      'SELECT id FROM tee_boxes WHERE color = $1 LIMIT 1',
      ['white']
    );
    const teeBoxId = teeBoxResult.rows[0].id;

    // Get holes for scoring
    const holesResult = await pool.query(
      'SELECT id, hole_number, par FROM holes WHERE tee_box_id = $1 ORDER BY hole_number',
      [teeBoxId]
    );
    const holes = holesResult.rows;

    // Create 3 sample rounds with different participants
    const roundConfigs = [
      {
        participants: ['tiger', 'rory', 'dustin'],
        courseId: courseIds[0],
        scores: {
          tiger: [4, 5, 4, 3, 3, 5, 4, 3, 4, 4, 4, 5, 3, 4, 4, 5, 4, 5],
          rory: [4, 6, 4, 4, 3, 5, 5, 3, 4, 5, 4, 5, 3, 4, 4, 5, 4, 6],
          dustin: [5, 5, 4, 4, 4, 5, 4, 3, 4, 4, 5, 6, 3, 4, 5, 6, 4, 5],
        },
      },
      {
        participants: ['rory', 'brooks'],
        courseId: courseIds[1],
        scores: {
          rory: [4, 5, 4, 3, 3, 5, 4, 3, 4, 4, 4, 5, 2, 4, 4, 5, 4, 5],
          brooks: [4, 5, 4, 4, 3, 5, 4, 4, 4, 4, 4, 5, 3, 5, 4, 6, 4, 5],
        },
      },
      {
        participants: ['tiger', 'dustin', 'brooks'],
        courseId: courseIds[2],
        scores: {
          tiger: [4, 5, 4, 3, 3, 5, 4, 3, 4, 4, 4, 5, 3, 4, 4, 5, 4, 5],
          dustin: [4, 5, 5, 3, 3, 6, 4, 3, 4, 4, 5, 5, 3, 4, 4, 5, 4, 5],
          brooks: [5, 5, 4, 4, 3, 5, 4, 3, 5, 4, 4, 5, 3, 4, 4, 5, 4, 5],
        },
      },
    ];

    for (const roundConfig of roundConfigs) {
      // Create round
      const roundResult = await pool.query(
        'INSERT INTO rounds (course_id, tee_box_id, scorekeeper_id, holes_played, status, created_at, completed_at) VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL \'1 day\', NOW() - INTERVAL \'1 day\') RETURNING id',
        [
          roundConfig.courseId,
          teeBoxId,
          userIds[roundConfig.participants[0]],
          18,
          'completed',
        ]
      );
      const roundId = roundResult.rows[0].id;

      // Add participants
      for (const username of roundConfig.participants) {
        await pool.query(
          'INSERT INTO round_participants (round_id, user_id, status) VALUES ($1, $2, $3)',
          [roundId, userIds[username], 'confirmed']
        );
      }

      // Add scores for each participant
      for (const username of roundConfig.participants) {
        const userScores = roundConfig.scores[username as keyof typeof roundConfig.scores];
        for (let i = 0; i < holes.length; i++) {
          await pool.query(
            'INSERT INTO scores (round_id, hole_id, user_id, score) VALUES ($1, $2, $3, $4)',
            [roundId, holes[i].id, userIds[username], userScores[i]]
          );
        }
      }

      // Calculate round results and update rivalries
      const participantIds = roundConfig.participants.map((u) => userIds[u]);
      
      // For each pair of participants, update their rivalry
      for (let i = 0; i < participantIds.length; i++) {
        for (let j = i + 1; j < participantIds.length; j++) {
          const user1Id = participantIds[i];
          const user2Id = participantIds[j];
          const user1Total = roundConfig.scores[roundConfig.participants[i] as keyof typeof roundConfig.scores].reduce((a, b) => a + b, 0);
          const user2Total = roundConfig.scores[roundConfig.participants[j] as keyof typeof roundConfig.scores].reduce((a, b) => a + b, 0);

          // Determine winner
          let winsUser1 = 0,
            winsUser2 = 0,
            ties = 0;
          if (user1Total < user2Total) {
            winsUser1 = 1;
          } else if (user2Total < user1Total) {
            winsUser2 = 1;
          } else {
            ties = 1;
          }

          const scoreDiff = user1Total - user2Total;

          // Create or update rivalry
          await pool.query(
            `INSERT INTO rivalries (user_id_1, user_id_2, wins_user_1, wins_user_2, ties, total_score_diff_user_1, rounds_played, last_round_date, last_winner_id)
             VALUES ($1, $2, $3, $4, $5, $6, 1, NOW(), $7)
             ON CONFLICT (user_id_1, user_id_2) DO UPDATE SET
             wins_user_1 = rivalries.wins_user_1 + $3,
             wins_user_2 = rivalries.wins_user_2 + $4,
             ties = rivalries.ties + $5,
             total_score_diff_user_1 = rivalries.total_score_diff_user_1 + $6,
             rounds_played = rivalries.rounds_played + 1,
             last_round_date = NOW(),
             last_winner_id = $7`,
            [
              user1Id,
              user2Id,
              winsUser1,
              winsUser2,
              ties,
              scoreDiff,
              user1Total < user2Total ? user1Id : user2Total < user1Total ? user2Id : null,
            ]
          );
        }
      }
    }

    console.log('✅ Database seeding completed with test data!');
    console.log('\n📱 Test Accounts:');
    testUsers.forEach(user => {
      console.log(`  • Username: ${user.username}, Password: ${user.password}`);
    });
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
