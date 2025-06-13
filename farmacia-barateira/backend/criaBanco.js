// Conteúdo de criaBanco.js (Seu arquivo original)
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define o caminho absoluto para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, "farmacia.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite!");
    }
});

db.serialize(() => {
    console.log("Iniciando criação/verificação das tabelas...");

    // Habilita chaves estrangeiras (importante para o SQLite)
    db.run("PRAGMA foreign_keys = ON;", (err) => {
        if (err) {
            console.error("Erro ao habilitar chaves estrangeiras:", err.message);
        } else {
            console.log("Chaves estrangeiras habilitadas.");
        }
    });

    // Tabela usuarios (sem alterações)
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        cargo TEXT DEFAULT 'Funcionário'
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela usuarios:", err.message); else console.log("Tabela usuarios OK.");
    });

    // Tabela clientes (sem alterações)
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT,
        endereco TEXT,
        status INTEGER DEFAULT 1,
        emoji TEXT,
        dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela clientes:", err.message); else console.log("Tabela clientes OK.");
    });

    // Tabela fornecedores (ATUALIZADA com novos campos e estrutura)
    db.run(`CREATE TABLE IF NOT EXISTS fornecedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,          -- Nome principal (fantasia ou razão social)
        nomeFantasia TEXT,           -- Novo: Nome fantasia
        razaoSocial TEXT,            -- Novo: Razão Social
        cnpj TEXT UNIQUE NOT NULL,   -- CNPJ deve ser único e não nulo
        email TEXT,
        telefone TEXT,
        endereco TEXT,
        categorias TEXT              -- Pode ser um JSON string de categorias
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela fornecedores:", err.message); else console.log("Tabela fornecedores OK.");
    });

    // Tabela medicamentos (ATUALIZADA com fornecedor_id e chave estrangeira)
    db.run(`CREATE TABLE IF NOT EXISTS medicamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        principioAtivo TEXT,
        tipo TEXT,
        preco REAL NOT NULL CHECK(preco >= 0),
        estoqueAtual INTEGER NOT NULL CHECK(estoqueAtual >= 0),
        fabricante TEXT,             -- Campo 'fabricante' original mantido
        promocaoAtiva INTEGER DEFAULT 0 CHECK(promocaoAtiva IN (0, 1)),
        fornecedor_id INTEGER,       -- NOVO CAMPO: ID do fornecedor
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores (id) ON DELETE RESTRICT -- Impede deletar fornecedor se tiver medicamentos
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela medicamentos:", err.message); else console.log("Tabela medicamentos OK.");
    });

    // Tabela vendas (sem alterações)
    db.run(`CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER, 
        usuario_id INTEGER NOT NULL,
        dataVenda DATETIME DEFAULT CURRENT_TIMESTAMP,
        valorTotal REAL NOT NULL CHECK(valorTotal >= 0),
        formaPagamento TEXT,
        observacoes TEXT, 
        FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE SET NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE RESTRICT
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela vendas:", err.message); else console.log("Tabela vendas OK.");
    });
    
    // Tabela venda_itens (sem alterações)
    db.run(`CREATE TABLE IF NOT EXISTS venda_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id INTEGER NOT NULL,
        medicamento_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL CHECK(quantidade > 0),
        precoUnitario REAL NOT NULL CHECK(precoUnitario >= 0),
        FOREIGN KEY (venda_id) REFERENCES vendas (id) ON DELETE CASCADE,
        FOREIGN KEY (medicamento_id) REFERENCES medicamentos (id) ON DELETE RESTRICT
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela venda_itens:", err.message); else console.log("Tabela venda_itens OK.");
    });

    // Tabela compras (sem alterações)
    db.run(`CREATE TABLE IF NOT EXISTS compras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fornecedor_id INTEGER NOT NULL,
        dataCompra DATETIME DEFAULT CURRENT_TIMESTAMP,
        valorTotal REAL NOT NULL CHECK(valorTotal >= 0),
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores (id) ON DELETE RESTRICT
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela compras:", err.message); else console.log("Tabela compras OK.");
    });

    // Tabela compra_itens (sem alterações)
    db.run(`CREATE TABLE IF NOT EXISTS compra_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compra_id INTEGER NOT NULL,
        medicamento_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL CHECK(quantidade > 0),
        precoUnitario REAL NOT NULL CHECK(precoUnitario >= 0),
        FOREIGN KEY (compra_id) REFERENCES compras (id) ON DELETE CASCADE,
        FOREIGN KEY (medicamento_id) REFERENCES medicamentos (id) ON DELETE RESTRICT
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela compra_itens:", err.message); else console.log("Tabela compra_itens OK.");
    });

    // Usuário de teste Admin (mantido como está)
    db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, cargo) VALUES 
        ('Admin', 'admin@teste.com', '123456', 'Administrador')`, (err) => {
        if (err) console.error("Erro ao inserir usuário admin:", err.message); else console.log("Usuário admin OK.");
    });

    db.close((err) => {
        if (err) {
            console.error("Erro ao fechar o banco de dados:", err.message);
        } else {
            console.log("Banco de dados verificado/criado e conexão fechada.");
        }
    });
});