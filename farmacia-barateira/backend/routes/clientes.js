const express = require("express");
const router = express.Router();
const Cliente = require("../models/clienteModel");
const { verifyToken, checkRole } = require("../middleware/authMiddleware"); // Importar middleware

// --- Permissões Definidas ---
// Listar/Buscar/Cadastrar: Funcionário, Gerente, Administrador
// Atualizar/Deletar: Gerente, Administrador

// Rota para LISTAR todos os clientes (GET /api/clientes)
router.get("/", verifyToken, checkRole(["Funcionario", "Gerente", "Administrador"]), (req, res) => {
  Cliente.listarTodos((err, clientes) => {
    if (err) {
      console.error("Erro ao listar clientes:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar clientes." });
    }
    res.json(clientes);
  });
});

// Rota para BUSCAR um cliente por ID (GET /api/clientes/:id)
router.get("/:id", verifyToken, checkRole(["Funcionario", "Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;
  Cliente.buscarPorId(id, (err, cliente) => {
    if (err) {
      console.error(`Erro ao buscar cliente ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar cliente." });
    }
    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado." });
    }
    res.json(cliente);
  });
});

// Rota para CADASTRAR um novo cliente (POST /api/clientes)
router.post("/", verifyToken, checkRole(["Funcionario", "Gerente", "Administrador"]), (req, res) => {
  const dadosCliente = req.body;

  if (!dadosCliente.nome) {
    return res.status(400).json({ erro: "Nome do cliente é obrigatório." });
  }

  Cliente.cadastrar(dadosCliente, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar cliente:", err);
      return res.status(500).json({ erro: "Erro interno ao cadastrar cliente." });
    }
    res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!", clienteId: result.id });
  });
});

// Rota para ATUALIZAR um cliente por ID (PUT /api/clientes/:id)
router.put("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;
  const dadosCliente = req.body;

  if (dadosCliente.nome === "") {
      return res.status(400).json({ erro: "Nome do cliente não pode ser vazio." });
  }

  Cliente.atualizar(id, dadosCliente, (err, result) => {
    if (err) {
      console.error(`Erro ao atualizar cliente ${id}:`, err);
       if (err.message && err.message.includes("Nenhum campo para atualizar")) {
           return res.status(400).json({ erro: err.message });
       }
      return res.status(500).json({ erro: "Erro interno ao atualizar cliente." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado ou nenhum dado alterado." });
    }
    res.json({ mensagem: "Cliente atualizado com sucesso!" });
  });
});

// Rota para DELETAR um cliente por ID (DELETE /api/clientes/:id)
router.delete("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;

  Cliente.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar cliente ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao deletar cliente." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Cliente não encontrado para deleção." });
    }
    res.json({ mensagem: "Cliente deletado com sucesso! Vendas associadas (se houver) agora não têm mais cliente vinculado." });
  });
});

module.exports = router;

