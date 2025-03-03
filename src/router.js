import express from "express";
import { crearEvento } from "./controllers/eventos.js";

const eventosRouter = express.Router();

//Rutas para administar eventos
eventosRouter.post("/eventos/crear", crearEvento);

export default eventosRouter;
