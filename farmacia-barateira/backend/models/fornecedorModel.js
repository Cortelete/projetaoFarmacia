const db = require("../database/db");

const Fornecedor = {
  // Função para listar todos os fornecedores
  listarTodos: (callback) => {
    const sql = "SELECT id, nome, cnpj FROM fornecedores";
    db.all(sql, callback);
  },

  // Função para buscar um fornecedor pelo ID
  buscarPorId: (id, callback) => {
    const sql = "SELECT id, nome, cnpj FROM fornecedores WHERE id = ?";
    db.get(sql, [id], callback);
  },

  // Função para cadastrar um novo fornecedor
  cadastrar: (fornecedor, callback) => {
    const sql = "INSERT INTO fornecedores (nome, cnpj) VALUES (?, ?)";
    const params = [fornecedor.nome, fornecedor.cnpj];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Erro ao cadastrar fornecedor:", err.message);
        // Verificar erro de CNPJ único
        if (err.message.includes("UNIQUE constraint failed: fornecedores.cnpj")) {
          return callback(new Error("CNPJ já cadastrado."));
        }
        return callback(err);
      }
      callback(null, { id: this.lastID });
    });
  },

  // Função para atualizar um fornecedor
  atualizar: (id, dadosFornecedor, callback) => {
    let fields = [];
    let params = [];

    if (dadosFornecedor.nome) { fields.push("nome = ?"); params.push(dadosFornecedor.nome); }
    if (dadosFornecedor.cnpj) { fields.push("cnpj = ?"); params.push(dadosFornecedor.cnpj); }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar fornecido."));
    }

    params.push(id);
    const sql = `UPDATE fornecedores SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, params, function(err) {
      if (err) {
        console.error("Erro ao atualizar fornecedor:", err.message);
         // Verificar erro de CNPJ único
        if (err.message.includes("UNIQUE constraint failed: fornecedores.cnpj")) {
          return callback(new Error("CNPJ já cadastrado para outro fornecedor."));
        }
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },

  // Função para deletar um fornecedor
  deletar: (id, callback) => {
    // Atenção: A chave estrangeira em 'compras' está configurada como ON DELETE RESTRICT.
    // Isso significa que deletar um fornecedor com compras associadas causará um erro.
    const sql = "DELETE FROM fornecedores WHERE id = ?";
    db.run(sql, [id], function(err) {
      if (err) {
        console.error("Erro ao deletar fornecedor:", err.message);
        // Verificar erro de restrição de chave estrangeira
        if (err.message.includes("FOREIGN KEY constraint failed")) {
            return callback(new Error("Não é possível deletar o fornecedor pois ele possui compras associadas."));
        }
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = Fornecedor;

