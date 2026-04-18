import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import RecipeCard from "../components/RecipeCard";

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const { data } = await api.get("/recipes/my-recipes");
      setRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que querés eliminar esta receta?")) return;
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(recipes.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="loading">Cargando recetas...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Mis recetas</h2>
        <Link to="/my-recipes/new" className="btn-primary">+ Nueva receta</Link>
      </div>
      {recipes.length === 0 ? (
        <p className="empty">No tenés recetas todavía. ¡Creá la primera!</p>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}