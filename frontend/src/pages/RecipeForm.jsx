import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: "", description: "", ingredients: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/recipes/my-recipes`).then(({ data }) => {
        const recipe = data.find((r) => r.id === id);
        if (recipe) {
          setForm({
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients.join(", "),
          });
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      ingredients: form.ingredients.split(",").map((i) => i.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await api.put(`/recipes/${id}`, payload);
      } else {
        await api.post("/recipes", payload);
      }
      navigate("/my-recipes");
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar la receta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>{isEditing ? "Editar receta" : "Nueva receta"}</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <label>Título</label>
        <input name="title" placeholder="Ej: Milanesa napolitana" value={form.title} onChange={handleChange} required />

        <label>Descripción</label>
        <textarea name="description" placeholder="Contá de qué se trata la receta..." value={form.description} onChange={handleChange} required rows={4} />

        <label>Ingredientes <span className="hint">(separados por coma)</span></label>
        <input name="ingredients" placeholder="Ej: harina, huevo, sal" value={form.ingredients} onChange={handleChange} required />

        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="button" onClick={() => navigate("/my-recipes")} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear receta"}
          </button>
        </div>
      </form>
    </div>
  );
}