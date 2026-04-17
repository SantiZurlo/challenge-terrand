import * as UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser({ nombre, apellido, email, passwordHash });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user: { id: user.id, nombre, apellido, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};