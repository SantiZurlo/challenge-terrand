import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🍳 RecipeApp</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">Hola, {user.nombre}</span>
            <Link to="/my-recipes">Mis recetas</Link>
            <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}