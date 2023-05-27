import express from "express";
import  db  from "../utils/db.js";
import jwt from "jsonwebtoken";
import verifyToken from "../utils/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    if (!username || !password) {
      return res.status(400).send({message: "Provide a username and a password!"});
    }
    const audience = await db.getAudienceByUsername(username);
    console.log(audience);
    if (!audience) {
      return res.status(400).send({message: "Wrong username or password!"});
    }
    if (audience.password != password) {
      return res.status(400).send({message: "Wrong username or password!"});
    }
    const accesToken = jwt.sign({username: audience.username, role: "audience"}, process.env.SECRET_KEY);
    return res.send({message: "Login is successful", accessToken: accesToken});
  } catch(e) {
    console.log(e);
    return res.status(500).send({message: e});
  }
});

router.post("/ticket", verifyToken, async (req, res) => {
  if (req.role != "audience") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const username = req.username;
  const session_id = req.query.session_id;
  try {
    if (!session_id) {
      return res.status(400).send({message:"Bad Request!"});
    }
    const session = (await db.getSessionBySessionId(session_id))[0];
    if (!session) {
      return res.status(404).send({message: "Wrong session id!"});
    }
    const ticketCount = (await db.getTicketCountBySessionId(session_id))[0].count;
    if (!(ticketCount < session.theatre_capacity)) {
      return res.status(400).send({message: "No empty seat!"});
    }
    const predecessors = await db.getPredecessorMovies(session_id);
    var tickets;
    var movie;
    var unwatched = []
    for (let i = 0; i < predecessors.length; i++) {
      movie = await db.getMovieByMovieId(predecessors[i].predecessor_movie_id); 
      tickets = await db.getTicketsForMovieByUsername(username, predecessors[i].predecessor_movie_id);
      var isWatched = false;
      for (let j = 0; j< tickets.length; j++) {
        if (tickets[j].date<session.date || (tickets[j].date == session.date && tickets[j].time_slot < session.time_slot)) {
          isWatched = true;
        }
      }
      if (!isWatched) {
        unwatched.push(movie.movie_name);
      }
    }
    if (unwatched.length!=0) {
      return res.status(400).send({message: `These films should be watched: ${unwatched.toString()}`});
    }
    await db.addTicketByUsernameAndSessionId(username, session_id);
    return res.send({message: "Ticket is bought successfully!"});
  } catch(e) {
    if (e.code == 23503 || e.code == 23505) {
      return res.status(400).send({message: e.detail});
    }
    return res.status(500).send({message: e});
  }
})

router.get("/ticket", verifyToken, async (req, res) => {
  if (req.role != "audience") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const username = req.username;
  try {
    const tickets = await db.getTicketsByUsername(username);
    return res.send(tickets);
  } catch (e) {
    return res.status(500).send({message: e});
  }
});

router.get("/movie_sessions", verifyToken, async (req, res) => {
  if (req.role != "audience") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  try {
    const movies = await db.getMovieSessions();
    for (let i = 0; i<movies.length; i++ ) {
      movies[i].predecessors_list = (await db.getPredecessorMoviesByMovieId(movies[i].movie_id)).map((pre) => pre.predecessor_movie_id).toString();
    }
    return res.send(movies);
  } catch (e) {
    return res.status(500).send({message: e});
  }
});

router.post("/rating", verifyToken, async (req, res) => {
  if (req.role != "audience") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const username = req.username;
  const movie_id = req.query.movie_id;
  const rating = req.query.rating;
  try {
    if (!username || !movie_id || !rating) {
      return res.status(400).send({message: "Bad Request"});
    }
    const movie = await db.getMovieByMovieId(movie_id);
    console.log(movie);
    if (!movie) {
      return res.status(404).send({message: "Movie does not exist!"});
    }
    if (!(await db.checkHasTicket(username, movie_id))) {
      return res.status(400).send({message: "You should watch the movie!"});
    }
    const platformOfMovie = (await db.getPlatformOfMovieByMovieId(movie_id))[0].platform_id;
    if (!(await db.checkIsSubscribed(username, platformOfMovie))) {
      return res.status(400).send({message: "You should subscribe to the platform of the movie!"});
    }
    await db.rateMovie(username, movie_id, rating);
    return res.send({message: "Rating is successful!"});
  } catch (e) {
    if (e.code == 23505) {
      return res.status(400).send({message: e.detail})
    }
    else if (e.code == 23514) {
      return res.status(400).send({message: "The rating range is 0-5"});
    }
    return res.status(500).send({message: e});
  }
})
export default router;