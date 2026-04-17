import { Router } from "express";
import { verifyToken } from "../middlewares/verify-token.js";
import {createRecipe, getMyRecipes, updateRecipe, deleteRecipe} from "../controllers/recipes.controller.js";
import { getRecipeBySlug } from "../controllers/recipes.controller.js";

const router = Router();

// Ruta pública — cualquiera puede ver una receta por su link
router.get("/public/:slug", getRecipeBySlug);

// Rutas privadas — requieren token
router.use(verifyToken);
router.get("/my-recipes", getMyRecipes);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;