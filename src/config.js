// Cargar variables de entorno desde .env
import "dotenv/config";
import { join, dirname } from "node:path"; // ✅ Corrección aquí
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.APP_PORT) || 3000,
  isProduction: process.env.NODE_ENV === "production",

  session: {
    secret: process.env.APP_SESSION_SECRET || "no muy secreto",
    resave: false,
    saveUninitialized: true,
  },

  logs: join(__dirname, "../logs"),
  recursos: join(__dirname, "../static"),
  vistas: join(__dirname, "../vistas"), // ✅ Necesario para app.set("views", ...)

  logger: {
    level: "debug",
  },
};
