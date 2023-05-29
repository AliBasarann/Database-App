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

    try {
      const time_slot = req.query.time_slot;
      const date = req.query.date;
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

router.post("/movies",verifyToken, async (req, res) => {
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
        const genres = req.body.genres;
        if (!movie_id || !session_id || !date || !time_slot || !theatre_id) {
            console.log(movie_id, session_id, date,time_slot,theatre_id)
            return res.status(400).send({message: "Bad Request!"});
        }
        const movie = await db.getMovieByMovieId(movie_id);
        if (movie && movie.director_username != req.username) {
            return res.status(400).send({message: "The movie does not belong to you!"});
        }
        if (!movie) {
            if (!movie_name || !duration) {
                return res.status(400).send({message:"Bad Request!"});
            }
            if (!genres || genres.length==0) {
                return res.status(400).send({message: "A movie should have at least one genre!"});
            }
            var genre;
            for (let i = 0; i<genres.length; i++) {
                genre = await db.getGenre(genres[i]);
                console.log(genre);
                if (!genre) {
                    return res.status(400).send({message: `${genres[i]} is not a valid genre id!`});
                }
            }
        }
        const movies = await db.getMoviesByDate(date, theatre_id);
        var available_slots = [true, true, true, true]
        for (let i = 0; i < movies.length ; i++){
            for (let j = 0; j < movies[i].duration; j++){
                available_slots[movies[i].time_slot+j-1] = false
            }
        }

        for (let i = 0; i < duration ; i++){
            if(time_slot+i < 5 && !available_slots[time_slot+i-1]){
                return res.status(400).send({message:"The theatre you selected is not available at that time interval"});
            }
        }

        const username = req.username;
        await db.addMovie(username, req.body)
        return res.send({message: "Movie is added successfully"});
    } catch(e) {
        if (e.code == 23505 || e.code == 23503) {
            return res.status(400).send({message: e.detail});
        }
        return res.status(500).send({message: e});
     }
        
    
});

router.post("/precedes",verifyToken, async (req, res) => {
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
        if (e.code == 23505 || e.code == 23503) {
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
        if (!username) {
            return res.status(400).send({message:"Bad Request!"});
        }
        const movies = await db.getMoviesByDirector(username);
        
        for (let i = 0; i<movies.length; i++ ) {
            movies[i].predecessors_list = (await db.getPredecessorMoviesByMovieId(movies[i].movie_id)).map((pre) => pre.predecessor_movie_id).toString();
            movies[i].date = movies[i].date.toLocaleString("en-US").split(",")[0];
        }
        return res.send(movies);
    }catch (e) {
        return res.status(500).send({message: e});
    }
})

router.get("/audiences", verifyToken, async (req,res) => {
    if(req.role != "director"){
        return res.status(403).send({message: "You dont have permission!"});
    }
    try{
        const username = req.username;
        const movie_id = req.query.movie_id;
        if (!username || !movie_id) {
            return res.status(400).send({message:"Bad Request!"});
        }
        const movie = await db.getMovieByMovieId(movie_id)
        if(!movie){
            return res.status(400).send({message:"Please enter a valid movie id!"});
        }
        if(movie.director_username != username){
            return res.status(400).send({message:"The movie is not belong to you!"});
        }
        const audiences = await db.getAudiencesByMovie(username,movie_id);
        return res.send(audiences);
    }catch (e) {
        return res.status(500).send({message: e});
    }
})

router.put("/movie", verifyToken, async (req,res) =>{
    if(req.role != "director"){
        return res.status(403).send({message: "You dont have permission!"});
    }
    try{
        const username = req.username;
        const movie_id = req.body.movie_id;
        const movie_name = req.body.movie_name;
        if (!username || !movie_id || !movie_name) {
            return res.status(400).send({message:"Bad Request!"});
        }
        const movie = await db.getMovieByMovieId(movie_id)
        if(!movie){
            return res.status(400).send({message:"Please enter a valid movie id!"});
        }
        if(movie.director_username != username){
            return res.status(400).send({message:"The movie is not belong to you!"});
        }
        await db.editMovieName(username, movie_id, movie_name);
        return res.send({message: "Movie name is edited successfully"});
    }catch (e) {
        return res.status(500).send({message: e});
    }
})

export default router