const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuarioModel");

// --- Rotas Públicas (sem middleware de autenticação) ---

// Rota para CADASTRAR um novo usuário (POST /api/usuarios)
router.post("/", (req, res) => {
  const { nome, email, senha, cargo } = req.body;

  if (!nome || !email || !senha || !cargo) {
    return res.status(400).json({ erro: "Nome, email, senha e cargo são obrigatórios." });
  }

  const cargosValidos = ["Administrador", "Gerente", "Funcionario"];
  if (!cargosValidos.includes(cargo)) {
    return res.status(400).json({ erro: `Cargo inválido. Cargos permitidos: ${cargosValidos.join(', ')}` });
  }

  Usuario.cadastrar({ nome, email, senha, cargo }, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      if (err.message && err.message.includes("UNIQUE constraint failed: usuarios.email")) {
        return res.status(409).json({ erro: "Este email já está cadastrado." });
      }
      return res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
    }
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
    res.json(usuarios);
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
    res.json(usuario);
  });
});

// Rota para ATUALIZAR um usuário por ID (PUT /api/usuarios/:id)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const dadosUsuario = req.body;

  if (dadosUsuario.cargo) {
    const cargosValidos = ["Administrador", "Gerente", "Funcionario"];
    if (!cargosValidos.includes(dadosUsuario.cargo)) {
      return res.status(400).json({ erro: `Cargo inválido. Cargos permitidos: ${cargosValidos.join(', ')}` });
    }
  }

  Usuario.atualizar(id, dadosUsuario, (err, result) => {
    if (err) {
      console.error(`Erro ao atualizar usuário ${id}:`, err);
      if (err.message && err.message.includes("UNIQUE constraint failed: usuarios.email")) {
        return res.status(409).json({ erro: "Este email já pertence a outro usuário." });
      }
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
      if (err.message && err.message.includes("FOREIGN KEY constraint failed")) {
        return res.status(409).json({ erro: "Não é possível deletar o usuário pois ele possui registros associados (ex: vendas, compras)." });
      }
      return res.status(500).json({ erro: "Erro interno ao deletar usuário." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado para deleção." });
    }
    res.json({ mensagem: "Usuário deletado com sucesso!" });
  });
});

// Rota para registro de novos usuários
router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;

    const usuarioExistente = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarioExistente.length > 0) {
      return res.status(400).json({ message: 'Este email já está cadastrado' });
    }

    await db.query(
      'INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)',
      [nome, email, senha, cargo]
    );

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

module.exports = router;
