// src/eventos/router.js
import express from "express";
import { autenticado } from "../middleware/auth.js";
import { Evento } from "./Evento.js";
import { cancelarAsistencia } from "./controllers.js";
import asyncHandler from "express-async-handler";
import {
  viewCrearEvento,
  crearEvento,
  viewEventos,
  viewEditarEvento,
  modificarEvento,
  eliminarEvento,
  viewDetalles,
  viewMoodForm,
  handleMoodTest,
  viewProfile,
  asistirEvento, 
  verHistorial
} from "./controllers.js";

const router = express.Router();

router.get("/crearEventos", asyncHandler(viewCrearEvento));
router.post("/crear", asyncHandler(crearEvento));
router.get("/visualizarEventos", asyncHandler(viewEventos));
router.get("/editar/:id", asyncHandler(viewEditarEvento));
router.post("/modificar/:id", asyncHandler(modificarEvento));
router.post("/eliminar/:id", asyncHandler(eliminarEvento));
router.get("/detalles/:id", asyncHandler(viewDetalles));
router.get("/mood-form", asyncHandler(viewMoodForm));
router.post("/submit-test", asyncHandler(handleMoodTest));
router.get("/verPerfil", asyncHandler(viewProfile));
router.post(
  "/asistir/:id",
  autenticado("/usuarios/login"),
  asyncHandler((req, res) => {
    Evento.registrarAsistencia(req.session.username, req.params.id);
    res.redirect("/usuarios/perfil");
  })
);
router.post(
  "/cancelar-asistencia/:id",
  autenticado("/usuarios/login"),
  asyncHandler(cancelarAsistencia)
);
router.get("/historial", asyncHandler(verHistorial));


export default router;
