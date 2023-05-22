import pg from "pg";
import { config } from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from "path";
import { readFileSync } from "fs";
config();
const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: 'localhost',
  database: process.env.DB_NAME || 'moviedb',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function createTables() {
  try {
    const createQueries = readFileSync(__dirname + "/../sql/createTables.sql").toString().split(";");
    for (let i = 0; i < createQueries.length; i++) {
      try {
        await pool.query(createQueries[i]);
      } catch (e) {
        if (e.code != "42P07" && e.code != "23505") {
          console.log("Failed to create tables!");
          process.exit(1);
        }
      }
    }
    console.log("Tables created successfully (Only non exist tables created)");
  } catch (e) {
    console.log("Failed to create tables!");
    process.exit(1);
  }
}

export async function getManagerByUsername(username) {
  const query = `SELECT * FROM database_managers WHERE username='${username}'`;
  const result = await pool.query(query);
  return result.rows[0];
}

export async function addAudience(model) {
  const userQuery = `INSERT INTO Users (username, name, password, surname) VALUES ('${model.username}', '${model.name}', '${model.password}', '${model.surname}')`;
  const audienceQuery = `INSERT INTO Audiences (username) VALUES ('${model.username}');`
  const userResult = await pool.query(userQuery);
  const audienceResult = await pool.query(audienceQuery);
  var subscriptionQuery;
  for (let i = 0; i<model.ratingPlatforms.length; i++) {
    console.log(model.ratingPlatforms[i])
    subscriptionQuery = `INSERT INTO Subscriptions (username, platform_id) VALUES ('${model.username}', ${model.ratingPlatforms[i]})`
    try {
      await pool.query(subscriptionQuery);
    } catch(e) {
      console.log(e);
    }
  }
  console.log(userResult);
  console.log(audienceResult);
}



