import express from "express";
import fileUpload from "express-fileupload";
import "./config.js";
import { getFiles, uploadFile, getFile, downloadFile } from "./s3.js";
const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);
app.get("/", async (req, res) => {
  const files = await getFiles();

  res.json(files.Contents);
});
app.get("/file/:fileName", async (req, res) => {
  const { fileName } = req.params;
  const file = await getFile(fileName);
  if (!file) return res.json({ error: "No such file" });
  res.json(file.$metadata);
});
app.get("/download/:fileName", async (req, res) => {
  const { fileName } = req.params;
  const file = await downloadFile(fileName);
  console.log("Download file ");
  res.send("file downloaded");
});

app.post("/files", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({
        status: false,
        message: "No se subieron archivos",
      });
    }

    const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
    const uploadPromises = files.map((file) => uploadFile(file));
    const results = await Promise.all(uploadPromises);

    res.send({
      status: true,
      message: "Archivos subidos",
      data: results.map((result, index) => ({
        name: files[index].name,
        mimetype: files[index].mimetype,
        size: files[index].size,
        s3Result: result,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Error subiendo archivos", details: error.message });
  }
});

app.listen(3000);
console.log("Server on port", 3000);
