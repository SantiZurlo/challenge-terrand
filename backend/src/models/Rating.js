import { db } from "./firebase.js";
import {
  collection, addDoc, query, where,
  getDocs, updateDoc, doc
} from "firebase/firestore";

const ratingsCollection = collection(db, "ratings");

export const rateRecipe = async (recipeId, userId, score) => {
  // Si ya calificó, actualiza — si no, crea
  const q = query(
    ratingsCollection,
    where("recipeId", "==", recipeId),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docRef = doc(db, "ratings", snapshot.docs[0].id);
    await updateDoc(docRef, { score });
    return { updated: true, score };
  }

  await addDoc(ratingsCollection, {
    recipeId,
    userId,
    score,
    createdAt: new Date().toISOString()
  });
  return { updated: false, score };
};

export const getRecipeRating = async (recipeId) => {
  const q = query(ratingsCollection, where("recipeId", "==", recipeId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return { average: 0, total: 0 };
  const scores = snapshot.docs.map(d => d.data().score);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return { average: Math.round(average * 10) / 10, total: scores.length };
};

export const getUserRating = async (recipeId, userId) => {
  const q = query(
    ratingsCollection,
    where("recipeId", "==", recipeId),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data().score;
};