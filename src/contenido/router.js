import express from "express";
import asyncHandler from "express-async-handler";
import { viewContenidoNormal, viewContenidoAdmin } from "./controllers.js";
import { autenticado, tieneRol } from "../middleware/auth.js";
import { RolesEnum } from "../usuarios/Usuario.js";
import { guardarSugerencia, guardarFeedback, verTablaInfo, eliminarSugerencia } from "./controllers.js";



const contenidoRouter = express.Router();

contenidoRouter.use(autenticado("/usuarios/login"));

contenidoRouter.get("/normal", asyncHandler(viewContenidoNormal));

contenidoRouter.get(
  "/admin",
  tieneRol(RolesEnum.ADMIN),
  asyncHandler(viewContenidoAdmin)
);

contenidoRouter.post("/guardar-sugerencia", asyncHandler(guardarSugerencia));
contenidoRouter.post("/guardar-feedback", asyncHandler(guardarFeedback));
contenidoRouter.get("/tableinfo", asyncHandler(verTablaInfo));
contenidoRouter.post("/eliminar-sugerencia/:id", asyncHandler(eliminarSugerencia));


export default contenidoRouter;
