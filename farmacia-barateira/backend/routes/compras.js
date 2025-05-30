const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Importar os modelos necessários
const Compra = require("../models/compraModel");
const CompraItens = require("../models/compraItensModel");
const Medicamento = require("../models/medicamentoModel");

// Rota para LISTAR todas as compras (GET /api/compras)
router.get("/", (req, res) => {
  Compra.listarTodas((err, compras) => {
    if (err) {
      console.error("Erro ao listar compras:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar compras." });
    }
    res.json(compras);
  });
});

// Rota para BUSCAR uma compra por ID e seus itens (GET /api/compras/:id)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Compra.buscarPorId(id, (err, compra) => {
    if (err) {
      console.error(`Erro ao buscar compra ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar compra." });
    }
    if (!compra) {
      return res.status(404).json({ erro: "Compra não encontrada." });
    }
    CompraItens.listarPorCompraId(id, (errItens, itens) => {
      if (errItens) {
        console.error(`Erro ao buscar itens da compra ${id}:`, errItens);
        return res.status(500).json({ erro: "Erro ao buscar itens da compra.", compra });
      }
      compra.itens = itens;
      res.json(compra);
    });
  });
});

// Rota para CADASTRAR uma nova compra (POST /api/compras)
router.post("/", async (req, res) => {
  const { fornecedor_id, itens } = req.body;

  if (!fornecedor_id || !itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: "Dados da compra inválidos. Fornecedor e lista de itens são obrigatórios." });
  }

  let valorTotalCompra = 0;
  try {
    for (const item of itens) {
      if (!item.medicamento_id || !item.quantidade || item.quantidade <= 0 || item.precoUnitario === undefined || item.precoUnitario < 0) {
        throw new Error("Item inválido na lista: verifique medicamento_id, quantidade e precoUnitario.");
      }
      valorTotalCompra += item.quantidade * item.precoUnitario;
    }
    valorTotalCompra = parseFloat(valorTotalCompra.toFixed(2));

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      Compra.cadastrar({ fornecedor_id, valorTotal: valorTotalCompra }, (errCompra, resultCompra) => {
        if (errCompra) {
          console.error("Erro ao cadastrar compra (transação):", errCompra);
          db.run("ROLLBACK");
          const msgErro = errCompra.message.includes("FOREIGN KEY constraint failed") ? "Erro ao registrar compra (fornecedor não encontrado)." : "Erro ao iniciar o registro da compra.";
          return res.status(errCompra.message.includes("FOREIGN KEY") ? 404 : 500).json({ erro: msgErro, detalhe: errCompra.message });
        }

        const compraId = resultCompra.id;
        let itensProcessados = 0;
        let erroItem = null;

        itens.forEach(item => {
          if (erroItem) return;

          CompraItens.cadastrar({ ...item, compra_id: compraId }, (errItem) => {
            if (erroItem) return;
            if (errItem) {
              erroItem = errItem;
              console.error("Erro ao cadastrar item da compra (transação):", errItem);
              db.run("ROLLBACK");
              const msgErro = errItem.message.includes("FOREIGN KEY constraint failed") ? "Erro ao registrar item (medicamento não encontrado)." : "Erro ao registrar item da compra.";
              return res.status(errItem.message.includes("FOREIGN KEY") ? 404 : 500).json({ erro: msgErro, detalhe: errItem.message });
            }

            Medicamento.atualizarEstoque(item.medicamento_id, item.quantidade, (errEstoque) => {
              if (erroItem) return;
              if (errEstoque) {
                erroItem = errEstoque;
                console.error("Erro ao atualizar estoque (compra - transação):", errEstoque);
                db.run("ROLLBACK");
                return res.status(500).json({ erro: "Erro inesperado ao atualizar estoque.", detalhe: errEstoque.message });
              }

              itensProcessados++;
              if (itensProcessados === itens.length && !erroItem) {
                db.run("COMMIT");
                return res.status(201).json({ mensagem: "Compra registrada com sucesso!", compraId: compraId });
              }
            });
          });
        });
      });
    });

  } catch (error) {
    console.error("Erro de validação pré-transação (compra):", error);
    return res.status(400).json({ erro: error.message });
  }
});

// Rota para DELETAR uma compra por ID (DELETE /api/compras/:id)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Compra.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar compra ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao deletar compra." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Compra não encontrada para deleção." });
    }
    res.json({ mensagem: "Compra deletada com sucesso! (Estoque não foi revertido automaticamente)" });
  });
});

module.exports = router;
