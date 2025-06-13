// Conteúdo CORRIGIDO E LIMPO para /routes/usuarios.js

const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuarioModel");

// Rota para CADASTRAR um novo usuário (usada pela página de registro)
// POST /api/usuarios/
router.post("/", (req, res) => {
    const { nome, email, senha, cargo } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
    }
    
    // O cargo pode ser opcional, o Model define um padrão
    Usuario.cadastrar({ nome, email, senha, cargo }, (err, result) => {
        if (err) {
            if (err.message && err.message.includes("UNIQUE constraint failed: usuarios.email")) {
                return res.status(409).json({ erro: "Este email já está cadastrado." });
            }
            return res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
        }
        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!", usuarioId: result.id });
    });
});

// --- Rotas a serem protegidas futuramente ---

// Rota para LISTAR todos os usuários
router.get("/", (req, res) => {
    Usuario.listarTodos((err, usuarios) => {
        if (err) {
            return res.status(500).json({ erro: "Erro interno ao buscar usuários." });
        }
        res.json(usuarios);
    });
});

// Rota para BUSCAR um usuário por ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    Usuario.buscarPorId(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({ erro: "Erro interno ao buscar usuário." });
        }
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }
        res.json(usuario);
    });
});

// Rota para ATUALIZAR um usuário por ID
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const dadosUsuario = req.body;

    Usuario.atualizar(id, dadosUsuario, (err, result) => {
        if (err) {
            if (err.message.includes("Nenhum campo para atualizar")) return res.status(400).json({ erro: err.message });
            return res.status(500).json({ erro: "Erro interno ao atualizar usuário." });
        }
        if (result.changes === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }
        res.json({ mensagem: "Usuário atualizado com sucesso!" });
    });
});

// Rota para DELETAR um usuário por ID
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    Usuario.deletar(id, (err, result) => {
        if (err) {
            if (err.message.includes("FOREIGN KEY constraint failed")) {
                return res.status(409).json({ erro: "Não é possível deletar o usuário pois ele possui vendas associadas." });
            }
            return res.status(500).json({ erro: "Erro interno ao deletar usuário." });
        }
        if (result.changes === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }
        res.json({ mensagem: "Usuário deletado com sucesso!" });
    });
});

module.exports = router;