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
  asistirEvento,
  cancelarAsistencia,
  viewMoodForm,
  handleMoodTest,
} from "./controllers.js";
import { body, query, param } from "express-validator";

const router = express.Router();

router.get("/crearEventos", asyncHandler(viewCrearEvento));

router.post(
  "/crear",
  [
    body("nombre").notEmpty().isString(),
    body("descripcion").notEmpty().isString(),
    body("fecha").notEmpty().isISO8601(),
    body("hora").notEmpty().isString(),
    body("lugar").notEmpty().isString(),
    body("precio").notEmpty().isFloat({ min: 0 }),
    body("estadoAnimo").notEmpty().isString(),
  ],
  asyncHandler(crearEvento)
);

router.get(
  "/visualizarEventos",
  [
    query("tematica").optional().isString(),
    query("ubicacion").optional().isString(),
    query("fecha").optional().isISO8601(),
    query("precio").optional().isFloat({ min: 0 }),
    query("estadoAnimo").optional().isString(),
  ],
  asyncHandler(viewEventos)
);

router.get("/editar/:id", param("id").isInt(), asyncHandler(viewEditarEvento));

router.post(
  "/modificar/:id",
  [
    param("id").isInt(),
    body("nombre").notEmpty().isString(),
    body("descripcion").notEmpty().isString(),
    body("fecha").notEmpty().isISO8601(),
    body("hora").notEmpty().isString(),
    body("lugar").notEmpty().isString(),
    body("precio").notEmpty().isFloat({ min: 0 }),
    body("estadoAnimo").notEmpty().isString(),
  ],
  asyncHandler(modificarEvento)
);

router.post("/eliminar/:id", param("id").isInt(), asyncHandler(eliminarEvento));

router.get("/detalles/:id", param("id").isInt(), asyncHandler(viewDetalles));

router.post("/asistir/:id", asyncHandler(asistirEvento));
router.post("/cancelar-asistencia/:id", asyncHandler(cancelarAsistencia));
router.get("/historial", asyncHandler(verHistorial));
router.get("/mood-form", asyncHandler(viewMoodForm));
router.post("/submit-test", asyncHandler(handleMoodTest));

export default router;
