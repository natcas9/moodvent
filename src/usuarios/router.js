import express from "express";
import {
  crearEvento,
  borrarEvento,
  viewCrearEvento,
  modificarEvento,
  viewLogin,
  doLogin,
  doLogout,
} from "./controllers.js";

const eventosRouter = express.Router();

//Rutas para administar eventos
eventosRouter.post("/eventos/crear", crearEvento);
eventosRouter.post("eventos/crear", viewCrearEvento);
eventosRouter.post("/eventos/modificar/:id", modificarEvento);
eventosRouter.post("/eventos/borrar/:id", borrarEvento);

usuariosRouter.get("/login", viewLogin);
usuariosRouter.post("/login", doLogin);
usuariosRouter.get("/logout", doLogout);
export default eventosRouter;

/*import express from 'express';
import { viewLogin, doLogin, doLogout } from './controllers.js';

const usuariosRouter = express.Router();

usuariosRouter.get('/login', viewLogin);
usuariosRouter.post('/login', doLogin);
usuariosRouter.get('/logout', doLogout);

export default usuariosRouter;
*/
