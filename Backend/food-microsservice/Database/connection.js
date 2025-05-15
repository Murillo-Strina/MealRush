import { createConnection } from 'mysql2';
require('dotenv').config({ path: '../.env' });

const connection = createConnection({
  host: 'trabalhoprog.cl40iigyy6en.sa-east-1.rds.amazonaws.com',
  port: process.env.DB_PORT, 
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'mealrush'
});


connection.connect(function(err) {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com ID ');
});

export default connection;