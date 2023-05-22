import express from "express";
import { addAudience, getManagerByUsername } from "../utils/db.js";
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
    const manager = await getManagerByUsername(username);
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
    return res.status(401).send({message: "You dont have permission!"});
  }
  const model = req.body;
  try {
    if (!model.username || !model.password || !model.name || !model.surname || !model.ratingPlatforms) {
      return res.status(400).send("Bad Request!");
    }
    await addAudience(model);
    return res.send({message: "Audience is added successfully"});
  } catch(e) {
    if (e.code == 23505) {
      return res.status(400).send({message: e.detail});
    }
    return res.status(500).send({message: e});
  }
});

export default router;