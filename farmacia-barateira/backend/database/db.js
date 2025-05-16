const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./farmacia.db');

db.serialize(() => {
  // Tabela fabricantes (para normalizar fabricante em medicamentos)
  db.run(`CREATE TABLE IF NOT EXISTS fabricantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    contato TEXT
  )`);

  // Tabela medicamentos (agora com fabricante_id em vez de texto)
  db.run(`CREATE TABLE IF NOT EXISTS medicamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    principio_ativo TEXT NOT NULL,
    nome_fantasia TEXT,
    fabricante_id INTEGER,
    preco_compra REAL,
    preco_venda REAL,
    estoque INTEGER,
    estoque_minimo INTEGER,
    em_promocao INTEGER DEFAULT 0,
    preco_promocional REAL,
    FOREIGN KEY (fabricante_id) REFERENCES fabricantes(id)
  )`);

  // Tabela cotacoes para armazenar cotações de fabricantes para cada medicamento
  db.run(`CREATE TABLE IF NOT EXISTS cotacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicamento_id INTEGER NOT NULL,
    fabricante_id INTEGER NOT NULL,
    preco REAL NOT NULL,
    data_cotacao TEXT NOT NULL,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    FOREIGN KEY (fabricante_id) REFERENCES fabricantes(id)
  )`);

  // Tabela compras (registro das compras feitas)
  db.run(`CREATE TABLE IF NOT EXISTS compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicamento_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    data_compra TEXT NOT NULL,
    nf_numero TEXT,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id)
  )`);

  // Tabela promocoes (controle de promoções ativas)
  db.run(`CREATE TABLE IF NOT EXISTS promocoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicamento_id INTEGER NOT NULL,
    preco_promocional REAL NOT NULL,
    data_inicio TEXT NOT NULL,
    data_fim TEXT,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id)
  )`);

  // Tabela balconistas (funcionários que atendem o cliente)
  db.run(`CREATE TABLE IF NOT EXISTS balconistas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    salario REAL NOT NULL,
    comissao_percentual REAL NOT NULL
  )`);

  // Tabela clientes (dados dos clientes da farmácia)
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT
  )`);

  // Tabela vendas (registro das vendas feitas)
  db.run(`CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicamento_id INTEGER NOT NULL,
    cliente_id INTEGER,
    balconista_id INTEGER,
    quantidade INTEGER NOT NULL,
    data_venda TEXT NOT NULL,
    preco_total REAL NOT NULL,
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (balconista_id) REFERENCES balconistas(id)
  )`);

  // Tabela filiais (localização das farmácias)
  db.run(`CREATE TABLE IF NOT EXISTS filiais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL
  )`);

  // Estoque por filial (controle de estoque específico por filial)
  db.run(`CREATE TABLE IF NOT EXISTS estoque_filial (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filial_id INTEGER NOT NULL,
    medicamento_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    FOREIGN KEY (filial_id) REFERENCES filiais(id),
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  tipo TEXT DEFAULT 'comum' -- 'admin' ou 'comum'
)`);
});

module.exports = db;
