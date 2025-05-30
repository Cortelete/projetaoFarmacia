const db = require("../database/db");

const Cliente = {
  // Função para listar todos os clientes
  listarTodos: (callback) => {
    const sql = "SELECT id, nome, telefone, endereco FROM clientes";
    db.all(sql, callback);
  },

  // Função para buscar um cliente pelo ID
  buscarPorId: (id, callback) => {
    const sql = "SELECT id, nome, telefone, endereco FROM clientes WHERE id = ?";
    db.get(sql, [id], callback);
  },

  // Função para cadastrar um novo cliente
  cadastrar: (cliente, callback) => {
    const sql = "INSERT INTO clientes (nome, telefone, endereco) VALUES (?, ?, ?)";
    const params = [cliente.nome, cliente.telefone, cliente.endereco];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Erro ao cadastrar cliente:", err.message);
        return callback(err);
      }
      callback(null, { id: this.lastID });
    });
  },

  // Função para atualizar um cliente
  atualizar: (id, dadosCliente, callback) => {
    let fields = [];
    let params = [];

    if (dadosCliente.nome) { fields.push("nome = ?"); params.push(dadosCliente.nome); }
    if (dadosCliente.telefone) { fields.push("telefone = ?"); params.push(dadosCliente.telefone); }
    if (dadosCliente.endereco) { fields.push("endereco = ?"); params.push(dadosCliente.endereco); }

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
    // Atenção: A chave estrangeira em 'vendas' está configurada como ON DELETE SET NULL.
    // Isso significa que deletar um cliente não causará erro se ele tiver vendas, 
    // mas o cliente_id nessas vendas ficará NULL.
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

