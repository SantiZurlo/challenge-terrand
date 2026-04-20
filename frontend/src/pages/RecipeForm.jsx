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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
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
          if (recipe.imageUrl) setPreview(recipe.imageUrl);
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        setImage(file);
        setPreview(URL.createObjectURL(file));
        break;
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("ingredients", JSON.stringify(
        form.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
      ));
      if (image) formData.append("image", image);

      if (isEditing) {
        await api.put(`/recipes/${id}`, formData);
      } else {
        await api.post("/recipes", formData);
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

        <label>Imagen <span className="hint">(opcional)</span></label>
        <div
          className={`drop-zone ${dragOver ? "drag-over" : ""}`}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          tabIndex={0}
        >
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="image-preview" />
              <button type="button" className="btn-danger remove-img" onClick={() => { setImage(null); setPreview(null); }}>
                Quitar imagen
              </button>
            </div>
          ) : (
            <p>📋 Pegá una imagen (Ctrl+V), arrastrá o <label className="file-label">elegí un archivo<input type="file" accept="image/*" onChange={handleImage} hidden /></label></p>
          )}
        </div>

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