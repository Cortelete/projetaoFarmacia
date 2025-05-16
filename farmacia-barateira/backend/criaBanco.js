const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('farmacia.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS medicamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    principioAtivo TEXT,
    tipo TEXT,
    preco REAL,
    estoqueAtual INTEGER,
    fabricante TEXT
  )`);

  // Usuário de teste
  db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha) VALUES 
    ('Admin', 'admin@teste.com', '123456')`);
});

db.close(() => {
  console.log("Banco de dados criado e populado com sucesso!");
});
