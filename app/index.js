const express = require("express");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const storage = new Storage();
const bucketName = "bucket-equipo1";

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const [files] = await storage.bucket(bucketName).getFiles();
  let totalSize = 0;
  let lista = "";

  files.forEach(file => {
    totalSize += Number(file.metadata.size);
    lista += `
      <li>
        ${file.name}
        <a href="/download/${file.name}">Descargar</a>
      </li>`;
  });

  res.send(`
    <h1>Gestión de Archivos</h1>

    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="file" required>
      <button type="submit">Subir</button>
    </form>

    <h2>Archivos almacenados</h2>
    <ul>${lista}</ul>

    <h2>Estadísticas</h2>
    <p>Total de archivos: ${files.length}</p>
    <p>Tamaño total: ${(totalSize / 1024).toFixed(2)} KB</p>
  `);
});

app.post("/", upload.single("file"), async (req, res) => {
  const file = storage.bucket(bucketName).file(req.file.originalname);
  await file.save(req.file.buffer);
  res.redirect("/");
});

app.get("/download/:name", async (req, res) => {
  const file = storage.bucket(bucketName).file(req.params.name);
  res.setHeader("Content-Disposition", `attachment; filename=${req.params.name}`);
  file.createReadStream().pipe(res);
});

app.listen(3000, () => {
  console.log("Node app corriendo en puerto 3000");
});
//exports.app=app;