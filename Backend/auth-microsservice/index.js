import bodyParser from "body-parser";
import express from "express";
const app = express();
import router from "./Routes/routes.js";
import cors from "cors";

const { urlencoded, json } = bodyParser;

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/", router);

app.listen(9000, () => {
  console.log("Auth: Servidor rodando na porta 9000");
});