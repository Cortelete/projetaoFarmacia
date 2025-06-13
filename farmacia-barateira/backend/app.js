// Conteúdo COMPLETO e ATUALIZADO para backend/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Importar TODAS as rotas (usando os nomes finais e simples)
const loginRoutes = require("./routes/login"); 
const usuarioRoutes = require("./routes/usuarios");
const medicamentoRoutes = require("./routes/medicamentos");
const clienteRoutes = require("./routes/clientes"); 
const fornecedorRoutes = require("./routes/fornecedores"); 
const vendaRoutes = require("./routes/vendas"); 
const vendaItensRoutes = require("./routes/vendaItens"); 
const compraRoutes = require("./routes/compras"); 
const compraItensRoutes = require("./routes/compraItens"); 
const dashboardRoutes = require("./routes/dashboard"); // <-- ADICIONADO

const app = express();

// Middlewares essenciais
app.use(cors()); // Habilita CORS para permitir requisições do frontend
app.use(bodyParser.json()); // Habilita o parsing de JSON no corpo das requisições

// Registrar TODAS as rotas com seus prefixos de API
app.use("/api/login", loginRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/medicamentos", medicamentoRoutes);
app.use("/api/clientes", clienteRoutes); 
app.use("/api/fornecedores", fornecedorRoutes); 
app.use("/api/vendas", vendaRoutes); 
app.use("/api/venda_itens", vendaItensRoutes); 
app.use("/api/compras", compraRoutes); 
app.use("/api/compra_itens", compraItensRoutes); 
app.use("/api/dashboard", dashboardRoutes); // <-- ADICIONADO

// Middleware para tratamento de erro genérico (opcional, mas recomendado)
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err.stack);
  res.status(500).send({ erro: "Ocorreu um erro inesperado no servidor!" });
});

module.exports = app;
