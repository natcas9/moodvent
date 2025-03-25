import express from "express";
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
usuariosRouter.post("/login", doLogin);
usuariosRouter.get("/logout", doLogout);

export default usuariosRouter;
