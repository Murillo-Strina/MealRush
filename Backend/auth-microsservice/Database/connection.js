import { createConnection } from 'mysql2';
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
console.log("senha do banco: ", process.env.DB_PASSWORD);

const connection = createConnection({
  host: 'trabalhoprog.cl40iigyy6en.sa-east-1.rds.amazonaws.com',
  port: process.env.DB_PORT || 3306, 
  user: 'admin',
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