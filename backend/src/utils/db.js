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
export async function createTrigger() {
  const query = `CREATE OR REPLACE FUNCTION calculate_average_rating()
  RETURNS TRIGGER AS
$$
DECLARE
    count INTEGER;
    sum REAL;
    average REAL;
BEGIN
    SELECT COUNT(*) INTO count FROM ratings WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id);
    SELECT SUM(rating) INTO sum FROM ratings WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id);
    
    IF count > 0 THEN
        average := sum / count;
    ELSE
        average := 0;
    END IF;
    
    UPDATE movies SET average_rating = average WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id);
    
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER rating_trigger
  AFTER INSERT OR DELETE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION calculate_average_rating();`
  try {
    await pool.query(query);
  } catch(e) {
    if (e.code != "42710") {
      console.log("Failed to create trigger!");
      process.exit(1);
    }
  }
  console.log("Trigger created successfully (if not exists)");
}
async function getManagerByUsername(username) {
  const query = `SELECT * FROM database_managers WHERE username='${username}'`;
  const result = await pool.query(query);
  return result.rows[0];
}

async function getDirectorByUsername(username) {
  const query = `SELECT * FROM directors
    INNER JOIN users ON users.username = directors.username
    WHERE users.username='${username}'`;
  const result = await pool.query(query);
  return result.rows[0];
}

