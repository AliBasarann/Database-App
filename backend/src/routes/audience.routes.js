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

export default router;