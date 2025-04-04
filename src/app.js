import express from "express";
import session from "express-session";
import pinoHttp from "pino-http";

import { config } from "./config.js";
import { logger } from "./logger.js";
import { errorHandler } from "./middleware/error.js";
import { flashMessages } from "./middleware/flash.js";

import usuariosRouter from "./usuarios/router.js";
import contenidoRouter from "./contenido/router.js";
import eventosRouter from "./routes/eventos.js";

export const app = express();

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", config.vistas);

// Logging con pino
const pinoMiddleware = pinoHttp(config.logger.http(logger));
app.use(pinoMiddleware);

// Middlewares básicos
app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));
app.use(flashMessages);

// Archivos estáticos (CSS, img, etc.)
app.use("/", express.static(config.recursos));

// Ruta principal
app.get("/", (req, res) => {
  res.render("pagina", {
    contenido: "paginas/index",
    session: req.session,
  });
});

// Rutas principales
app.use("/usuarios", usuariosRouter);
app.use("/contenido", contenidoRouter);
app.use("/eventos", eventosRouter);

// Middleware de errores (último)
app.use(errorHandler);
