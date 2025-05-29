import bodyParser from "body-parser";
import express from "express";
import router from "./Routes/routes.js";
import cors from "cors";
import dotenv from "dotenv";
import { initRabbitMQ } from "../event-bus/index.js";

dotenv.config();
const app = express();
const { urlencoded, json } = bodyParser;

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/", router);

(async () => {
  try {
    await initRabbitMQ();
    console.log("RabbitMQ inicializado com sucesso!");
    app.listen(3010, () => {
      console.log("Machine: Servidor rodando na porta 3010");
    });
  } catch (err) {
    console.error("Erro ao inicializar o RabbitMQ:", err);
    process.exit(1);
  }
})();