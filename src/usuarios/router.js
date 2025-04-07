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
  body("username")
    .trim()
    .notEmpty()
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Solo letras y números"),
  body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").trim().notEmpty().withMessage("El apellido es obligatorio"),
  body("email").isEmail().withMessage("Correo inválido"),
  body("edad").isInt({ min: 1 }).withMessage("Edad inválida"),
  body("password")
    .isLength({ min: 6, max: 10 })
    .withMessage("La contraseña no tiene entre 6 y 10 caracteres"),
  body("role").notEmpty().withMessage("Selecciona un rol"),
  asyncHandler(doRegistro)
);

export default usuariosRouter;
