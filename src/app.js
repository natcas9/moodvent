import express from "express";
import session from "express-session";
import { config } from "./config.js";
import usuariosRouter from "./usuarios/router.js";
import contenidoRouter from "./contenido/router.js";
import eventosRouter from "./routes/eventos.js";
import { errorHandler } from "./error/error.js";

export const app = express();

app.set("view engine", "ejs");
app.set("views", config.vistas);

app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));

app.use("/", express.static(config.recursos));

app.use((req, res, next) => {
  res.setFlash = (msg) => (req.session.flashMsg = msg);
  res.locals.getAndClearFlash = () => {
    const msg = req.session.flashMsg;
    delete req.session.flashMsg;
    return msg;
  };
  next();
});

app.use("/usuarios", usuariosRouter);
app.use("/contenido", contenidoRouter);
app.use("/eventos", eventosRouter);

app.use(errorHandler);
