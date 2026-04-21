import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.js";
import upload from "../middlewares/upload.js";
import { createRecipe, getMyRecipes, updateRecipe, deleteRecipe, getRecipeBySlug, getRecentRecipes } from "../controllers/recipes.controller.js";

const router = Router();

// Ruta pública
router.get("/public/:slug", getRecipeBySlug);
router.get("/recent", getRecentRecipes);

// Rutas privadas
router.use(verifyToken);
router.get("/my-recipes", getMyRecipes);
router.post("/", upload.single("image"), createRecipe);
router.put("/:id", upload.single("image"), updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;