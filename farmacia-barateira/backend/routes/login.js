const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModel');

router.post('/', (req, res) => {
  const { email, senha } = req.body;
  Usuario.autenticar(email, senha, (err, usuario) => {
    if (err) {
    console.error('Erro ao autenticar usuário:', err); // <--- Aqui o console!
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

    res.json({ mensagem: 'Login realizado com sucesso', usuario });
  });
});

module.exports = router;
