import express from "express";
import fileUpload from "express-fileupload";
import "./config.js";
import { uploadFile } from "./s3.js";
const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);
app.get("/", (req, res) => {
  res.json("probando s3");
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
