import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.js";
import { suggestRecipe } from "../controllers/ai.controller.js";

const router = Router();

router.post("/suggest", verifyToken, suggestRecipe);

export default router;