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

usuariosRouter.get("/registro", viewRegistro);
usuariosRouter.post("/registro", doRegistro);

usuariosRouter.get("/login", viewLogin);
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
usuariosRouter.get("/logout", doLogout);

export default usuariosRouter;
