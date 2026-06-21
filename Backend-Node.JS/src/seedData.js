import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { sequelize } = db;

async function resetAndSeedDatabase() {
  try {
    console.log('=== Starting Database Reset and Seeding ===');

    // 1. Disable foreign key checks to allow dropping tables cleanly
    console.log('Disabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 2. Drop and recreate all tables
    console.log('Dropping and recreating all tables from models...');
    await sequelize.sync({ force: true });
    console.log('Database tables successfully dropped and recreated.');

    // 3. Read the SQL dump file
    const sqlFilePath = path.join(__dirname, '../sern-mysql.sql');
    console.log(`Reading SQL dump file from: ${sqlFilePath}`);
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found at path: ${sqlFilePath}`);
    }
    const sqlText = fs.readFileSync(sqlFilePath, 'utf8');

    // 4. Parse SQL dump file into executable queries
    console.log('Parsing SQL dump file...');
    const queries = [];
    let currentQuery = '';
    let inString = false;
    let stringChar = null;
    let escape = false;

    for (let i = 0; i < sqlText.length; i++) {
      const char = sqlText[i];

      if (escape) {
        currentQuery += char;
        escape = false;
        continue;
      }

      if (char === '\\') {
        currentQuery += char;
        escape = true;
        continue;
      }

      if (char === "'" || char === '"' || char === '`') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = null;
        }
        currentQuery += char;
        continue;
      }

      if (char === ';' && !inString) {
        queries.push(currentQuery.trim());
        currentQuery = '';
        continue;
      }

      currentQuery += char;
    }

    if (currentQuery.trim()) {
      queries.push(currentQuery.trim());
    }

    // Filter out comments and empty queries
    const executableQueries = queries
      .map(q => q.trim())
      .filter(q => {
        if (!q) return false;
        const lines = q.split('\n').map(line => line.trim());
        const nonCommentLines = lines.filter(line => line.length > 0 && !line.startsWith('--') && !line.startsWith('/*'));
        return nonCommentLines.length > 0;
      });

    console.log(`Successfully parsed ${executableQueries.length} query statements.`);

    // 5. Execute all queries sequentially
    console.log('Inserting seed data into the database...');
    for (let i = 0; i < executableQueries.length; i++) {
      const query = executableQueries[i];
      try {
        await sequelize.query(query);
      } catch (err) {
        console.error(`\nError executing query #${i + 1}:`);
        console.error(query.substring(0, 300) + (query.length > 300 ? '...' : ''));
        throw err;
      }
    }
    console.log('Seed data successfully imported.');

    // 6. Re-enable foreign key checks
    console.log('Re-enabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('=== Database Reset and Seeding Completed Successfully! ===');
    process.exit(0);
  } catch (error) {
    console.error('\n!!! Database seeding failed !!!');
    console.error(error);
    
    // Attempt to re-enable foreign key checks on error
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    } catch (_) {}
    
    process.exit(1);
  }
}

resetAndSeedDatabase();
