import bodyParser from "body-parser";
import express from "express";
import router from "./Routes/routes.js";
import cors from "cors";
import dotenv from "dotenv";
import { initRabbitMQ, consumeEvent } from "../event-bus/index.js";
import { handleFoodEvent } from "./EventHandler/FoodEventHandler.js";

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
    await consumeEvent('food_events_queue','food.*',handleFoodEvent);
    app.listen(3000, () => {
      console.log("Food: Servidor rodando na porta 3000");
    });
  } catch (err) {
    console.error("Erro ao inicializar o RabbitMQ:", err);
    process.exit(1);
  }
})();

