var mysql = require('mysql2');

var connection = mysql.createConnection({
  host: 'trabalhoprog.cl40iigyy6en.sa-east-1.rds.amazonaws.com',
  port: 3306, 
  user: 'admin',
  password: 'vendingMarmita',
  database: 'mealrush'
});


connection.connect(function(err) {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com ID ');
});

module.exports = connection;
