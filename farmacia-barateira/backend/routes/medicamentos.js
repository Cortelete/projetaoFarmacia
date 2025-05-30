const express = require("express");
const router = express.Router();
// Ajuste o caminho se necessário para o modelo correto
const Medicamento = require("../models/medicamentoModel"); 
const db = require("../database/db"); // Mantido para o PUT antigo, mas idealmente seria removido

// Rota para LISTAR todos os medicamentos (GET /api/medicamentos)
router.get("/", (req, res) => {
  Medicamento.listarTodos((err, medicamentos) => {
    if (err) {
      console.error("Erro ao listar medicamentos:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar medicamentos." });
    }
    res.json(medicamentos);
  });
});

// Rota para BUSCAR um medicamento por ID (GET /api/medicamentos/:id)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Medicamento.buscarPorId(id, (err, medicamento) => {
    if (err) {
      console.error(`Erro ao buscar medicamento ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar medicamento." });
    }
    if (!medicamento) {
      return res.status(404).json({ erro: "Medicamento não encontrado." });
    }
    res.json(medicamento);
  });
});

// Rota para CADASTRAR um novo medicamento (POST /api/medicamentos)
router.post("/", (req, res) => {
  const dadosMed = req.body;

  // Validação básica de entrada
  if (!dadosMed.nome || dadosMed.preco === undefined || dadosMed.estoqueAtual === undefined) {
    return res.status(400).json({ erro: "Nome, preço e estoque atual são obrigatórios." });
  }
  if (isNaN(parseFloat(dadosMed.preco)) || parseFloat(dadosMed.preco) < 0) {
      return res.status(400).json({ erro: "Preço inválido." });
  }
   if (isNaN(parseInt(dadosMed.estoqueAtual)) || parseInt(dadosMed.estoqueAtual) < 0) {
      return res.status(400).json({ erro: "Estoque atual inválido." });
  }

  Medicamento.cadastrar(dadosMed, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar medicamento:", err);
      return res.status(500).json({ erro: "Erro interno ao cadastrar medicamento." });
    }
    res.status(201).json({ mensagem: "Medicamento cadastrado com sucesso!", medicamentoId: result.id });
  });
});

// Rota para ATUALIZAR um medicamento por ID (PUT /api/medicamentos/:id)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const dadosMed = req.body;

   // Validação básica de entrada para atualização
  if (dadosMed.preco !== undefined && (isNaN(parseFloat(dadosMed.preco)) || parseFloat(dadosMed.preco) < 0)) {
      return res.status(400).json({ erro: "Preço inválido." });
  }
   if (dadosMed.estoqueAtual !== undefined && (isNaN(parseInt(dadosMed.estoqueAtual)) || parseInt(dadosMed.estoqueAtual) < 0)) {
      return res.status(400).json({ erro: "Estoque atual inválido." });
  }
  if (dadosMed.promocaoAtiva !== undefined && ![0, 1].includes(dadosMed.promocaoAtiva)) {
       return res.status(400).json({ erro: "Valor inválido para promoção ativa (deve ser 0 ou 1)." });
  }

  Medicamento.atualizar(id, dadosMed, (err, result) => {
    if (err) {
      console.error(`Erro ao atualizar medicamento ${id}:`, err);
       if (err.message && err.message.includes("Nenhum campo para atualizar")) {
           return res.status(400).json({ erro: err.message });
       }
      return res.status(500).json({ erro: "Erro interno ao atualizar medicamento." });
    }
    if (result.changes === 0) {
      // Pode ser que o medicamento não exista ou nenhum dado foi alterado
      // Para diferenciar, poderíamos buscar o ID primeiro, mas por simplicidade:
      return res.status(404).json({ erro: "Medicamento não encontrado ou nenhum dado alterado." });
    }
    res.json({ mensagem: "Medicamento atualizado com sucesso!" });
  });
});

// Rota para DELETAR um medicamento por ID (DELETE /api/medicamentos/:id)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Medicamento.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar medicamento ${id}:`, err);
      // Verifica erro de restrição de chave estrangeira (medicamento em venda_itens ou compra_itens)
      if (err.message && err.message.includes("FOREIGN KEY constraint failed")) {
          return res.status(409).json({ erro: "Não é possível deletar o medicamento pois ele possui vendas ou compras associadas." });
      }
      return res.status(500).json({ erro: "Erro interno ao deletar medicamento." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Medicamento não encontrado para deleção." });
    }
    res.json({ mensagem: "Medicamento deletado com sucesso!" });
  });
});


// Rota PUT antiga (baseada em nome) - CONSIDERAR REMOVER OU ADAPTAR
// Esta rota não segue o padrão REST por usar 'nome' no corpo para identificar o recurso
// e por atualizar apenas campos específicos ('estoqueAtual', 'fabricante').
// Mantida por compatibilidade com o código original, mas idealmente seria substituída pelo PUT /:id.
/*
router.put('/', (req, res) => {
  const { nome, campo, valor } = req.body;
  const camposPermitidos = ['estoqueAtual', 'fabricante']; // Adicionar 'preco', 'promocaoAtiva'?

  if (!nome || !campo || valor === undefined) {
      return res.status(400).json({ erro: 'Nome, campo e valor são obrigatórios.' });
  }

  if (!camposPermitidos.includes(campo)) {
    return res.status(400).json({ erro: 'Campo inválido para atualização via esta rota.' });
  }

  // Validação específica para estoque e preço (se adicionado)
  if (campo === 'estoqueAtual' && (isNaN(parseInt(valor)) || parseInt(valor) < 0)) {
      return res.status(400).json({ erro: 'Valor inválido para estoque atual.' });
  }
  // Adicionar validação para preço e promocaoAtiva se incluídos nos camposPermitidos

  // Usar db.run diretamente como no original - NÃO RECOMENDADO
  // O ideal seria ter uma função no Model: Medicamento.atualizarPorNome(nome, { [campo]: valor }, callback)
  db.run(
    `UPDATE medicamentos SET ${campo} = ? WHERE nome = ?`,
    [valor, nome],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      if (this.changes === 0) {
          return res.status(404).json({ erro: 'Medicamento não encontrado com este nome.' });
      }
      res.json({ mensagem: 'Atualizado com sucesso (via rota antiga)' });
    }
  );
});
*/

module.exports = router;

