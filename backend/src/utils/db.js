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

async function getManagerByUsername(username) {
  const query = `SELECT * FROM database_managers WHERE username='${username}'`;
  const result = await pool.query(query);
  return result.rows[0];
}

async function addAudience(model) {
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

async function addDirector(model) {
  const userQuery = `INSERT INTO Users (username, name, password, surname) VALUES ('${model.username}', '${model.name}', '${model.password}', '${model.surname}')`;
  var directorQuery;
  if (model.platform_id) {
    directorQuery = `INSERT INTO Directors (username, nation, platform_id) VALUES ('${model.username}', '${model.nation}', ${model.platform_id})`;
  } else {
    directorQuery = `INSERT INTO Directors (username, nation) VALUES ('${model.username}', '${model.nation}')`;
  }
  const userResult = await pool.query(userQuery);
  const directorResult = await pool.query(directorQuery);
}

async function deleteAudience(username) {
  const deleteQuery = `DELETE FROM users WHERE username='${username}'`;
  const deleteResult = await pool.query(deleteQuery);
  return deleteResult.rowCount;
}

async function updatePlatformId(username, platform_id) {
  const updateQuery = `UPDATE directors SET platform_id = '${platform_id}' WHERE username = '${username}'`;
  const updateResult = await pool.query(updateQuery);
  return updateResult.rowCount;
}

async function listDirectors() {
  const directorQuery = `SELECT directors.username, name, surname, nation, platform_id FROM users 
    INNER JOIN directors ON directors.username = users.username`;
  const directors = await pool.query(directorQuery);
  return directors.rows;
}

async function getRatings(username) {
  const ratingsQuery = `SELECT movies.movie_id, movie_name, rating FROM ratings 
    INNER JOIN movies ON movies.movie_id = ratings.movie_id WHERE username = '${username}'`;
  const ratingsResult = await pool.query(ratingsQuery);
  return ratingsResult.rows;
}

async function getMovieSessionsByDirector(username) {
  const movieSessionsQuery = `SELECT movies.movie_id, movie_name, theatres.theatre_id, theatre_district, time_slot FROM movie_sessions 
    INNER JOIN movies ON movies.movie_id = movie_sessions.movie_id
    INNER JOIN theatres ON theatres.theatre_id = movie_sessions.theatre_id WHERE movies.director_username = '${username}'`;
  const movieSessionsResult = await pool.query(movieSessionsQuery);
  return movieSessionsResult.rows;
}
export default {
  addAudience,
  addDirector,
  getManagerByUsername,
  deleteAudience,
  updatePlatformId,
  listDirectors,
  getRatings,
  getMovieSessionsByDirector
};

