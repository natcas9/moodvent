import express from "express";
import session from "express-session";
import { config } from "./config.js";
import usuariosRouter from "./usuarios/router.js";
import contenidoRouter from "./contenido/router.js";
import eventosRouter from "./routes/eventos.js";
//import usuariosRouter from "./routes/usuarios.js";

export const app = express();

app.set("view engine", "ejs");
app.set("views", config.vistas);

app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));

app.use("/", express.static(config.recursos));
app.get("/", (req, res) => {
  const params = {
    contenido: "paginas/index",
    session: req.session,
  };
  res.render("pagina", params);
});
app.use("/usuarios", usuariosRouter);
app.use("/contenido", contenidoRouter);
app.use("/eventos", eventosRouter);
//app.use("/usuarios", usuariosRouter);

/*
https://www.digitalocean.com/community/tutorials/nodejs-express-basics
https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
https://ejs.co/
https://expressjs.com/en/starter/hello-world.html
https://appsupport.academy/play-by-play-nodejs-express-sessions-storage-configuration



import express from "express";
import session from "express-session";
import { config } from "./config.js";
import usuariosRouter from "./usuarios/router.js";
import contenidoRouter from "./contenido/router.js";

export const app = express();

app.set("view engine", "ejs");
app.set("views", config.vistas);

app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));

app.use("/", express.static(config.recursos));
app.get("/", (req, res) => {
  res.render("pagina", {
    contenido: "paginas/index",
    session: req.session,
  });
});
app.use("/usuarios", usuariosRouter);
app.use("/contenido", contenidoRouter);
*/
