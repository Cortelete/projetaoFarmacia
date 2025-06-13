// Conteúdo de routes/vendas.js
const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Acesso direto ao DB para transações

// Importar os modelos necessários
const Venda = require("../models/vendaModel");
const VendaItens = require("../models/vendaItensModel");
const Medicamento = require("../models/medicamentoModel");

// Middleware de autenticação e autorização (assumindo que você usa)
const { verifyToken, checkRole } = require("../middleware/authMiddleware"); 

// Funções auxiliares para Promisify db.run (necessário para async/await com transações)
const dbRun = (sql, params) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
    });
});

const dbGet = (sql, params) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});

const dbAll = (sql, params) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});


// Rota para LISTAR todas as vendas
router.get("/", verifyToken, checkRole(["Funcionario", "Gerente", "Administrador"]), (req, res) => {
    Venda.listarTodas((err, vendas) => {
        if (err) {
            console.error("Erro ao listar vendas:", err);
            return res.status(500).json({ erro: "Erro interno ao buscar vendas." });
        }
        res.json(vendas);
    });
});

// Rota para BUSCAR uma venda por ID e seus itens
router.get("/:id", verifyToken, checkRole(["Funcionario", "Gerente", "Administrador"]), (req, res) => {
    const { id } = req.params;
    Venda.buscarPorId(id, (err, venda) => {
        if (err) {
            console.error(`Erro ao buscar venda ${id}:`, err);
            return res.status(500).json({ erro: "Erro interno ao buscar venda." });
        }
        if (!venda) {
            return res.status(404).json({ erro: "Venda não encontrada." });
        }
        VendaItens.listarPorVendaId(id, (errItens, itens) => {
            if (errItens) {
                console.error(`Erro ao buscar itens da venda ${id}:`, errItens);
                return res.status(500).json({ erro: "Erro ao buscar itens da venda.", venda });
            }
            venda.itens = itens;
            res.json(venda);
        });
    });
});

// Rota para CADASTRAR uma nova venda (COM TRANSAÇÃO e ASYNC/AWAIT)
router.post("/", verifyToken, checkRole(["Funcionario", "Gerente", "Administrador"]), async (req, res) => {
    const { cliente_id, usuario_id, itens, formaPagamento, observacoes } = req.body; // Adicionado formaPagamento e observacoes
    const idUsuarioLogado = req.usuario.id; // Supondo que verifyToken adiciona req.usuario
    
    // Use o usuario_id do token, se houver
    const vendedorId = idUsuarioLogado || usuario_id; 

    if (!vendedorId || !itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ erro: "Dados da venda inválidos. Usuário e lista de itens são obrigatórios." });
    }

    let valorTotalVenda = 0;
    for (const item of itens) {
        if (!item.medicamento_id || !item.quantidade || item.quantidade <= 0 || item.precoUnitario === undefined || item.precoUnitario < 0) {
            return res.status(400).json({ erro: "Item inválido na lista: verifique medicamento_id, quantidade e precoUnitario." });
        }
        valorTotalVenda += item.quantidade * item.precoUnitario;
    }
    valorTotalVenda = parseFloat(valorTotalVenda.toFixed(2));

    let vendaId;

    try {
        await dbRun("BEGIN TRANSACTION"); // Inicia a transação

        // 1. Cadastrar a venda principal
        const vendaResult = await dbRun(
            "INSERT INTO vendas (cliente_id, usuario_id, valorTotal, formaPagamento, observacoes) VALUES (?, ?, ?, ?, ?)",
            [cliente_id, vendedorId, valorTotalVenda, formaPagamento, observacoes] // Incluído formaPagamento e observacoes
        );
        vendaId = vendaResult.lastID;

        // 2. Cadastrar cada item da venda e atualizar o estoque
        for (const item of itens) {
            // Verifica o estoque antes de cadastrar o item e atualizar
            const medicamentoAtual = await dbGet("SELECT estoqueAtual FROM medicamentos WHERE id = ?", [item.medicamento_id]);
            if (!medicamentoAtual || medicamentoAtual.estoqueAtual < item.quantidade) {
                throw new Error(`Estoque insuficiente para o medicamento ID ${item.medicamento_id}. Disponível: ${medicamentoAtual ? medicamentoAtual.estoqueAtual : 0}, Solicitado: ${item.quantidade}`);
            }

            await dbRun(
                "INSERT INTO venda_itens (venda_id, medicamento_id, quantidade, precoUnitario) VALUES (?, ?, ?, ?)",
                [vendaId, item.medicamento_id, item.quantidade, item.precoUnitario]
            );

            // Atualizar estoque do medicamento
            await dbRun(
                "UPDATE medicamentos SET estoqueAtual = estoqueAtual - ? WHERE id = ?",
                [item.quantidade, item.medicamento_id]
            );
        }

        await dbRun("COMMIT"); // Confirma a transação
        return res.status(201).json({ mensagem: "Venda registrada com sucesso!", vendaId: vendaId });

    } catch (error) {
        console.error("Erro durante o registro da venda (transação será revertida):", error);
        await dbRun("ROLLBACK"); // Reverte a transação em caso de erro
        
        let errorMessage = "Erro interno ao registrar a venda.";
        if (error.message.includes("Estoque insuficiente")) {
            errorMessage = error.message; // Mensagem de estoque insuficiente
        } else if (error.message.includes("FOREIGN KEY constraint failed")) {
            errorMessage = "Erro de validação: Verifique se cliente, usuário ou medicamento existem.";
        }

        return res.status(500).json({ erro: errorMessage, detalhe: error.message });
    }
});

// Rota para DELETAR uma venda por ID (sem alterações na lógica)
router.delete("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
    const { id } = req.params;

    Venda.deletar(id, (err, result) => {
        if (err) {
            console.error(`Erro ao deletar venda ${id}:`, err);
            return res.status(500).json({ erro: "Erro interno ao deletar venda." });
        }
        if (result.changes === 0) {
            return res.status(404).json({ erro: "Venda não encontrada para deleção." });
        }
        // ATENÇÃO: Se precisar restaurar estoque ao deletar venda, a lógica deve vir aqui.
        // O `populaVendas.js` é um script de população, não restaura estoque ao deletar.
        res.json({ mensagem: "Venda deletada com sucesso! (Estoque não foi restaurado automaticamente)" });
    });
});

module.exports = router;