async function getAudienceByUsername(username) {
  const query = `SELECT * FROM audiences
    INNER JOIN users ON users.username = audiences.username
    WHERE users.username='${username}'`;
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

async function getAverageRatingByMovie(movie_id) {
  const ratingQuery = `SELECT movie_id, movie_name, average_rating FROM movies WHERE movie_id = '${movie_id}'`;
  const ratingResult = await pool.query(ratingQuery);
  return ratingResult.rows;
}

async function getTicketsByUsername(username) {
  const query = `SELECT movies.movie_id, movie_name, tickets.session_id, rating, average_rating FROM tickets
    INNER JOIN movie_sessions ON movie_sessions.session_id = tickets.session_id
    INNER JOIN movies ON movies.movie_id = movie_sessions.movie_id
    LEFT JOIN ratings ON ratings.username = tickets.username AND ratings.movie_id = movies.movie_id
    WHERE tickets.username = '${username}'`;
  const ticketsResult = await pool.query(query);
  return ticketsResult.rows;
}

async function addTicketByUsernameAndSessionId(username, session_id) {
  const query = `INSERT INTO Tickets (username, session_id) VALUES ('${username}', ${session_id})`;
  const addTicketResult = await pool.query(query);
}

async function getPredecessorMovies(session_id) {
  const query = `SELECT DISTINCT precedes.predecessor_movie_id FROM movie_sessions
    INNER JOIN movies ON movies.movie_id = movie_sessions.movie_id
    INNER JOIN precedes ON precedes.ancestor_movie_id = movies.movie_id
    WHERE movie_sessions.session_id = ${session_id}`
  const queryResult = await pool.query(query);
  return queryResult.rows;
}

async function getPredecessorMoviesByMovieId(movie_id) {
  const query = `SELECT predecessor_movie_id FROM precedes
    WHERE ancestor_movie_id = ${movie_id}`
  const queryResult = await pool.query(query);
  return queryResult.rows;
}

async function getTicketsForMovieByUsername(username, movie_id) {
  const query = `SELECT date, time_slot FROM tickets
    INNER JOIN movie_sessions ON movie_sessions.session_id = tickets.session_id
    WHERE movie_sessions.movie_id = ${movie_id} AND tickets.username = '${username}'`;
    console.log(query);
  const queryResult = await pool.query(query);
  return queryResult.rows;
}

async function getSessionBySessionId(session_id) {
  const query = `SELECT * FROM movie_sessions
    INNER JOIN theatres ON theatres.theatre_id = movie_sessions.theatre_id
    WHERE session_id = ${session_id}`;
  const queryResult = await pool.query(query);
  return queryResult.rows;
}
async function getMovieByMovieId(movie_id) {
  const query = `SELECT * FROM movies WHERE movie_id = ${movie_id}`;
  const queryResult = await pool.query(query);
  return queryResult.rows[0];
}
async function getTicketCountBySessionId(session_id) {
  const query = `SELECT COUNT(*) FROM tickets
    WHERE session_id = ${session_id}`;
  const queryResult = await pool.query(query);
  return queryResult.rows;
}

async function getMovieSessions() {
  const query = `SELECT movie_sessions.movie_id, movie_name, surname as "director's surname", platform_name, theatre_id, time_slot FROM movie_sessions
    INNER JOIN movies ON movies.movie_id = movie_sessions.movie_id
    INNER JOIN users ON users.username = movies.director_username
    INNER JOIN directors ON directors.username = movies.director_username
    INNER JOIN rating_platforms ON rating_platforms.platform_id = directors.platform_id`;
    const queryResult = await pool.query(query);
    return queryResult.rows;
}

async function rateMovie(username, movie_id, rating) {
  const query = `INSERT INTO Ratings (username, movie_id, rating) VALUES ('${username}', ${movie_id}, ${rating})`;
  const queryResult = await pool.query(query);
}

async function checkIsSubscribed(username, platform_id) {
  const query = `SELECT * FROM subscriptions WHERE username = '${username}' AND platform_id = ${platform_id}`;
  const queryResult = await pool.query(query);
  console.log(queryResult.rows);
  if (queryResult.rowCount) {
    return true;
  }
  return false;
}
async function checkHasTicket(username, movie_id) {
  const query = `SELECT * FROM tickets
    INNER JOIN movie_sessions ON movie_sessions.session_id = tickets.session_id
    WHERE username = '${username}' AND movie_id = ${movie_id}`;
  const queryResult = await pool.query(query);
  console.log(queryResult.rows);
  if (queryResult.rowCount) {
    return true;
  }
  return false;
}

async function getPlatformOfMovieByMovieId(movie_id) {
  const query = `SELECT platform_id FROM movies 
    INNER JOIN directors ON directors.username = movies.director_username
    WHERE movies.movie_id = '${movie_id}'`;
  const queryResult = await pool.query(query);
  console.log(queryResult.rows);
  return queryResult.rows;
}
async function getTheatresByTimeSlot(time_slot, date){
  const query = `SELECT theatre_id, theatre_district, theatre_capacity FROM theatres
  WHERE theatre_id NOT IN(
    SELECT theatres.theatre_id FROM theatres
    INNER JOIN movie_sessions ON  movie_sessions.theatre_id = theatres.theatre_id 
    WHERE movie_sessions.time_slot = ${time_slot} AND movie_sessions.date = '${date}'
  )`
  console.log(date)
  const queryResult = await pool.query(query);
  
  console.log(queryResult.rows);
  return queryResult.rows;
}

async function addMovie(username, model){
  const add_movie_query = `INSERT INTO movies (movie_id, movie_name, director_username, duration) VALUES (${model.movie_id}, '${model.movie_name}', '${username}', ${model.duration})`;
  const add_session_query = `INSERT INTO movie_sessions (session_id, time_slot, movie_id, date, theatre_id) VALUES (${model.session_id}, ${model.time_slot}, ${model.movie_id}, '${model.date}', ${model.theatre_id})`;
  await pool.query(add_movie_query);
  await pool.query(add_session_query);
}

async function addPredecessor(predecessor_movie_id, ancestor_movie_id){
  const query = `INSERT INTO precedes (predecessor_movie_id, ancestor_movie_id) VALUES (${predecessor_movie_id}, ${ancestor_movie_id})`;
  await pool.query(query);
}

async function getMoviesByDirector(username){
  const query = `SELECT * FROM movies
  INNER JOIN movie_sessions ON movie_sessions.movie_id = movies.movie_id 
  WHERE director_username = '${username}'
  ORDER BY movies.movie_id ASC`
  const queryResult = await pool.query(query);
  return queryResult.rows;
}

async function getAudiencesByMovie(username, movie_id){
  const query = `SELECT users.username, users.name, users.surname FROM movies
  INNER JOIN movie_sessions on movies.movie_id = movie_sessions.movie_id
  INNER JOIN tickets on tickets.session_id = movie_sessions.session_id
  INNER JOIN users on users.username = tickets.username
  WHERE director_username = '${username}' and movie_sessions.movie_id = ${movie_id}`;
  const queryResult = await pool.query(query);
  return queryResult.rows;
}

async function editMovieName(username, movie_id, movie_name){
  const query =`UPDATE movies
  SET movie_name = '${movie_name}'
  WHERE director_username = '${username}' and movie_id = ${movie_id}`
  await pool.query(query);
}

async function getMoviesByDate(date, theatre_id){
  const query  = `SELECT * FROM movie_sessions
  INNER JOIN movies on movies.movie_id = movie_sessions.movie_id
  WHERE theatre_id = ${theatre_id} and date = '${date}'`
  const queryResult = await pool.query(query);
  return queryResult.rows;
}

async function addSubscription(username, platform_id){
  const query = `INSERT INTO Subscriptions (username, platform_id) VALUES ('${username}', '${platform_id}')`
}
export default {
  addAudience,
  addDirector,
  getManagerByUsername,
  getDirectorByUsername,
  getAudienceByUsername,
  deleteAudience,
  updatePlatformId,
  listDirectors,
  getRatings,
  getMovieSessionsByDirector,
  getAverageRatingByMovie,
  getTicketsByUsername,
  addTicketByUsernameAndSessionId,
  getPredecessorMovies,
  getTicketsForMovieByUsername,
  getSessionBySessionId,
  getTicketCountBySessionId,
  getMovieByMovieId,
  getMovieSessions,
  getPredecessorMoviesByMovieId,
  rateMovie,
  checkIsSubscribed,
  getPlatformOfMovieByMovieId,
  checkHasTicket,
  getTheatresByTimeSlot,
  addMovie,
  addPredecessor,
  getMoviesByDirector,
  getAudiencesByMovie,
  editMovieName,
  getMoviesByDate
};

