import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [recentRecipes, setRecentRecipes] = useState([]);

  useEffect(() => {
    api.get("/recipes/recent")
      .then(({ data }) => setRecentRecipes(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      navigate("/my-recipes");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-page">
      <div className="login-split">

        {/* LEFT — formulario + recetas */}
        <div className="login-left">
          <h1 className="login-title">🍳Bienvenido de nuevo</h1>
          <p className="login-subtitle">Iniciá sesión para ver y compartir tus recetas</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label>Email</label>
            <input name="email" type="email" placeholder="tu@email.com" value={form.email} onChange={handleChange} required />
            <label>Contraseña</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-primary btn-block">Iniciar sesión</button>
          </form>

          <p className="login-register">
            ¿No tenés cuenta? <Link to="/register">Registrate gratis</Link>
          </p>

          {/* RECETAS RECIENTES dentro del panel */}
          {recentRecipes.length > 0 && (
            <div className="recent-section-inline">
              <h2 className="recent-title"> Recetas recientes</h2>
              <div className="recent-grid-inline">
                {recentRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.slug}`}
                    className="recent-card"
                  >
                    {recipe.imageUrl ? (
                      <img src={recipe.imageUrl} alt={recipe.title} className="recent-img" />
                    ) : (
                      <div className="recent-img-placeholder">🍽️</div>
                    )}
                    <div className="recent-info">
                      <h3>{recipe.title}</h3>
                      <p>{recipe.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — imagen */}
        <div className="login-right">
          <div className="login-image-overlay">
            <p className="login-quote">"La cocina es el arte de convertir ingredientes en recuerdos."</p>
          </div>
        </div>

      </div>
    </div>
  );
}