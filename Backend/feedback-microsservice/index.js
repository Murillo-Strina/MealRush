import bodyParser from "body-parser";
import express from "express";
import router from "./Routes/routes.js";
import cors from "cors";
import dotenv from "dotenv";
import { consumeEvent, initRabbitMQ } from "../event-bus/index.js";
import { handleFeedbackEvent } from "./EventHandler/FeedbackEventHandler.js";

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
    await consumeEvent('feedback_events_queue', 'feedback.*', handleFeedbackEvent);
    app.listen(3015, () => {
      console.log("Food: Servidor rodando na porta 3015");
    });
  } catch (err) {
    console.error("Erro ao inicializar o RabbitMQ:", err);
    process.exit(1);
  }
})();
