import { Usuario } from "./usuarios/Usuario.js";
import { Evento } from "./eventos/Evento.js";
import { SugerenciaFeedback } from "./contenido/SugerenciaFeedback.js";


export function inicializaModelos(db) {
  Usuario.initStatements(db);
  Evento.initStatements(db);
  SugerenciaFeedback.initStatements(db);
}
