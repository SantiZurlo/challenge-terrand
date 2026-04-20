import { generateRecipe } from "../services/groq.service.js";

export const suggestRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients) {
      return res.status(400).json({ error: "Ingresá algunos ingredientes" });
    }
    const recipe = await generateRecipe(ingredients);
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar la receta" });
  }
};