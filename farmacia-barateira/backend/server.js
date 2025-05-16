const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const medicamentoRoutes = require('./routes/medicamentos');
const usuarioRoutes = require('./routes/usuarios');

const app = express();
const PORT = 3000;

// Middleware para permitir que o frontend acesse o backend
app.use(cors());

// Middleware para permitir que o backend entenda JSON
app.use(bodyParser.json());

// Rotas da API
app.use('/medicamentos', medicamentoRoutes);
app.use('/usuarios', usuarioRoutes);

// Rota teste
app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
