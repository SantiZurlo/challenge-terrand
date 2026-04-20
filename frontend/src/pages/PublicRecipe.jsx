import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import RatingStars from "../components/RatingStars";

export default function PublicRecipe() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState({ average: 0, total: 0, userScore: null });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [ratingMsg, setRatingMsg] = useState("");

  useEffect(() => {
    api.get(`/recipes/public/${slug}`)
      .then(({ data }) => {
        setRecipe(data);
        return api.get(`/ratings/${data.id}/rating`);
      })
      .then(({ data }) => setRating(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleRate = async (score) => {
    if (!user) return setRatingMsg("Tenés que iniciar sesión para calificar");
    try {
      const { data } = await api.post(`/ratings/${recipe.id}/rate`, { score });
      setRating({ average: data.average, total: data.total, userScore: score });
      setRatingMsg(data.updated ? "¡Calificación actualizada!" : "¡Gracias por calificar!");
      setTimeout(() => setRatingMsg(""), 3000);
    } catch (err) {
      setRatingMsg(err.response?.data?.error || "Error al calificar");
      setTimeout(() => setRatingMsg(""), 3000);
    }
  };

  if (loading) return <p className="loading">Cargando receta...</p>;
  if (notFound) return <p className="error">Receta no encontrada.</p>;

  return (
    <div className="page-container public-recipe">
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} className="public-image" />
      )}
      <h1>{recipe.title}</h1>
      <p className="recipe-description">{recipe.description}</p>

      <div className="rating-section">
        <RatingStars
          average={rating.average}
          total={rating.total}
          userScore={rating.userScore}
          onRate={handleRate}
          readOnly={!user || recipe.userId === user?.id}
        />
        {!user && <p className="hint">Iniciá sesión para calificar esta receta</p>}
        {ratingMsg && <p className="rating-msg">{ratingMsg}</p>}
      </div>

      <h3>Ingredientes</h3>
      <ul className="ingredients-list">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
    </div>
  );
}