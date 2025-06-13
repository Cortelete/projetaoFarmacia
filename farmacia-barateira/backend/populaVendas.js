// Conteúdo de populaVendas.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "farmacia.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao DB para popular vendas:", err.message);
    } else {
        console.log("Conectado ao DB para popular vendas.");
    }
});

// IDs de usuários e clientes de teste (verifique seus scripts populaUsuarios.js e populaClientes.js para IDs reais)
const ADMIN_ID = 1; // ID do usuário Admin
const CLIENTE_DONA_FLORINDA_ID = 1; 
const CLIENTE_SEU_MADRUGA_ID = 2;   
const CLIENTE_CHAVES_ID = 3;      
const CLIENTE_CONSUMIDOR_FINAL = null; 

// IDs de medicamentos (verifique seu populaMedicamentos.js para IDs reais)
const MEDICAMENTO_DORFLEXOL = 1;
const MEDICAMENTO_XURUMELOL = 2;
const MEDICAMENTO_RELAXAZO = 3;
const MEDICAMENTO_ANTIDORZIN = 4;
const MEDICAMENTO_VITAMINA_SOLAR = 14; 

const vendasParaPopular = [
    {
        cliente_id: CLIENTE_DONA_FLORINDA_ID, usuario_id: ADMIN_ID, valorTotal: 45.90, formaPagamento: "Dinheiro", observacoes: "Cliente fiel",
        itens: [
            { medicamento_id: MEDICAMENTO_DORFLEXOL, quantidade: 1, precoUnitario: 19.90 },
            { medicamento_id: MEDICAMENTO_XURUMELOL, quantidade: 2, precoUnitario: 7.40 }
        ]
    },
    {
        cliente_id: CLIENTE_SEU_MADRUGA_ID, usuario_id: ADMIN_ID, valorTotal: 15.00, formaPagamento: "PIX", observacoes: "Pagou na hora",
        itens: [
            { medicamento_id: MEDICAMENTO_ANTIDORZIN, quantidade: 1, precoUnitario: 9.80 },
            { medicamento_id: MEDICAMENTO_RELAXAZO, quantidade: 1, precoUnitario: 14.30 }
        ]
    },
    {
        cliente_id: CLIENTE_CONSUMIDOR_FINAL, usuario_id: ADMIN_ID, valorTotal: 30.00, formaPagamento: "Cartão de Crédito", observacoes: "Compra rápida",
        itens: [
            { medicamento_id: MEDICAMENTO_VITAMINA_SOLAR, quantidade: 1, precoUnitario: 30.00 }
        ]
    },
    {
        cliente_id: CLIENTE_CHAVES_ID, usuario_id: ADMIN_ID, valorTotal: 12.40, formaPagamento: "Dinheiro", observacoes: "Troco certo",
        itens: [
            { medicamento_id: MEDICAMENTO_DORFLEXOL, quantidade: 1, precoUnitario: 12.40 }
        ]
    },
    {
        cliente_id: CLIENTE_DONA_FLORINDA_ID, usuario_id: ADMIN_ID, valorTotal: 60.00, formaPagamento: "Cartão de Débito", observacoes: "Grande compra",
        itens: [
            { medicamento_id: MEDICAMENTO_DORFLEXOL, quantidade: 2, precoUnitario: 19.90 },
            { medicamento_id: MEDICAMENTO_XURUMELOL, quantidade: 3, precoUnitario: 7.40 }
        ]
    },
    // Vendas mais antigas para testar períodos
    {
        cliente_id: CLIENTE_CONSUMIDOR_FINAL, usuario_id: ADMIN_ID, valorTotal: 25.00, formaPagamento: "Dinheiro", observacoes: "Venda antiga",
        dataVenda: "2025-05-10 10:00:00",
        itens: [
            { medicamento_id: MEDICAMENTO_RELAXAZO, quantidade: 1, precoUnitario: 14.30 },
            { medicamento_id: MEDICAMENTO_ANTIDORZIN, quantidade: 1, precoUnitario: 9.80 }
        ]
    },
    {
        cliente_id: CLIENTE_SEU_MADRUGA_ID, usuario_id: ADMIN_ID, valorTotal: 50.00, formaPagamento: "PIX", observacoes: "Outra venda antiga",
        dataVenda: "2025-05-15 14:30:00",
        itens: [
            { medicamento_id: MEDICAMENTO_DORFLEXOL, quantidade: 1, precoUnitario: 19.90 },
            { medicamento_id: MEDICAMENTO_XURUMELOL, quantidade: 4, precoUnitario: 7.40 }
        ]
    },
    {
        cliente_id: CLIENTE_DONA_FLORINDA_ID, usuario_id: ADMIN_ID, valorTotal: 30.00, formaPagamento: "Cartão de Crédito", observacoes: "Compra semanal",
        dataVenda: "2025-06-01 11:00:00",
        itens: [
            { medicamento_id: MEDICAMENTO_RELAXAZO, quantidade: 2, precoUnitario: 14.30 }
        ]
    },
    {
        cliente_id: CLIENTE_CHAVES_ID, usuario_id: ADMIN_ID, valorTotal: 20.00, formaPagamento: "Dinheiro", observacoes: "Para o Quico",
        dataVenda: "2025-06-05 09:00:00",
        itens: [
            { medicamento_id: MEDICAMENTO_DORFLEXOL, quantidade: 1, precoUnitario: 19.90 }
        ]
    },
    {
        cliente_id: CLIENTE_CONSUMIDOR_FINAL, usuario_id: ADMIN_ID, valorTotal: 10.00, formaPagamento: "Dinheiro", observacoes: "Remédio básico",
        dataVenda: "2025-06-08 16:00:00",
        itens: [
            { medicamento_id: MEDICAMENTO_ANTIDORZIN, quantidade: 1, precoUnitario: 9.80 }
        ]
    },
    {
        cliente_id: CLIENTE_DONA_FLORINDA_ID, usuario_id: ADMIN_ID, valorTotal: 70.00, formaPagamento: "Cartão de Débito", observacoes: "Renovando o estoque",
        dataVenda: "2025-06-10 13:00:00",
        itens: [
            { medicamento_id: MEDICAMENTO_XURUMELOL, quantidade: 5, precoUnitario: 7.40 },
            { medicamento_id: MEDICAMENTO_VITAMINA_SOLAR, quantidade: 1, precoUnitario: 30.00 }
        ]
    },
    {
        cliente_id: CLIENTE_SEU_MADRUGA_ID, usuario_id: ADMIN_ID, valorTotal: 25.00, formaPagamento: "Dinheiro", observacoes: "Pagou atrasado",
        dataVenda: "2025-06-11 10:00:00",
        itens: [
            { medicamento_id: MEDICAMENTO_RELAXAZO, quantidade: 1, precoUnitario: 14.30 },
            { medicamento_id: MEDICAMENTO_ANTIDORZIN, quantidade: 1, precoUnitario: 9.80 }
        ]
    },
    {
        cliente_id: CLIENTE_CONSUMIDOR_FINAL, usuario_id: ADMIN_ID, valorTotal: 30.00, formaPagamento: "PIX", observacoes: "N/A",
        dataVenda: "2025-06-12 17:00:00",
        itens: [
            { medicamento_id: MEDICAMENTO_DORFLEXOL, quantidade: 1, precoUnitario: 19.90 },
            { medicamento_id: MEDICAMENTO_XURUMELOL, quantidade: 1, precoUnitario: 7.40 }
        ]
    },
    {
        cliente_id: CLIENTE_DONA_FLORINDA_ID, usuario_id: ADMIN_ID, valorTotal: 80.00, formaPagamento: "Cartão de Crédito", observacoes: "Compra mensal",
        dataVenda: "2025-06-13 09:30:00", // Data de hoje
        itens: [
            { medicamento_id: MEDICAMENTO_DORFLEXOL, quantidade: 3, precoUnitario: 19.90 },
            { medicamento_id: MEDICAMENTO_VITAMINA_SOLAR, quantidade: 1, precoUnitario: 30.00 }
        ]
    },
    {
        cliente_id: CLIENTE_SEU_MADRUGA_ID, usuario_id: ADMIN_ID, valorTotal: 40.00, formaPagamento: "Dinheiro", observacoes: "Fiado",
        dataVenda: "2025-06-13 14:00:00", // Data de hoje
        itens: [
            { medicamento_id: MEDICAMENTO_ANTIDORZIN, quantidade: 2, precoUnitario: 9.80 },
            { medicamento_id: MEDICAMENTO_RELAXAZO, quantidade: 1, precoUnitario: 14.30 }
        ]
    }
];

