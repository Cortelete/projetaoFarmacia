// Conteúdo de routes/medicamentos.js
const express = require("express");
const router = express.Router();
const Medicamento = require("../models/medicamentoModel");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// --- Permissões ---
// GET (listar/buscar): Funcionário, Gerente, Administrador
// POST/PUT/DELETE: Gerente, Administrador

// LISTAR medicamentos (o Model agora retorna o nome do fornecedor)
router.get("/", verifyToken, checkRole(["Funcionário", "Gerente", "Administrador"]), (req, res) => {
  Medicamento.listarTodos((err, medicamentos) => {
    if (err) {
      console.error("Erro ao listar medicamentos:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar medicamentos." });
    }
    res.json(medicamentos);
  });
});

// BUSCAR medicamento por ID (o Model agora retorna o nome do fornecedor)
router.get("/:id", verifyToken, checkRole(["Funcionário", "Gerente", "Administrador"]), (req, res) => {
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

// CADASTRAR novo medicamento (AGORA RECEBE fornecedor_id)
router.post("/", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const dadosMed = req.body;

  // Validações adicionadas para fornecedor_id
  if (dadosMed.fornecedor_id === undefined || isNaN(parseInt(dadosMed.fornecedor_id))) {
      return res.status(400).json({ erro: "ID do fornecedor é obrigatório e deve ser um número." });
  }

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
      // Tratamento específico para nome duplicado
      if (err.message.includes("Um medicamento com este nome já existe.")) {
          return res.status(409).json({ erro: err.message });
      }
      return res.status(500).json({ erro: "Erro interno ao cadastrar medicamento." });
    }
    res.status(201).json({ mensagem: "Medicamento cadastrado com sucesso!", medicamentoId: result.id });
  });
});

// ATUALIZAR medicamento por ID (AGORA RECEBE fornecedor_id)
router.put("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;
  const dadosMed = req.body;

  // Validação para fornecedor_id se ele for fornecido na atualização
  if (dadosMed.fornecedor_id !== undefined && isNaN(parseInt(dadosMed.fornecedor_id))) {
      return res.status(400).json({ erro: "ID do fornecedor deve ser um número válido." });
  }

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
      // Tratamento específico para nome duplicado na atualização
      if (err.message.includes("Um medicamento com este nome já existe.")) {
          return res.status(409).json({ erro: err.message });
      }
      return res.status(500).json({ erro: "Erro interno ao atualizar medicamento." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Medicamento não encontrado ou nenhum dado alterado." });
    }
    res.json({ mensagem: "Medicamento atualizado com sucesso!" });
  });
});

// DELETAR medicamento por ID (o model já trata a FK)
router.delete("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;

  Medicamento.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar medicamento ${id}:`, err);
      // O erro de FK já é tratado no Model, apenas repassa
      if (err.message?.includes("Não é possível deletar: medicamento com vendas ou compras associadas.")) {
          return res.status(409).json({ erro: err.message });
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