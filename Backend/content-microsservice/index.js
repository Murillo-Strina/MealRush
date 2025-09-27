import bodyParser from "body-parser";
import express from "express";
import router from "./Routes/routes.js";
import cors from "cors";
import dotenv from "dotenv";
import { initRabbitMQ } from "../event-bus/index.js";
import { consumeEvent } from "../event-bus/index.js";
import { handleContentEvent } from "./EventHandler/ContentEventHandler.js";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();
const { urlencoded, json } = bodyParser;

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/", router);

(async () => {
  try {
    await initRabbitMQ();
    console.log("RabbitMQ inicializado com sucesso!");
    await consumeEvent('content_events_queue', 'content.*', handleContentEvent);
    app.listen(3025, () => {
      console.log("Content: Servidor rodando na porta 3025");
    });
  } catch (err) {
    console.error("Erro ao inicializar o RabbitMQ:", err);
    process.exit(1);
  }
})();
