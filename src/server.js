import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

// Servir archivos estáticos desde la carpeta "static"
app.use(express.static(path.join(__dirname, "../static")));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
