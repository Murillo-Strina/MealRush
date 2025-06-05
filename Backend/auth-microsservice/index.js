import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import router from "./Routes/routes.js";
import cors from "cors";
import { initRabbitMQ } from "../event-bus/index.js"; 
import { consumeEvent } from "../event-bus/index.js";
import { handleAuthEvent } from "./EventHandler/AuthEventHandler.js";

dotenv.config();
const app = express();
const { urlencoded, json } = bodyParser;

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/", router);

(async () => {
  try{
    await initRabbitMQ();
    console.log("RabbitMQ inicializado com sucesso!");
    await consumeEvent('auth_events_queue', 'auth.*', handleAuthEvent);
    app.listen(3020, () => {
      console.log("Auth: Servidor rodando na porta 3020");
    });
  } catch (err) {
    console.error("Erro ao inicializar o servidor:", err);
  }
})();
