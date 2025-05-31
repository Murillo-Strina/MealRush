import { createConnection } from 'mysql2';
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connection = createConnection({
  host: 'mealrush-database.mysql.database.azure.com',
  port: process.env.DB_PORT || 3306, 
  user: 'mealrushadmin',
  password: process.env.DB_PASSWORD,
  database: 'mealrush'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados!');
});

export default connection;
