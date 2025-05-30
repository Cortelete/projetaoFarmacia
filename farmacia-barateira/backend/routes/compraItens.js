const express = require("express");
const router = express.Router();

// Importar os modelos necessários
const CompraItens = require("../models/compraItensModel");
// Poderíamos precisar do Compra e Medicamento para lógicas mais complexas
// const Compra = require("../models/compraModel");
// const Medicamento = require("../models/medicamentoModel_atualizado");

// Rota para BUSCAR um item de compra específico por ID (GET /api/compra_itens/:id)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  CompraItens.buscarPorId(id, (err, item) => {
    if (err) {
      console.error(`Erro ao buscar item de compra ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar item de compra." });
    }
    if (!item) {
      return res.status(404).json({ erro: "Item de compra não encontrado." });
    }
    res.json(item);
  });
});

// Rota para ATUALIZAR um item de compra por ID (PUT /api/compra_itens/:id)
// ATENÇÃO: Atualizar um item individualmente pode ter implicações complexas
// na compra geral (valor total) e no estoque. Esta é uma implementação básica.
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const dadosItem = req.body; // Espera { quantidade, precoUnitario }

  // Validações básicas
  if (dadosItem.quantidade !== undefined && (isNaN(parseInt(dadosItem.quantidade)) || parseInt(dadosItem.quantidade) <= 0)) {
    return res.status(400).json({ erro: "Quantidade inválida." });
  }
  if (dadosItem.precoUnitario !== undefined && (isNaN(parseFloat(dadosItem.precoUnitario)) || parseFloat(dadosItem.precoUnitario) < 0)) {
    return res.status(400).json({ erro: "Preço unitário inválido." });
  }

  // Lógica Simplificada: Apenas atualiza o item.
  // Em um sistema real, seria necessário:
  // 1. Buscar o item antigo para saber a diferença de quantidade/preço.
  // 2. Atualizar o estoque (se a quantidade mudou).
  // 3. Recalcular e atualizar o valorTotal na tabela 'compras'.
  // Tudo isso dentro de uma transação.

  CompraItens.atualizar(id, dadosItem, (err, result) => {
    if (err) {
      console.error(`Erro ao atualizar item de compra ${id}:`, err);
      if (err.message && err.message.includes("Nenhum campo para atualizar")) {
           return res.status(400).json({ erro: err.message });
       }
      return res.status(500).json({ erro: "Erro interno ao atualizar item de compra." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Item de compra não encontrado ou nenhum dado alterado." });
    }
    res.json({ mensagem: "Item de compra atualizado com sucesso! (Atenção: Valor total da compra e estoque podem precisar de ajuste manual/separado)" });
  });
});

// Rota para DELETAR um item de compra por ID (DELETE /api/compra_itens/:id)
// ATENÇÃO: Deletar um item individualmente tem implicações complexas.
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Lógica Simplificada: Apenas deleta o item.
  // Em um sistema real, seria necessário:
  // 1. Buscar o item antes de deletar para saber qual medicamento/quantidade era.
  // 2. Reverter o estoque daquele medicamento (diminuir).
  // 3. Recalcular e atualizar o valorTotal na tabela 'compras'.
  // Tudo isso dentro de uma transação.

  CompraItens.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar item de compra ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao deletar item de compra." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Item de compra não encontrado para deleção." });
    }
    res.json({ mensagem: "Item de compra deletado com sucesso! (Atenção: Valor total da compra e estoque precisam ser ajustados manually/separadamente)" });
  });
});

// Não faz sentido ter um POST aqui, pois itens são criados junto com a compra principal.
// A rota GET para listar todos os itens de UMA compra específica já está em compras_route.js.

module.exports = router;

