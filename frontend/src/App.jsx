import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyRecipes from "./pages/MyRecipes";
import RecipeForm from "./pages/RecipeForm";
import PublicRecipe from "./pages/PublicRecipe";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-recipes" element={
          <PrivateRoute><MyRecipes /></PrivateRoute>
        } />
        <Route path="/my-recipes/new" element={
          <PrivateRoute><RecipeForm /></PrivateRoute>
        } />
        <Route path="/my-recipes/edit/:id" element={
          <PrivateRoute><RecipeForm /></PrivateRoute>
        } />
        <Route path="/recipes/:slug" element={<PublicRecipe />} />
      </Routes>
    </>
  );
}

export default App;