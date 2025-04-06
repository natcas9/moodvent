import { config } from "./config.js";
import { app } from "./app.js";
import { getConnection, checkConnection, closeConnection } from "./database.js";
import { inicializaModelos } from "./modelos.js";
import { logger } from "./logger.js";

// Obtener la conexión a la base de datos
const db = getConnection();

// Verificar que la conexión funciona
checkConnection(db);

// Inicializar los modelos (como Usuario)
inicializaModelos(db);

// Iniciar el servidor
const server = app.listen(config.port, (error) => {
  if (error) {
    logger.error(`Error al iniciar el servidor: ${error}`);
    return;
  }

  const address = server.address();
  let actualPort = typeof address === "string" ? address : String(address.port);
  logger.info(`✅ Servidor escuchando en el puerto ${actualPort}`);
});

// Cierre limpio al terminar la app
process.on("exit", () => {
  logger.info("🛑 Cerrando servidor y base de datos");
  server.close();
  closeConnection();
});

// Manejo de señales del sistema
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));
