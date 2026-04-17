import { db } from "./firebase.js";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const usersCollection = collection(db, "users");

export const createUser = async ({ nombre, apellido, email, passwordHash }) => {
  try {
    const docRef = await addDoc(usersCollection, {
      nombre,
      apellido,
      email,
      password: passwordHash,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, nombre, apellido, email };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const q = query(usersCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};