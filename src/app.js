import express from "express";
import session from "express-session";
import pinoHttp from "pino-http";
import asyncHandler from "express-async-handler";
import multer from "multer";
import { config } from "./config.js";
import { logger } from "./logger.js";
import { errorHandler } from "./middleware/error.js";
import { flashMessages } from "./middleware/flash.js";
import { crearEvento } from "./eventos/controllers.js";

import usuariosRouter from "./usuarios/router.js";
import contenidoRouter from "./contenido/router.js";
import eventosRouter from "./eventos/router.js";

export const app = express();
import multer from "multer";

import { procesarFormulario, viewImagen } from "./simple/controladores.js";

const upload = multer({ dest: config.uploads });

app.set("view engine", "ejs");
app.set("views", config.vistas);

app.use("/", express.static(config.recursos));

app.post(
  "/procesar_formulario.html",
  upload.single("foto"),
  procesarFormulario
);

app.get("/imagen/:id", viewImagen);

// Configuración de multer
const upload = multer({ dest: config.uploads }); // Aquí se especifica el directorio donde se guardarán los archivos

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));
app.use(flashMessages);

app.set("view engine", "ejs");
app.set("views", config.vistas);

// Configuración de pino para logs
const pinoMiddleware = pinoHttp(config.logger.http(logger));
app.use(pinoMiddleware);

// Ruta para crear un evento que maneja la carga de imágenes
app.post("/eventos/crear", upload.single("foto"), asyncHandler(crearEvento)); // Aquí se usa el middleware multer para manejar la imagen

app.use("/", express.static(config.recursos));

app.get("/", (req, res) => {
  res.render("pagina", {
    contenido: "paginas/index",
    session: req.session,
  });
});
app.get("/imagen/:id", (req, res) => {
  const imagen = req.params.id;
  res.sendFile(join(config.uploads, imagen)); // Esta ruta sirve para mostrar la imagen cargada
});

app.use("/usuarios", usuariosRouter);
app.use("/contenido", contenidoRouter);
app.use("/eventos", eventosRouter);

app.use(errorHandler);
