//Se manejan las solicitudes para las vistas de manejo de eventos
import express from "express";
import {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  modificarEvento,
  eliminarEvento,
} from "../models/evento.js";
import session from "express-session";

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
    const { nombre, descripcion, fecha, hora, lugar, precio, estadoAnimo, tematica} =
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
      tematica
    });

    res.redirect("/eventos/visualizar");
  } catch (error) {
    console.error("Error al crear evento:", error);
    res.status(500).send("Error al guardar el evento");
  }
});


//to filter
router.get("/visualizar", (req, res) => {
  try {
    const filtros = {
      estadoAnimo: req.query.estadoAnimo,
      ubicacion: req.query.ubicacion ,
      fecha: req.query.fecha,
      precio: req.query.precio ? parseFloat(req.query.precio) : undefined,
    };

    const eventos = obtenerEventos(filtros); // pass filters to model
    
    res.render("pagina", {
      contenido: "paginas/eventos",
      session: req.session,
      eventos, filtros
    }); 
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).send("Error al obtener los eventos");
  }
});


router.get("/editar/:id", (req, res) => {
  try {
    const evento = obtenerEventoPorId(req.params.id);
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
    modificarEvento(req.params.id, req.body);
    res.redirect("/eventos/visualizar");
  } catch (error) {
    console.error("Error al modificar evento:", error);
    res.status(500).send("Error al modificar el evento");
  }
});

router.post("/eliminar/:id", (req, res) => {
  try {
    eliminarEvento(req.params.id);
    res.redirect("/eventos/visualizar");
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).send("Error al eliminar el evento");
  }
});

router.get("/detalles/:id", (req, res) => {
  try {
    const evento = obtenerEventoPorId(req.params.id);

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
   