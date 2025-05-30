const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Importar os modelos necessários
const Venda = require("../models/vendaModel");
const VendaItens = require("../models/vendaItensModel");
const Medicamento = require("../models/medicamentoModel");

// Rota para LISTAR todas as vendas (GET /api/vendas)
router.get("/", (req, res) => {
  Venda.listarTodas((err, vendas) => {
    if (err) {
      console.error("Erro ao listar vendas:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar vendas." });
    }
    res.json(vendas);
  });
});

// Rota para BUSCAR uma venda por ID e seus itens (GET /api/vendas/:id)
router.get("/:id", (req, res) => {
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

// Rota para CADASTRAR uma nova venda (POST /api/vendas)
router.post("/", async (req, res) => {
  // Simulação de extração do ID do usuário (removido do token)
  const usuario_id_token = req.body.usuario_id; // Ou defina de outra forma se necessário
  let { cliente_id, usuario_id, itens } = req.body;

  usuario_id = usuario_id_token;

  if (!usuario_id || !itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: "Dados da venda inválidos. Usuário e lista de itens são obrigatórios." });
  }

  let valorTotalVenda = 0;
  try {
    for (const item of itens) {
      if (!item.medicamento_id || !item.quantidade || item.quantidade <= 0 || item.precoUnitario === undefined || item.precoUnitario < 0) {
        throw new Error("Item inválido na lista: verifique medicamento_id, quantidade e precoUnitario.");
      }
      valorTotalVenda += item.quantidade * item.precoUnitario;
    }
    valorTotalVenda = parseFloat(valorTotalVenda.toFixed(2));

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      Venda.cadastrar({ cliente_id, usuario_id, valorTotal: valorTotalVenda }, (errVenda, resultVenda) => {
        if (errVenda) {
          console.error("Erro ao cadastrar venda (transação):", errVenda);
          db.run("ROLLBACK");
          return res.status(500).json({ erro: "Erro ao iniciar o registro da venda.", detalhe: errVenda.message });
        }

        const vendaId = resultVenda.id;
        let itensProcessados = 0;
        let erroItem = null;

        itens.forEach(item => {
          if (erroItem) return;

          VendaItens.cadastrar({ ...item, venda_id: vendaId }, (errItem) => {
            if (erroItem) return;
            if (errItem) {
              erroItem = errItem;
              console.error("Erro ao cadastrar item da venda (transação):", errItem);
              db.run("ROLLBACK");
              return res.status(500).json({ erro: "Erro ao registrar item da venda.", detalhe: erroItem.message });
            }

            Medicamento.atualizarEstoque(item.medicamento_id, -item.quantidade, (errEstoque) => {
              if (erroItem) return;
              if (errEstoque) {
                erroItem = errEstoque;
                console.error("Erro ao atualizar estoque (transação):", errEstoque);
                db.run("ROLLBACK");
                const msgErro = errEstoque.message.includes("insufficient stock") || errEstoque.message.includes("CHECK constraint failed")
                                ? "Erro ao atualizar estoque (quantidade insuficiente)."
                                : "Erro ao atualizar estoque.";
                return res.status(409).json({ erro: msgErro, detalhe: errEstoque.message });
              }

              itensProcessados++;
              if (itensProcessados === itens.length && !erroItem) {
                db.run("COMMIT");
                return res.status(201).json({ mensagem: "Venda registrada com sucesso!", vendaId: vendaId });
              }
            });
          });
        });
      });
    });

  } catch (error) {
    console.error("Erro de validação pré-transação:", error);
    return res.status(400).json({ erro: error.message });
  }
});

// Rota para DELETAR uma venda por ID (DELETE /api/vendas/:id)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Venda.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar venda ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao deletar venda." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Venda não encontrada para deleção." });
    }
    res.json({ mensagem: "Venda deletada com sucesso! (Estoque não foi restaurado automaticamente)" });
  });
});

module.exports = router;
