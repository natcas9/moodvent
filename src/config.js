import "dotenv/config";
import { join, dirname } from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);

const isProduction = process.env.NODE_ENV === "production";
const DEFAULT_PORT = 3000;
const DEFAULT_SESSION_SECRET = "no muy secreto";

const port = parseInt(process.env.APP_PORT, 10);
const sessionSecret = process.env.APP_SESSION_SECRET ?? DEFAULT_SESSION_SECRET;

export const config = {
  port: !isNaN(port) ? port : DEFAULT_PORT,

  recursos: join(rootDir, "static"),
  vistas: join(rootDir, "vistas"),
  logs: join(rootDir, "logs"),
  uploads: join(rootDir, "uploads"),

  session: {
    resave: false,
    saveUninitialized: true,
    secret: sessionSecret,
  },

  isProduction,

  logger: {
    level: process.env.APP_LOG_LEVEL ?? (!isProduction ? "debug" : "info"),
    http: (pino) => ({
      logger: pino,
      autoLogging: !isProduction,
      useLevel: "trace",
    }),
  },
};
