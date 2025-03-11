import express from "express";
import { getConnection } from "../database.js";

import { crearEvento, obtenerEventos } from "../models/evento.js";
//import { obtenerEventos } from "../models/evento.js";

const router = express.Router();

router.get("/crearEventos", (req, res) => {
  try {
    res.render("paginas/crearEventos");
  } catch (error) {
    console.error(" Error al cargar la página de creación de eventos:", error);
    res.status(500).send("Error al cargar la página");
  }
});

router.post("/crear", (req, res) => {
  try {
    console.log(" Datos recibidos del formulario:", req.body);

    const { nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo } =
      req.body;

    if (
      !nombre ||
      !descripcion ||
      !fecha ||
      !hora ||
      !lugar ||
      !precio ||
      !estadoAnimo
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    crearEvento({
      nombre,
      descripcion,
      fecha,
      hora,
      lugar,
      precio,
      estadoAnimo,
    });

    res.redirect("/eventos/visualizar");
  } catch (error) {
    console.error("Error al crear evento:", error);
    res.status(500).send("Error al guardar el evento");
  }
});

router.get("/visualizar", (req, res) => {
  try {
    const eventos = obtenerEventos();
    res.render("paginas/eventos.ejs", { eventos });
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).send("Error al obtener los eventos");
  }
});

router.get("/editar/:id", (req, res) => {
  try {
    const { id } = req.params;
    const db = getConnection();
    const evento = db.prepare("SELECT * FROM eventos WHERE id = ?").get(id);

    if (!evento) {
      return res.status(404).send("Evento no encontrado");
    }

    res.render("paginas/modificarEvento", { evento });
  } catch (error) {
    console.error("Error al obtener el evento:", error);
    res.status(500).send("Error al obtener el evento");
  }
});

router.post("/modificar/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo } =
      req.body;
    const db = getConnection();

    db.prepare(
      `
      UPDATE eventos 
      SET nombre = ?, descripcion = ?, fecha = ?, hora = ?, lugar = ?, precio = ?, estadoAnimo = ? 
      WHERE id = ?
    `
    ).run(nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo, id);

    res.redirect("/eventos/visualizar");
  } catch (error) {
    console.error("Error al modificar evento:", error);
    res.status(500).send("Error al modificar el evento");
  }
});

router.post("/eliminar/:id", (req, res) => {
  try {
    const { id } = req.params;
    const db = getConnection();
    db.prepare("DELETE FROM eventos WHERE id = ?").run(id);
    res.redirect("/eventos/visualizar");
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).send("Error al eliminar el evento");
  }
});

router.get("/detalles/:id", (req, res) => {
  try {
    const { id } = req.params;
    const db = getConnection();
    const evento = db.prepare("SELECT * FROM eventos WHERE id = ?").get(id);

    if (!evento) {
      return res.status(404).send("Evento no encontrado");
    }

    res.render("paginas/detallesEvento", { evento });
  } catch (error) {
    console.error("Error al obtener los detalles del evento:", error);
    res.status(500).send("Error al obtener el evento");
  }
});

export default router;
