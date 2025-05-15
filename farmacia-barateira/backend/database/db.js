const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./farmacia.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS medicamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    principio_ativo TEXT NOT NULL,
    nome_fantasia TEXT,
    fabricante TEXT,
    preco_compra REAL,
    preco_venda REAL,
    estoque INTEGER,
    estoque_minimo INTEGER
  )`);
});

module.exports = db;
