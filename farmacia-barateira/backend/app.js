const express = require('express');
const app = express();
const medicamentosRouter = require('./routes/medicamentos');

app.use(express.json());

app.use('/medicamentos', medicamentosRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
