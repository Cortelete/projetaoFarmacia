// Conteúdo de /home/ubuntu/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define o caminho absoluto para o arquivo do banco de dados
// Garante que o banco seja criado na raiz do projeto backend
const dbPath = path.resolve(__dirname, "../farmacia.db"); 

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite farmacia.db!");
    // Habilita chaves estrangeiras para esta conexão
    db.run("PRAGMA foreign_keys = ON;", (fkErr) => {
        if (fkErr) {
            console.error("Erro ao habilitar chaves estrangeiras:", fkErr.message);
        } else {
            console.log("Chaves estrangeiras habilitadas para esta conexão.");
        }
    });
  }
});

module.exports = db;