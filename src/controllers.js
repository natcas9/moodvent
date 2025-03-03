import { eventos } from "./data.js";

//Procesa la creación de cada evento
export function crearEvento(req, res) {
  const { nombre, descripcion, fecha, lugar, hora, precio, estadoAnimo } =
    req.body;
  //validar que la información este completo
  if (
    !nombre ||
    !descripcion ||
    !fecha ||
    !lugar ||
    !hora ||
    !precio ||
    !estadoAnimo
  ) {
    return res.render("paginas/crearevento", {
      error: "Necesitamos que completes los campos requeridos",
    });
  }
  //se crea el evento
  const nuevoEvento = {
    id: eventos.length + 1, // identificador único de cada evento
    nombre,
    descripcion,
    fecha,
    hora,
    lugar,
    precio,
    estadoAnimo,
  };

  eventos.push(nuevoEvento);
  res.redirect("/eventos"); //Donde se mostrarán todos los eventos
}
