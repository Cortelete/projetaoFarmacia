// Conteúdo de medicamentoModel.js
const db = require("../database/db");

const Medicamento = {
  // Função para listar todos os medicamentos, AGORA COM O NOME DO FORNECEDOR
  listarTodos: (callback) => {
    const sql = `
      SELECT 
        m.id, m.nome, m.principioAtivo, m.tipo, m.preco, m.estoqueAtual, 
        m.fabricante, m.promocaoAtiva, m.fornecedor_id, 
        f.nome AS fornecedor_nome -- Renomeado para evitar conflito
      FROM 
        medicamentos m
      LEFT JOIN 
        fornecedores f ON m.fornecedor_id = f.id
    `;
    db.all(sql, callback);
  },

  // Função para cadastrar um novo medicamento (incluindo promocaoAtiva e fornecedor_id)
  cadastrar: (med, callback) => {
    const promocaoAtiva = med.promocaoAtiva === 1 ? 1 : 0; 
    const sql = `
      INSERT INTO medicamentos 
      (nome, principioAtivo, tipo, preco, estoqueAtual, fabricante, promocaoAtiva, fornecedor_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      med.nome,
      med.principioAtivo,
      med.tipo,
      med.preco,
      med.estoqueAtual,
      med.fabricante,
      promocaoAtiva,
      med.fornecedor_id // Incluindo o fornecedor_id
    ];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Erro ao cadastrar medicamento:", err.message);
        // Adiciona tratamento para erro de UNIQUE constraint (nome já existe)
        if (err.message.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed: medicamentos.nome")) {
          return callback(new Error("Um medicamento com este nome já existe."));
        }
        return callback(err);
      }
      callback(null, { id: this.lastID });
    });
  },

  // Função para buscar um medicamento pelo ID, AGORA COM O NOME DO FORNECEDOR
  buscarPorId: (id, callback) => {
    const sql = `
      SELECT 
        m.id, m.nome, m.principioAtivo, m.tipo, m.preco, m.estoqueAtual, 
        m.fabricante, m.promocaoAtiva, m.fornecedor_id, 
        f.nome AS fornecedor_nome
      FROM 
        medicamentos m
      LEFT JOIN 
        fornecedores f ON m.fornecedor_id = f.id
      WHERE 
        m.id = ?
    `;
    db.get(sql, [id], callback);
  },

  // Função para atualizar um medicamento (incluindo fornecedor_id)
  atualizar: (id, dadosMed, callback) => {
    let fields = [];
    let params = [];

    if (dadosMed.nome) { fields.push("nome = ?"); params.push(dadosMed.nome); }
    if (dadosMed.principioAtivo) { fields.push("principioAtivo = ?"); params.push(dadosMed.principioAtivo); }
    if (dadosMed.tipo) { fields.push("tipo = ?"); params.push(dadosMed.tipo); }
    if (dadosMed.preco !== undefined) { fields.push("preco = ?"); params.push(dadosMed.preco); }
    if (dadosMed.estoqueAtual !== undefined) { fields.push("estoqueAtual = ?"); params.push(dadosMed.estoqueAtual); }
    if (dadosMed.fabricante) { fields.push("fabricante = ?"); params.push(dadosMed.fabricante); }
    if (dadosMed.promocaoAtiva !== undefined) { 
      const promocao = dadosMed.promocaoAtiva === 1 ? 1 : 0;
      fields.push("promocaoAtiva = ?"); 
      params.push(promocao); 
    }
    // Adicionando o fornecedor_id para atualização
    // É importante que o fornecedor_id seja um número ou null
    if (dadosMed.fornecedor_id !== undefined) { 
        fields.push("fornecedor_id = ?"); 
        params.push(dadosMed.fornecedor_id === null ? null : parseInt(dadosMed.fornecedor_id));
    }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar fornecido."));
    }

    params.push(id); 
    const sql = `UPDATE medicamentos SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, params, function(err) {
      if (err) {
        console.error("Erro ao atualizar medicamento:", err.message);
        // Adiciona tratamento para erro de UNIQUE constraint (nome já existe)
        if (err.message.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed: medicamentos.nome")) {
          return callback(new Error("Um medicamento com este nome já existe."));
        }
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },

  // Função para deletar um medicamento
  deletar: (id, callback) => {
    const sql = "DELETE FROM medicamentos WHERE id = ?";
    db.run(sql, [id], function(err) {
      if (err) {
        console.error("Erro ao deletar medicamento:", err.message);
        // Adiciona tratamento para restrições de chave estrangeira
        if (err.message.includes("FOREIGN KEY constraint failed")) {
          return callback(new Error("Não é possível deletar: medicamento com vendas ou compras associadas."));
        }
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },
  
  // Função específica para atualizar estoque (sem alterações, apenas inclusão)
  atualizarEstoque: (id, quantidadeDelta, callback) => {
    const sql = "UPDATE medicamentos SET estoqueAtual = estoqueAtual + ? WHERE id = ? AND estoqueAtual + ? >= 0";
    db.run(sql, [quantidadeDelta, id, quantidadeDelta], function(err) {
      if (err) {
        console.error("Erro ao atualizar estoque:", err.message);
        return callback(err);
      }
      if (this.changes === 0) {
          return callback(new Error("Não foi possível atualizar o estoque. Verifique o ID ou a quantidade (estoque mínimo de 0)."));
      }
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = Medicamento;