import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.js";
import { rate, getRating } from "../controllers/ratings.controller.js";

const router = Router();

router.get("/:id/rating", getRating);
router.post("/:id/rate", verifyToken, rate);

export default router;