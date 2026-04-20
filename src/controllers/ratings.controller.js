import { rateRecipe, getRecipeRating, getUserRating } from "../models/Rating.js";
import { getRecipeById } from "../models/Recipe.js";

export const rate = async (req, res) => {
  try {
    const { score } = req.body;
    const { id } = req.params;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: "El puntaje debe ser entre 1 y 5" });
    }

    const recipe = await getRecipeById(id);
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });

    if (recipe.userId === req.user.id) {
      return res.status(403).json({ error: "No podés calificar tu propia receta" });
    }

    const result = await rateRecipe(id, req.user.id, score);
    const rating = await getRecipeRating(id);
    res.json({ ...result, ...rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await getRecipeRating(id);

    let userScore = null;
    if (req.user) {
      userScore = await getUserRating(id, req.user.id);
    }

    res.json({ ...rating, userScore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};