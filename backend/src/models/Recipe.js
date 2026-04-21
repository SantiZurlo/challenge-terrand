import { db } from "./firebase.js";
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where} from "firebase/firestore";

const recipesCollection = collection(db, "recipes");

//Función para generar un slug a partir del título
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    + "-" + Date.now();
};

//Crear receta
export const createRecipe = async ({ title, description, ingredients, userId, imageUrl }) => {
  const slug = generateSlug(title);
  const docRef = await addDoc(recipesCollection, {
    title,
    description,
    ingredients,
    userId,
    slug,
    imageUrl: imageUrl || null,
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id, title, description, ingredients, userId, slug, imageUrl };
};

//Obtener recetas de un usuario
export const getRecipesByUser = async (userId) => {
  const q = query(recipesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

//Obtener recetas recientes (públicas)
export const getRecentRecipes = async () => {
  const snapshot = await getDocs(recipesCollection);
  const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return all
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
};

//Obtener receta por slug (pública)
export const getRecipeBySlug = async (slug) => {
  const q = query(recipesCollection, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

//Obtener receta por ID (privada)
export const getRecipeById = async (id) => {
  const docRef = doc(db, "recipes", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

//Actualizar receta
export const updateRecipe = async (id, data) => {
  const docRef = doc(db, "recipes", id);
  await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
  return { id, ...data };
};

//Eliminar receta
export const deleteRecipe = async (id) => {
  const docRef = doc(db, "recipes", id);
  await deleteDoc(docRef);
  return true;
};