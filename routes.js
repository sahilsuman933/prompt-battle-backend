import express from "express";

import image from "./Controllers/image";
import fetch from "./Controllers/fetchData";
const router = express.Router();

router.post("/images/generations", image.generateImage);
router.post("/submission", image.submission);
router.post("/votes", fetch.upVote);
router.post("/register", fetch.registerUser);

// Get Data Routes
router.get("/users", fetch.users);
router.get("/polling", fetch.polling);
router.get("/leaderboard", fetch.leaderboard);

export default router;
