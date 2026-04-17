import * as RecipeModel from "../models/Recipe.js";

// Controladores para recetas
export const createRecipe = async (req, res) => {
  try {const { title, description, ingredients } = req.body;
    if (!title || !description || !ingredients) {
      return res.status(400).json({ error: "Título, descripción e ingredientes son obligatorios" });
    }
    const recipe = await RecipeModel.createRecipe({title, description, ingredients, userId: req.user.id});
    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Controlador para obtener las recetas del usuario 
export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.getRecipesByUser(req.user.id);
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Controlador para obtener una receta por su slug (pública)
export const getRecipeBySlug = async (req, res) => {
  try {
    const recipe = await RecipeModel.getRecipeBySlug(req.params.slug);
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Controladores para actualizar receta
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await RecipeModel.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    if (recipe.userId !== req.user.id) {
      return res.status(403).json({ error: "No tenés permiso para editar esta receta" });
    }
    const updated = await RecipeModel.updateRecipe(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Controlador para eliminar receta
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await RecipeModel.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    if (recipe.userId !== req.user.id) {
      return res.status(403).json({ error: "No tenés permiso para eliminar esta receta" });
    }
    await RecipeModel.deleteRecipe(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};