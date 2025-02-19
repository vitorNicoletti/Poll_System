// REQUISITOS
//
// BANCO DE DADOS MYSQL
// DEVE EXISTIR ENQUETES COM: TITULO, DATA DE INICIO E DATA DE TERMINO
// CADASTRO DE OPCOES DE RESPOSTA DEVE SER DINAMICO, E O MINIMO SÃO 3 OPCOES
// BACKEND: NODEJS
// CRUD COMPLETO
const connection = require('./db/connect');
const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const polls = require('./routes/polls')
const options = require('./routes/options')
const cors = require("cors");

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:4200", methods: ["GET", "POST"] },
});
//middleware
app.use(express.json());
app.use(cors());
//routes
app.use('/api/v1/polls',(req,res,next)=>{
  req.io = io;
  next();
}, polls)
app.use('/api/v1/options', options)


io.on("connection", (socket) => {
  console.log("Client connected!");
  socket.on("disconnect", () => console.log("Cliente disconnected."));
});
const port = process.env.PORT || 3000
const start = async () => {
  try {
    server.listen(port, () => { // ⬅️ ALTERADO para `server.listen`
      console.log(`Server is listening on port ${port}... `);
    });
  } catch (error) {
    console.log(error);
  }
};
start();


module.exports = io