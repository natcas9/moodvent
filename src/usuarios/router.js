import express from "express";
import { body } from "express-validator";
import asyncHandler from "express-async-handler";

import {
  viewLogin,
  doLogin,
  doLogout,
  viewRegistro,
  doRegistro,
} from "./controllers.js";

const usuariosRouter = express.Router();

usuariosRouter.get("/registro", asyncHandler(viewRegistro));
usuariosRouter.post(
  "/registro",
  [
    body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("apellido")
      .trim()
      .notEmpty()
      .withMessage("El apellido es obligatorio"),
    body("edad")
      .isInt({ min: 1 })
      .withMessage("La edad debe ser un número válido"),
    body("email").isEmail().withMessage("Correo electrónico no válido"),
    body("username").trim().notEmpty().withMessage("El usuario es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
    body("role").notEmpty().withMessage("El rol es obligatorio"),
  ],
  asyncHandler(doRegistro)
);

usuariosRouter.get("/login", asyncHandler(viewLogin));
usuariosRouter.post(
  "/login",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("El nombre de usuario es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  asyncHandler(doLogin)
);
usuariosRouter.get("/logout", asyncHandler(doLogout));

usuariosRouter.get("/normal", (req, res) => {
  res.render("pagina", {
    contenido: "paginas/normal",
    session: req.session,
  });
});

export default usuariosRouter;
