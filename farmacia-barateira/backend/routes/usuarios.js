const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarioModel');

router.post('/cadastrar', (req, res) => {
  Usuario.cadastrar(req.body, (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
  });
});

module.exports = router;
