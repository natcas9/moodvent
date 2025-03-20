import express from "express";
import { registrarUsuario, obtenerUsuario } from "../models/usuario.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/registro", (req, res) => {
  try {
    res.render("paginas/registro");
  } catch (error) {
    console.error("Error al cargar", error);
    res.status(500).send("Error al cargar la página");
  }
});

router.post("/registro", (req, res) => {
  try {
    const { nombre, apellido, edad, email, username, password, role } =
      req.body;

    if (
      !nombre ||
      !apellido ||
      !edad ||
      !email ||
      !username ||
      !password ||
      !role
    ) {
      throw new Error("Todos los campos son obligatorios");
    }
    registrarUsuario(nombre, apellido, edad, email, username, password, role);
    res.redirect("/usuarios/login");
  } catch (error) {
    console.error("Error en el registro", error);
    res.status(500).send("Error al guardar el usuario");
  }
});

router.get("/login", (req, res) => {
  try {
    res.render("paginas/login", { error: null });
  } catch (error) {
    console.error("Error al cargar login", error);
    res.status(500).send("Error al cargar la página");
  }
});

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const user = obtenerUsuario(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    req.session.login = true;
    req.session.nombre = user.username;
    req.session.esAdmin = user.role == "admin";
    res.redirect(
      user.role == "admin" ? "/contenido/admin" : "/contenido/normal"
    );
  } catch (error) {
    console.error("Error en el login", error);
    res.render("paginas/login", { error: "Usuario o contraseña incorrectos" });
  }
});
router.get("/logout", (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect("/usuarios/login");
    });
  } catch (error) {
    console.error("Error al hacer logout", error);
    res.status(500).send("Error al hacer logout");
  }
});
export default router;
