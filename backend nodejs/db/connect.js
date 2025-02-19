const mysql = require('mysql2'); // Usar a versão promise diretamente
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;



const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});
connection.connect((err) => {
    if (err) { return console.error(err.message); }
    else{console.log('Connection was successful!')}
    
})



module.exports = connection;
