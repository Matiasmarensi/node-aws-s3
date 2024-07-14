import express from "express";
import fileUpload from "express-fileupload";
import "./config.js";
import { updloadFile } from "./s3.js";
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

app.post("/files", (req, res) => {
  updloadFile(req.files.file);
  res.json("subiendo archivo");
});

app.listen(3000);
console.log("Server on port", 3000);
