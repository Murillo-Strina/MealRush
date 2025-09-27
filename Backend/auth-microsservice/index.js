import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import router from "./Routes/routes.js";
import cors from "cors";
import { initRabbitMQ } from "../event-bus/index.js"; 
import { consumeEvent } from "../event-bus/index.js";
import { handleAuthEvent } from "./EventHandler/AuthEventHandler.js";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
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
    const PORT = process.env.PORT || 3020;
    app.listen(PORT, () => {
      console.log(`Auth: Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao inicializar o servidor:", err);
  }
})();
