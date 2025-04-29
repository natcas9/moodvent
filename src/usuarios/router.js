import express from "express";
import asyncHandler from "express-async-handler";
import { body } from "express-validator";
import {
  viewLogin,
  doLogin,
  viewRegistro,
  doRegistro,
  doLogout,
  viewHome,
  viewPerfil,
} from "./controllers.js";
import { autenticado } from "../middleware/auth.js";

const usuariosRouter = express.Router();

usuariosRouter.get("/login", autenticado(null), asyncHandler(viewLogin));

usuariosRouter.post(
  "/login",
  autenticado(null, "/usuarios/home"),
  body("username", "El nombre de usuario es obligatorio").trim().notEmpty(),
  body("password", "La contraseña es obligatoria").trim().notEmpty(),
  asyncHandler(doLogin)
);

usuariosRouter.get("/logout", doLogout);

usuariosRouter.get(
  "/perfil",
  autenticado("/usuarios/perfil"),
  asyncHandler(viewPerfil)
);

usuariosRouter.get(
  "/home",
  autenticado("/usuarios/home"),
  asyncHandler(viewHome)
);

usuariosRouter.get(
  "/registro",
  autenticado(null, "/usuarios/home"),
  asyncHandler(viewRegistro)
);

usuariosRouter.post(
  "/registro",
  [
    body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("apellido")
      .trim()
      .notEmpty()
      .withMessage("El apellido es obligatorio"),
    body("edad").isInt({ min: 1 }).withMessage("Edad inválida"),
    body("email").isEmail().withMessage("Correo electrónico inválido"),
    body("username").trim().notEmpty().withMessage("El usuario es obligatorio"),
    body("password")
      .isLength({ min: 6, max: 12 })
      .withMessage("La contraseña debe tener entre 6 y 12 caracteres"),
  ],
  asyncHandler(doRegistro)
);

export default usuariosRouter;
