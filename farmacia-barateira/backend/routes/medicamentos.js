const express = require("express");
const router = express.Router();
const Medicamento = require("../models/medicamentoModel");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// --- Permissões ---
// GET (listar/buscar): Funcionário, Gerente, Administrador
// POST/PUT/DELETE: Gerente, Administrador

// LISTAR medicamentos
router.get("/", verifyToken, checkRole(["Funcionario", "Gerente", "Administrador"]), (req, res) => {
  Medicamento.listarTodos((err, medicamentos) => {
    if (err) {
      console.error("Erro ao listar medicamentos:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar medicamentos." });
    }
    res.json(medicamentos);
  });
});

// BUSCAR medicamento por ID
router.get("/:id", verifyToken, checkRole(["Funcionario", "Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;
  Medicamento.buscarPorId(id, (err, medicamento) => {
    if (err) {
      console.error(`Erro ao buscar medicamento ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar medicamento." });
    }
    if (!medicamento) {
      return res.status(404).json({ erro: "Medicamento não encontrado." });
    }
    res.json(medicamento);
  });
});

// CADASTRAR novo medicamento
router.post("/", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const dadosMed = req.body;

  if (!dadosMed.nome || dadosMed.preco === undefined || dadosMed.estoqueAtual === undefined) {
    return res.status(400).json({ erro: "Nome, preço e estoque atual são obrigatórios." });
  }
  if (isNaN(parseFloat(dadosMed.preco)) || parseFloat(dadosMed.preco) < 0) {
    return res.status(400).json({ erro: "Preço inválido." });
  }
  if (isNaN(parseInt(dadosMed.estoqueAtual)) || parseInt(dadosMed.estoqueAtual) < 0) {
    return res.status(400).json({ erro: "Estoque atual inválido." });
  }

  Medicamento.cadastrar(dadosMed, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar medicamento:", err);
      return res.status(500).json({ erro: "Erro interno ao cadastrar medicamento." });
    }
    res.status(201).json({ mensagem: "Medicamento cadastrado com sucesso!", medicamentoId: result.id });
  });
});

// ATUALIZAR medicamento por ID
router.put("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;
  const dadosMed = req.body;

  if (dadosMed.preco !== undefined && (isNaN(parseFloat(dadosMed.preco)) || parseFloat(dadosMed.preco) < 0)) {
    return res.status(400).json({ erro: "Preço inválido." });
  }
  if (dadosMed.estoqueAtual !== undefined && (isNaN(parseInt(dadosMed.estoqueAtual)) || parseInt(dadosMed.estoqueAtual) < 0)) {
    return res.status(400).json({ erro: "Estoque atual inválido." });
  }
  if (dadosMed.promocaoAtiva !== undefined && ![0, 1].includes(dadosMed.promocaoAtiva)) {
    return res.status(400).json({ erro: "Valor inválido para promoção ativa (deve ser 0 ou 1)." });
  }

  Medicamento.atualizar(id, dadosMed, (err, result) => {
    if (err) {
      console.error(`Erro ao atualizar medicamento ${id}:`, err);
      if (err.message?.includes("Nenhum campo para atualizar")) {
        return res.status(400).json({ erro: err.message });
      }
      return res.status(500).json({ erro: "Erro interno ao atualizar medicamento." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Medicamento não encontrado ou nenhum dado alterado." });
    }
    res.json({ mensagem: "Medicamento atualizado com sucesso!" });
  });
});

// DELETAR medicamento por ID
router.delete("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;

  Medicamento.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar medicamento ${id}:`, err);
      if (err.message?.includes("FOREIGN KEY constraint failed")) {
        return res.status(409).json({ erro: "Não é possível deletar: medicamento com vendas ou compras associadas." });
      }
      return res.status(500).json({ erro: "Erro interno ao deletar medicamento." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Medicamento não encontrado para deleção." });
    }
    res.json({ mensagem: "Medicamento deletado com sucesso!" });
  });
});

module.exports = router;
