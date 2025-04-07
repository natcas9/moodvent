import express from "express";
import asyncHandler from "express-async-handler";
import { viewContenidoNormal, viewContenidoAdmin } from "./controllers.js";
import { autenticado, tieneRol } from "../middleware/auth.js";
import { RolesEnum } from "../usuarios/Usuario.js";

const contenidoRouter = express.Router();

contenidoRouter.use(autenticado("/usuarios/login"));

contenidoRouter.get("/normal", asyncHandler(viewContenidoNormal));

contenidoRouter.get(
  "/admin",
  tieneRol(RolesEnum.ADMIN),
  asyncHandler(viewContenidoAdmin)
);

export default contenidoRouter;
