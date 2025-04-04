import { config } from "./config.js";
import { app } from "./app.js";
import { getConnection, checkConnection, closeConnection } from "./database.js";
import { logger } from "./logger.js";
// import { inicializaModelos } from './modelos.js'; // Si decides usar modelos en el futuro

// Inicializa la conexión a la base de datos
const db = getConnection();
checkConnection(db);
// inicializaModelos(db); // Si usas modelos personalizados

// Inicia el servidor
const server = app.listen(config.port, (error) => {
  if (error) return logger.error(`Error al iniciar el servidor: ${error}`);

  const address = server.address();
  const actualPort = typeof address === "string" ? address : address?.port;

  logger.info(` Server is listening on port ${actualPort}`);
});

// Cierre seguro al salir
process.on("exit", () => {
  server.close();
  closeConnection();
  logger.info(" Servidor cerrado correctamente");
});

// Manejo de señales del sistema
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));
