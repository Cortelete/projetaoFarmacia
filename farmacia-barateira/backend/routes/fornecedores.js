const express = require("express");
const router = express.Router();
// Ajuste o caminho se necessário
const Fornecedor = require("../models/fornecedorModel"); 

// Rota para LISTAR todos os fornecedores (GET /api/fornecedores)
router.get("/", (req, res) => {
  Fornecedor.listarTodos((err, fornecedores) => {
    if (err) {
      console.error("Erro ao listar fornecedores:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar fornecedores." });
    }
    res.json(fornecedores);
  });
});

// Rota para BUSCAR um fornecedor por ID (GET /api/fornecedores/:id)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Fornecedor.buscarPorId(id, (err, fornecedor) => {
    if (err) {
      console.error(`Erro ao buscar fornecedor ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar fornecedor." });
    }
    if (!fornecedor) {
      return res.status(404).json({ erro: "Fornecedor não encontrado." });
    }
    res.json(fornecedor);
  });
});

// Rota para CADASTRAR um novo fornecedor (POST /api/fornecedores)
router.post("/", (req, res) => {
  const dadosFornecedor = req.body;

  // Validação básica (nome é obrigatório)
  if (!dadosFornecedor.nome) {
    return res.status(400).json({ erro: "Nome do fornecedor é obrigatório." });
  }
  // Poderia adicionar validação de formato de CNPJ aqui

  Fornecedor.cadastrar(dadosFornecedor, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar fornecedor:", err);
      // Verifica erro de CNPJ único (do Model)
      if (err.message && err.message.includes("CNPJ já cadastrado")) {
        return res.status(409).json({ erro: err.message });
      }
      return res.status(500).json({ erro: "Erro interno ao cadastrar fornecedor." });
    }
    res.status(201).json({ mensagem: "Fornecedor cadastrado com sucesso!", fornecedorId: result.id });
  });
});

// Rota para ATUALIZAR um fornecedor por ID (PUT /api/fornecedores/:id)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const dadosFornecedor = req.body;

  // Validação: não permitir atualizar nome para vazio
  if (dadosFornecedor.nome === "") {
      return res.status(400).json({ erro: "Nome do fornecedor não pode ser vazio." });
  }
  // Poderia adicionar validação de formato de CNPJ aqui

  Fornecedor.atualizar(id, dadosFornecedor, (err, result) => {
    if (err) {
      console.error(`Erro ao atualizar fornecedor ${id}:`, err);
      // Verifica erro de CNPJ único (do Model)
      if (err.message && err.message.includes("CNPJ já cadastrado")) {
        return res.status(409).json({ erro: err.message });
      }
       if (err.message && err.message.includes("Nenhum campo para atualizar")) {
           return res.status(400).json({ erro: err.message });
       }
      return res.status(500).json({ erro: "Erro interno ao atualizar fornecedor." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Fornecedor não encontrado ou nenhum dado alterado." });
    }
    res.json({ mensagem: "Fornecedor atualizado com sucesso!" });
  });
});

// Rota para DELETAR um fornecedor por ID (DELETE /api/fornecedores/:id)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Fornecedor.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar fornecedor ${id}:`, err);
      // Verifica erro de FK (do Model)
      if (err.message && err.message.includes("compras associadas")) {
          return res.status(409).json({ erro: err.message });
      }
      return res.status(500).json({ erro: "Erro interno ao deletar fornecedor." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Fornecedor não encontrado para deleção." });
    }
    res.json({ mensagem: "Fornecedor deletado com sucesso!" });
  });
});

module.exports = router;

