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
usuariosRouter.post("/registro", asyncHandler(doRegistro));
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
