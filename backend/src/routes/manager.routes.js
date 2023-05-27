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
    const manager = await db.getManagerByUsername(username);
    if (!manager) {
      return res.status(400).send({message: "Wrong username or password!"});
    }
    if (manager.password != password) {
      return res.status(400).send({message: "Wrong username or password!"});
    }
    const accesToken = jwt.sign({username: manager.username, role: "manager"}, process.env.SECRET_KEY);
    return res.send({message: "Login is successful", accessToken: accesToken});
  } catch(e) {
    console.log(e);
    return res.status(500).send({message: e});
  }
});

router.post("/audiences",verifyToken, async (req, res) => {
  if (req.role != "manager") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const model = req.body;
  try {
    if (!model.username || !model.password || !model.name || !model.surname || !model.ratingPlatforms) {
      return res.status(400).send({message:"Bad Request!"});
    }
    await db.addAudience(model);
    return res.send({message: "Audience is added successfully"});
  } catch(e) {
    if (e.code == 23505) {
      return res.status(400).send({message: e.detail});
    }
    return res.status(500).send({message: e});
  }
});

router.post("/directors",verifyToken, async (req, res) => {
  if (req.role != "manager") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const model = req.body;
  try {
    if (!model.username || !model.password || !model.name || !model.surname || !model.nation) {
      return res.status(400).send({message:"Bad Request!"});
    }
    await db.addDirector(model);
    return res.send({message: "Director is added successfully"});
  } catch(e) {
    console.log(e);
    if (e.code == 23505 || e.code == 23503) {
      return res.status(400).send({message: e.detail});
    }
    return res.status(500).send({message: e});
  }
});

router.delete("/audiences",verifyToken, async (req, res) => {
  if (req.role != "manager") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const username = req.query.username;
  try {
    if (!username) {
      return res.status(400).send({message:"Bad Request!"});
    }
    const result = await db.deleteAudience(username);
    if (!result) {
      return res.status(404).send({message: "User not found!"});
    }
    return res.send({message: "Audience is removed successfully"});
  } catch(e) {
    console.log(e);
    return res.status(500).send({message: e});
  }
});

router.put("/directors",verifyToken, async (req, res) => {
  if (req.role != "manager") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const username = req.query.username;
  const platform_id = req.query.platform_id;
  try {
    if (!username || !platform_id) {
      return res.status(400).send({message:"Bad Request!"});
    }
    const result = await db.updatePlatformId(username, platform_id);
    if (!result) {
      return res.status(404).send({message: "User not found!"});
    }
    return res.send({message: "Platform id is updated successfully"});
  } catch(e) {
    console.log(e);
    if (e.code == 23503) {
      return res.status(400).send({message: e.detail});
    }
    return res.status(500).send({message: e});
  }
});

router.get("/directors", verifyToken, async (req, res) => {
  if (req.role != "manager") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  try {
    return res.send(await db.listDirectors());
  } catch(e) {
    return res.status(500).send({message: e});
  }
});

router.get("/audiences/ratings", verifyToken, async (req, res) => {
  if (req.role != "manager") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const username = req.query.username;
  try {
    if (!username) {
      return res.status(400).send({message:"Bad Request!"});
    }
    const ratings = await db.getRatings(username);
    return res.send(ratings);
  } catch(e) {
    return res.status(500).send({message: e});
  }
});

router.get("/directors/movies", verifyToken, async (req, res) => {
  if (req.role != "manager") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const username = req.query.username;
  try {
    if (!username) {
      return res.status(400).send({message:"Bad Request!"});
    }
    const movies = await db.getMovieSessionsByDirector(username);
    return res.send(movies);
  } catch(e) {
    return res.status(500).send({message: e});
  }
});

router.get("/movies", verifyToken, async (req, res) => {
  if (req.role != "manager") {
    return res.status(403).send({message: "You dont have permission!"});
  }
  const movie_id = req.query.movie_id;
  try {
    if (!movie_id) {
      return res.status(400).send({message:"Bad Request!"});
    }
    const movie = (await db.getAverageRatingByMovie(movie_id))[0];
    if (!movie) {
      return res.status(404).send({message:"Movie not found!"});
    }
    return res.send(movie);
  } catch(e) {
    return res.status(500).send({message: e});
  }
});


export default router;