// Função auxiliar para executar uma query de banco de dados como uma Promise
function runQuery(dbInstance, sql, params = []) {
    return new Promise((resolve, reject) => {
        dbInstance.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}

// Função auxiliar para executar uma query all de banco de dados como uma Promise
function allQuery(dbInstance, sql, params = []) {
    return new Promise((resolve, reject) => {
        dbInstance.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function populateVendas() {
    console.log("Iniciando população de vendas...");
    await runQuery(db, "BEGIN TRANSACTION"); // Inicia a transação

    try {
        for (const vendaData of vendasParaPopular) {
            const dataVenda = vendaData.dataVenda || new Date().toISOString().slice(0, 19).replace('T', ' ');

            const vendaResult = await runQuery(db,
                `INSERT INTO vendas (cliente_id, usuario_id, dataVenda, valorTotal, formaPagamento, observacoes) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    vendaData.cliente_id,
                    vendaData.usuario_id,
                    dataVenda,
                    vendaData.valorTotal,
                    vendaData.formaPagamento,
                    vendaData.observacoes
                ]
            );
            const venda_id = vendaResult.lastID;

            for (const item of vendaData.itens) {
                await runQuery(db,
                    `INSERT INTO venda_itens (venda_id, medicamento_id, quantidade, precoUnitario) 
                     VALUES (?, ?, ?, ?)`,
                    [
                        venda_id,
                        item.medicamento_id,
                        item.quantidade,
                        item.precoUnitario
                    ]
                );
            }
        }
        await runQuery(db, "COMMIT"); // Confirma a transação
        console.log("💰 Vendas e itens de venda adicionados com sucesso!");
    } catch (err) {
        console.error("Erro durante a população de vendas (transação será revertida):", err.message);
        await runQuery(db, "ROLLBACK"); // Reverte a transação em caso de erro
        console.error("Transação de vendas revertida.");
    } finally {
        db.close((closeErr) => {
            if (closeErr) console.error("Erro ao fechar DB de vendas:", closeErr.message);
        });
    }
}

populateVendas();