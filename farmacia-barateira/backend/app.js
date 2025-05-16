const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const loginRoutes = require('./routes/login');
const usuarioRoutes = require('./routes/usuarios');
const medicamentoRoutes = require('./routes/medicamentos');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/login', loginRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/medicamentos', medicamentoRoutes);

module.exports = app;
