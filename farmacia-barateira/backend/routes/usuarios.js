const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModel');

// Criar usuário
router.post('/criar', (req, res) => {
  const novoUsuario = req.body;
  Usuario.inserir(novoUsuario, (err) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: err.message });
    }
    res.json({ mensagem: 'Usuário criado com sucesso' });
  });
});

// Listar usuários
router.get('/listar', (req, res) => {
  Usuario.listar((err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
    res.json(rows);
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  Usuario.autenticar(email, senha, (err, usuario) => {
    if (err || !usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }
    res.json({ mensagem: 'Login bem-sucedido', usuario });
  });
});

module.exports = router;
