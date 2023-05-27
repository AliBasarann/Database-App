import express from "express";
import  db  from "../utils/db.js";
import jwt from "jsonwebtoken";
import verifyToken from "../utils/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username) {
          return res.status(400).send({message: "Provide a username and a password!"});
        }
        const director = await db.getDirectorByUsername(username);
        console.log(director);
        if (!director) {
          return res.status(400).send({message: "Wrong username or password!"});
        }
        if (director.password != password) {
          return res.status(400).send({message: "Wrong username or password!"});
        }
        const accesToken = jwt.sign({username: director.username, role: "director"}, process.env.SECRET_KEY);
        return res.send({message: "Login is successful", accessToken: accesToken});
      } catch(e) {
        console.log(e);
        return res.status(500).send({message: e});
      }
});

router.get("/theatres", verifyToken, async (req, res) => {
    if(req.role != "director"){
        return res.status(403).send({message: "You dont have permission!"});
    }
    const time_slot = req.query.time_slot;
    const date = req.query.date;
    try {
      if (!time_slot || !date) {
        return res.status(400).send({message:"Bad Request!"});
      }
      const theatres = await db.getTheatresByTimeSlot(time_slot,date);
      console.log(theatres)
      return res.send(theatres);
    } catch(e) {
      return res.status(500).send({message: e});
    }
});

router.put("/movies",verifyToken, async (req, res) => {
    if (req.role != "director") {
      return res.status(403).send({message: "You dont have permission!"});
    }

    try {
        const movie_id = req.body.movie_id;
        const movie_name = req.body.movie_name;
        const theatre_id = req.body.theatre_id;
        const time_slot = req.body.time_slot;
        const duration = req.body.duration;
        const date = req.body.date;
        const session_id = req.body.session_id;
        if (!movie_id || !movie_name || !theatre_id || !time_slot || !duration || !date || !session_id) {
            return res.status(400).send({message:"Bad Request!"});
        }
        const username = req.username;
        await db.addMovie(username, req.body)
        return res.send({message: "Movie is added successfully"});
    } catch(e) {
        if (e.code == 23505) {
            return res.status(400).send({message: e.detail});
        }
        return res.status(500).send({message: e});
     }
        
    
});

router.put("/precedes",verifyToken, async (req, res) => {
    if (req.role != "director") {
      return res.status(403).send({message: "You dont have permission!"});
    }

    try {
        const predecessor_movie_id = req.body.predecessor_movie_id;
        const ancestor_movie_id = req.body.ancestor_movie_id;
        if (!predecessor_movie_id || !ancestor_movie_id) {
            return res.status(400).send({message:"Bad Request!"});
        }
        await db.addPredecessor(predecessor_movie_id, ancestor_movie_id)
        return res.send({message: "Predecessor is added successfully"});
    } catch(e) {
        if (e.code == 23505) {
            return res.status(400).send({message: e.detail});
        }
        return res.status(500).send({message: e});
     }
        
});

router.get("/movies" , verifyToken, async (req, res) => {
    if(req.role != "director"){
        return res.status(403).send({message: "You dont have permission!"});
    }
    try{
        const username = req.username;
        const movies = await db.getMoviesByDirector(username);
        for (let i = 0; i<movies.length; i++ ) {
            movies[i].predecessors_list = (await db.getPredecessorMoviesByMovieId(movies[i].movie_id)).map((pre) => pre.predecessor_movie_id).toString();
        }
        console.log(movies)
        return res.send(movies);
    }catch (e) {
        return res.status(500).send({message: e});
    }
})


export default router