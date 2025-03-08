import express from "express";
import { crearEvento } from "../models/evento.js"; // Asegúrate de que el path es correcto

const router = express.Router();

// Ruta para manejar la creación de eventos (POST /eventos/crear)
router.post("/crear", (req, res) => {
  try {
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

export default router;
