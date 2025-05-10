import express from "express";
import session from "express-session";
import pinoHttp from "pino-http";

import { config } from "./config.js";
import { logger } from "./logger.js";
import { errorHandler } from "./middleware/error.js";
import { flashMessages } from "./middleware/flash.js";

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

app.set("view engine", "ejs");
app.set("views", config.vistas);

const pinoMiddleware = pinoHttp(config.logger.http(logger));
app.use(pinoMiddleware);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));
app.use(flashMessages);

app.use("/", express.static(config.recursos));

app.get("/", (req, res) => {
  res.render("pagina", {
    contenido: "paginas/index",
    session: req.session,
  });
});

app.use("/usuarios", usuariosRouter);
app.use("/contenido", contenidoRouter);
app.use("/eventos", eventosRouter);

app.use(errorHandler);
