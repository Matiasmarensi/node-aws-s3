import express from "express";
import fileUpload from "express-fileupload";
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
  console.log(req.files);
  res.json("subiendo archivo");
});

app.listen(3000);
console.log("Server on port", 3000);
