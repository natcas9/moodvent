import { config } from "./config.js";
import { app } from "./app.js";
import { getConnection, checkConnection, closeConnection } from "./database.js";
import { inicializaModelos } from "./modelos.js";
import { logger } from "./logger.js";

const db = getConnection();

checkConnection(db);

inicializaModelos(db);

const server = app.listen(config.port, (error) => {
  if (error) {
    logger.error(`Error al iniciar el servidor: ${error}`);
    return;
  }

  const address = server.address();
  let actualPort = typeof address === "string" ? address : String(address.port);
  logger.info(` Servidor escuchando en el puerto ${actualPort}`);
});

process.on("exit", () => {
  logger.info("Cerrando servidor y base de datos");
  server.close();
  closeConnection();
});

process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));
