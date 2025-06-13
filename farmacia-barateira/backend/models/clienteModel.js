// Conteúdo COMPLETO e CORRIGIDO para /backend/models/clienteModel.js

const db = require("../database/db");

const Cliente = {
  // Função para listar todos os clientes, agora buscando todos os campos
  listarTodos: (callback) => {
    const sql = "SELECT id, nome, telefone, endereco, status, emoji, dataCadastro FROM clientes";
    db.all(sql, callback);
  },

  // Função para buscar um cliente pelo ID, agora buscando todos os campos
  buscarPorId: (id, callback) => {
    const sql = "SELECT id, nome, telefone, endereco, status, emoji, dataCadastro FROM clientes WHERE id = ?";
    db.get(sql, [id], callback);
  },

  // Função para cadastrar um novo cliente, agora mais robusta
  cadastrar: (cliente, callback) => {
    // Desestruturamos o objeto cliente com valores padrão para evitar erros
    const { 
        nome, 
        telefone = null, 
        endereco = null, 
        status = 1, // Padrão é 'Ativo'
        emoji = '👤' // Padrão é um emoji genérico
    } = cliente;

    // Verificação essencial para o campo NOT NULL
    if (!nome) {
        return callback(new Error("O campo 'nome' é obrigatório."));
    }

    const sql = "INSERT INTO clientes (nome, telefone, endereco, status, emoji) VALUES (?, ?, ?, ?, ?)";
    const params = [nome, telefone, endereco, status, emoji];
    
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Erro ao cadastrar cliente no banco de dados:", err.message);
        return callback(err);
      }
      callback(null, { id: this.lastID });
    });
  },

  // Função para atualizar um cliente, AGORA INCLUINDO STATUS E EMOJI
  atualizar: (id, dadosCliente, callback) => {
    let fields = [];
    let params = [];

    // Adiciona os campos à query de forma dinâmica, apenas se eles existirem nos dados recebidos
    if (dadosCliente.nome) { fields.push("nome = ?"); params.push(dadosCliente.nome); }
    if (dadosCliente.telefone) { fields.push("telefone = ?"); params.push(dadosCliente.telefone); }
    if (dadosCliente.endereco) { fields.push("endereco = ?"); params.push(dadosCliente.endereco); }
    // A verificação '!= undefined' é crucial para permitir salvar o status 0 (Inativo)
    if (dadosCliente.status !== undefined) { fields.push("status = ?"); params.push(dadosCliente.status); } 
    if (dadosCliente.emoji !== undefined) { fields.push("emoji = ?"); params.push(dadosCliente.emoji); }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar fornecido."));
    }

    params.push(id);
    const sql = `UPDATE clientes SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, params, function(err) {
      if (err) {
        console.error("Erro ao atualizar cliente:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },

  // Função para deletar um cliente
  deletar: (id, callback) => {
    const sql = "DELETE FROM clientes WHERE id = ?";
    db.run(sql, [id], function(err) {
      if (err) {
        console.error("Erro ao deletar cliente:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = Cliente;
