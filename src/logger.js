import pino from "pino";
import { config } from "./config.js";
import { join } from "node:path";

const now = new Date();
const logFile = `${now.toISOString().replaceAll(/[^0-9A-Z]/gi, "_")}.log`; // También puedes usar un formato YYYYMMDD

// Configuración de los destinos (file + stdout en desarrollo)
const transportConfig = {
  targets: [
    {
      level: config.logger.level,
      target: "pino/file",
      options: {
        destination: join(config.logs, logFile),
        mkdir: true, // Crea carpeta de logs si no existe
      },
    },
  ],
};

if (!config.isProduction) {
  transportConfig.targets.push({
    level: config.logger.level,
    target: "pino/file",
    options: {
      destination: 1, // stdout
    },
  });
}

// Opciones completas del logger
const loggerOpts = {
  ...config.logger,
  transport: transportConfig,
};

// Captura de errores inesperados
process.on("uncaughtException", (err) => {
  logger.error(err, "uncaughtException");
  process.exitCode = 1;
});

process.on("unhandledRejection", (reason) => {
  logger.error(reason, "unhandledRejection");
});

// Exportar logger ya configurado
export const logger = pino(loggerOpts);
