import express from "express";
import Authentication from "./Controllers/Authentication";
import fetch from "./Controllers/fetchData";
import image from "./Controllers/image";
const router = express.Router();

router.post("/login", Authentication.login);
router.post("/leaderboard", fetch.leaderboard);
router.post("/generate-image", image.generateImage);

export default router;
