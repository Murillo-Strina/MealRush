import bodyParser from "body-parser";
import express from "express";
import router from "./Routes/routes.js";
import cors from "cors";
import dotenv from "dotenv";
import { initRabbitMQ } from "../event-bus/index.js";
import { consumeEvent } from "../event-bus/index.js";
import { handleInstitutionEvent } from "./EventHandler/InstitutionEventHandler.js";

dotenv.config();
const { urlencoded, json } = bodyParser;
const app = express();
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/", router);

(async () => {
  try {
    await initRabbitMQ();
    console.log("RabbitMQ inicializado com sucesso!");
    await consumeEvent('institution_events_queue', 'institution.*', handleInstitutionEvent);
    app.listen(3005, () => {
      console.log("Institution: Servidor rodando na porta 3005");
    });
  } catch (err) {
    console.error("Erro ao inicializar o RabbitMQ:", err);
    process.exit(1);
  }
})();
