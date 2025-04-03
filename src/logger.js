import pino from "pino";
import { config } from "./config.js";
import { join } from "node:path";

const now = new Date();
const logFile = `${now.toISOString().replaceAll(/[^0-9A-Z]/gi, "_")}.log`;

const transportConfig = {
  targets: [
    {
      level: config.logger.level,
      target: "pino/file",
      options: {
        destination: join(config.logs, logFile),
        mkdir: true,
      },
    },
  ],
};

if (!config.isProduction) {
  transportConfig.targets.push({
    level: config.logger.level,
    target: "pino-pretty",
    options: {
      destination: 1,
      colorize: true,
      translateTime: "SYS:standard",
    },
  });
}

export const logger = pino({
  ...config.logger,
  transport: transportConfig,
});

process.on("uncaughtException", (err) => {
  logger.error(err, "uncaughtException");
  process.exitCode = 1;
});

process.on("unhandledRejection", (reason) =>
  logger.error(reason, "unhandledRejection")
);
