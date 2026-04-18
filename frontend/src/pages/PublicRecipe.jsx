import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function PublicRecipe() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/recipes/public/${slug}`)
      .then(({ data }) => setRecipe(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="loading">Cargando receta...</p>;
  if (notFound) return <p className="error">Receta no encontrada.</p>;

  return (
    <div className="page-container public-recipe">
      <h1>{recipe.title}</h1>
      <p className="recipe-description">{recipe.description}</p>
      <h3>Ingredientes</h3>
      <ul className="ingredients-list">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
    </div>
  );
}