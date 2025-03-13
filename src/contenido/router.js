import express from "express";

const contenidoRouter = express.Router();

contenidoRouter.get("/normal", (req, res) => {
  let contenido = "paginas/noPermisos";
  if (req.session && req.session.login) {
    contenido = "paginas/normal";
  }
  res.render("pagina", {
    contenido,
    session: req.session,
  });
});

contenidoRouter.get("/admin", (req, res) => {
  if (req.session && req.session.esAdmin) {
    res.render("pagina", { contenido: "paginas/admin", session: req.session });
  } else {
    res.render("pagina", {
      contenido: "paginas/noPermisos",
      session: req.session,
    });
  }
});

export default contenidoRouter;
