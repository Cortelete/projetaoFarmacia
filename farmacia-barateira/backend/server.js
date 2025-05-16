const express = require('express');
const bodyParser = require('body-parser');
const Medicamento = require('./models/medicamentoModel');
const usuarioRoutes = require('./routes/usuarios');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Rota teste simples para ver se o servidor está rodando
app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

// Rota para listar medicamentos
app.get('/medicamentos', (req, res) => {
  Medicamento.listar((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Rota para inserir medicamento
app.post('/medicamentos', (req, res) => {
  Medicamento.inserir(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Medicamento inserido com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.use('/usuarios', usuarioRoutes);