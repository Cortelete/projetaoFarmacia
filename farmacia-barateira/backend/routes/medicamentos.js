const express = require('express');
const router = express.Router();
const Medicamento = require('../models/medicamentoModel');

// Rota para listar medicamentos
router.get('/', (req, res) => {
  Medicamento.listar((err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

// Inserir medicamento
router.post('/', (req, res) => {
  Medicamento.inserir(req.body, (err) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ mensagem: "Medicamento adicionado com sucesso!" });
  });
});

// Estoque baixo
router.get('/estoque/baixo', (req, res) => {
  const sql = `SELECT * FROM medicamentos WHERE estoque < estoque_minimo`;
  Medicamento.consultarCustom(sql, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

// Aplicar promoção
router.put('/:id/promocao', (req, res) => {
  const id = req.params.id;
  const { preco_promocional } = req.body;

  Medicamento.promover(id, preco_promocional, (err) => {
    if (err) return res.status(400).json({ erro: err.message });
    res.json({ mensagem: 'Promoção aplicada com sucesso!' });
  });
});

// Listar promoções
router.get('/promocoes', (req, res) => {
  Medicamento.consultarCustom(`SELECT * FROM medicamentos WHERE em_promocao = 1`, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

module.exports = router;
