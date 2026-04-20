import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";

export default function RecipeCard({ recipe, onDelete }) {
  const publicUrl = `${window.location.origin}/recipes/${recipe.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    alert("¡Link copiado!");
  };

  return (
    <div className="recipe-card">
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} className="card-image" />
      )}
      <h3>{recipe.title}</h3>
      <p className="recipe-description">{recipe.description}</p>
      <RatingStars
        average={recipe.rating?.average || 0}
        total={recipe.rating?.total || 0}
        readOnly
      />
      <ul className="ingredients-list">
        {recipe.ingredients.slice(0, 3).map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
        {recipe.ingredients.length > 3 && (
          <li className="more">+{recipe.ingredients.length - 3} más...</li>
        )}
      </ul>
      <div className="card-actions">
        <Link to={`/my-recipes/edit/${recipe.id}`} className="btn-secondary">Editar</Link>
        <button onClick={handleCopyLink} className="btn-secondary">Copiar link</button>
        <button onClick={() => onDelete(recipe.id)} className="btn-danger">Eliminar</button>
      </div>
    </div>
  );
}