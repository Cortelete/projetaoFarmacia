const express = require("express");
const router = express.Router();
// Ajuste o caminho se necessário para o modelo correto
const Usuario = require("../models/usuarioModel"); 

// Rota para CADASTRAR um novo usuário (POST /api/usuarios)
// Mantendo a rota original que você tinha, mas usando o modelo atualizado
router.post("/", (req, res) => { // Alterado de /cadastrar para / seguindo padrão REST
  const { nome, email, senha, cargo } = req.body;

  // Validação básica de entrada
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
  }

  Usuario.cadastrar({ nome, email, senha, cargo }, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      // Verifica erro de email único
      if (err.message && err.message.includes("UNIQUE constraint failed: usuarios.email")) {
        return res.status(409).json({ erro: "Este email já está cadastrado." });
      }
      return res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
    }
    // Retorna o ID do usuário criado e uma mensagem de sucesso
    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!", usuarioId: result.id });
  });
});

// Rota para LISTAR todos os usuários (GET /api/usuarios)
router.get("/", (req, res) => {
  Usuario.listarTodos((err, usuarios) => {
    if (err) {
      console.error("Erro ao listar usuários:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar usuários." });
    }
    res.json(usuarios); // Retorna a lista de usuários (sem senhas)
  });
});

// Rota para BUSCAR um usuário por ID (GET /api/usuarios/:id)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Usuario.buscarPorId(id, (err, usuario) => {
    if (err) {
      console.error(`Erro ao buscar usuário ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar usuário." });
    }
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    res.json(usuario); // Retorna o usuário encontrado (sem senha)
  });
});

// Rota para ATUALIZAR um usuário por ID (PUT /api/usuarios/:id)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const dadosUsuario = req.body; // Contém os campos a serem atualizados (nome, email, senha, cargo)

  // Validação: não permitir atualizar para campos vazios se eles forem obrigatórios
  if (dadosUsuario.nome === "" || dadosUsuario.email === "" || dadosUsuario.senha === "") {
      return res.status(400).json({ erro: "Campos obrigatórios não podem ser vazios." });
  }

  Usuario.atualizar(id, dadosUsuario, (err, result) => {
    if (err) {
      console.error(`Erro ao atualizar usuário ${id}:`, err);
       // Verifica erro de email único
      if (err.message && err.message.includes("UNIQUE constraint failed: usuarios.email")) {
        return res.status(409).json({ erro: "Este email já pertence a outro usuário." });
      }
      // Verifica erro de nenhum campo fornecido (do Model)
       if (err.message && err.message.includes("Nenhum campo para atualizar")) {
           return res.status(400).json({ erro: err.message });
       }
      return res.status(500).json({ erro: "Erro interno ao atualizar usuário." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado para atualização." });
    }
    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  });
});

// Rota para DELETAR um usuário por ID (DELETE /api/usuarios/:id)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Usuario.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar usuário ${id}:`, err);
       // Verifica erro de restrição de chave estrangeira (usuário com vendas)
      if (err.message && err.message.includes("FOREIGN KEY constraint failed")) {
          return res.status(409).json({ erro: "Não é possível deletar o usuário pois ele possui vendas associadas." });
      }
      return res.status(500).json({ erro: "Erro interno ao deletar usuário." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado para deleção." });
    }
    res.json({ mensagem: "Usuário deletado com sucesso!" });
  });
});

module.exports = router;

