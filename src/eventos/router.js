// src/eventos/router.js
import express from "express";
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
  handleMoodTest
} from "./controllers.js";

const router = express.Router();

router.get("/crearEventos", asyncHandler(viewCrearEvento));
router.post("/crear", asyncHandler(crearEvento));
router.get("/visualizarEventos", asyncHandler(viewEventos));
router.get("/editar/:id", asyncHandler(viewEditarEvento));
router.post("/modificar/:id", asyncHandler(modificarEvento));
router.post("/eliminar/:id", asyncHandler(eliminarEvento));
router.get("/detalles/:id", asyncHandler(viewDetalles));
router.get("/mood-form", asyncHandler(viewMoodForm))
router.post("/submit-test", asyncHandler(handleMoodTest));

export default router;
