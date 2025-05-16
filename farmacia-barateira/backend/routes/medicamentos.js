const express = require('express');
const router = express.Router();
const Medicamento = require('../models/medicamentoModel');
const db = require('../database/db');

router.get('/', (req, res) => {
  Medicamento.listarTodos((err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar medicamentos' });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  Medicamento.cadastrar(req.body, (err) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar medicamento' });
    res.status(201).json({ mensagem: 'Medicamento cadastrado com sucesso' });
  });
});

router.put('/', (req, res) => {
  const { nome, campo, valor } = req.body;
  const camposPermitidos = ['estoqueAtual', 'fabricante'];

  if (!camposPermitidos.includes(campo)) {
    return res.status(400).json({ erro: 'Campo inválido para atualização' });
  }

  db.run(
    `UPDATE medicamentos SET ${campo} = ? WHERE nome = ?`,
    [valor, nome],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ mensagem: 'Atualizado com sucesso' });
    }
  );
});


module.exports = router;
