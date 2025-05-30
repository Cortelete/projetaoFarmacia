const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/authMiddleware"); // Importar middleware

// Importar os modelos necessários
const VendaItens = require("../models/vendaItensModel");

// --- Permissões Definidas ---
// Operações em itens individuais de venda são complexas e podem desalinhar totais/estoque.
// Permitir apenas para Gerente e Administrador.

// Rota para BUSCAR um item de venda específico por ID (GET /api/venda_itens/:id)
router.get("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;
  VendaItens.buscarPorId(id, (err, item) => {
    if (err) {
      console.error(`Erro ao buscar item de venda ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar item de venda." });
    }
    if (!item) {
      return res.status(404).json({ erro: "Item de venda não encontrado." });
    }
    res.json(item);
  });
});

// Rota para ATUALIZAR um item de venda por ID (PUT /api/venda_itens/:id)
// ATENÇÃO: Lógica simplificada. Não atualiza estoque nem total da venda.
router.put("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;
  const dadosItem = req.body; // Espera { quantidade, precoUnitario }

  if (dadosItem.quantidade !== undefined && (isNaN(parseInt(dadosItem.quantidade)) || parseInt(dadosItem.quantidade) <= 0)) {
    return res.status(400).json({ erro: "Quantidade inválida." });
  }
  if (dadosItem.precoUnitario !== undefined && (isNaN(parseFloat(dadosItem.precoUnitario)) || parseFloat(dadosItem.precoUnitario) < 0)) {
    return res.status(400).json({ erro: "Preço unitário inválido." });
  }

  VendaItens.atualizar(id, dadosItem, (err, result) => {
    if (err) {
      console.error(`Erro ao atualizar item de venda ${id}:`, err);
      if (err.message && err.message.includes("Nenhum campo para atualizar")) {
           return res.status(400).json({ erro: err.message });
       }
      return res.status(500).json({ erro: "Erro interno ao atualizar item de venda." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Item de venda não encontrado ou nenhum dado alterado." });
    }
    res.json({ mensagem: "Item de venda atualizado com sucesso! (Atenção: Valor total da venda e estoque podem precisar de ajuste manual/separado)" });
  });
});

// Rota para DELETAR um item de venda por ID (DELETE /api/venda_itens/:id)
// ATENÇÃO: Lógica simplificada. Não restaura estoque nem atualiza total da venda.
router.delete("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;

  VendaItens.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar item de venda ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao deletar item de venda." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Item de venda não encontrado para deleção." });
    }
    res.json({ mensagem: "Item de venda deletado com sucesso! (Atenção: Valor total da venda e estoque precisam ser ajustados manualmente/separadamente)" });
  });
});

module.exports = router;

