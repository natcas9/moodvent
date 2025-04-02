import express from "express";
import { body } from "express-validator";

import {
  viewLogin,
  doLogin,
  doLogout,
  viewRegistro,
  doRegistro,
} from "./controllers.js";

const usuariosRouter = express.Router();

// Mostrar formulario de registro
usuariosRouter.get("/registro", viewRegistro);

// Procesar registro con validaciones
usuariosRouter.post(
  "/registro",
  [
    body("nombre", "El nombre es obligatorio").trim().notEmpty(),
    body("apellido", "El apellido es obligatorio").trim().notEmpty(),
    body("edad", "Edad obligatoria y debe ser un número válido").isInt({
      min: 1,
    }),
    body("email", "Debes introducir un correo válido").isEmail(),
    body("username", "El nombre de usuario es obligatorio").trim().notEmpty(),
    body("password", "La contraseña debe tener al menos 6 caracteres")
      .trim()
      .isLength({ min: 6 }),
    body("role", "El rol es obligatorio").notEmpty(),
  ],
  doRegistro
);

// Mostrar login
usuariosRouter.get("/login", viewLogin);

// Procesar login con validaciones
usuariosRouter.post(
  "/login",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("El nombre de usuario es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  doLogin
);

// Logout
usuariosRouter.get("/logout", doLogout);

// Página para usuarios normales
usuariosRouter.get("/normal", (req, res) => {
  res.render("pagina", {
    contenido: "paginas/normal",
    session: req.session,
  });
});

export default usuariosRouter;
