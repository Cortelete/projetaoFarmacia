const db = require("../database/db");

const Compra = {
  // Função para listar todas as compras (com nome do fornecedor)
  listarTodas: (callback) => {
    const sql = `
      SELECT 
        c.id, c.fornecedor_id, f.nome as fornecedor_nome, 
        c.dataCompra, c.valorTotal 
      FROM compras c
      JOIN fornecedores f ON c.fornecedor_id = f.id
      ORDER BY c.dataCompra DESC
    `;
    db.all(sql, callback);
  },

  // Função para buscar uma compra pelo ID (com nome do fornecedor)
  buscarPorId: (id, callback) => {
    const sql = `
      SELECT 
        c.id, c.fornecedor_id, f.nome as fornecedor_nome, 
        c.dataCompra, c.valorTotal 
      FROM compras c
      JOIN fornecedores f ON c.fornecedor_id = f.id
      WHERE c.id = ?
    `;
    db.get(sql, [id], callback);
  },

  // Função para cadastrar uma nova compra (registro principal)
  // A lógica de adicionar itens e atualizar estoque geralmente fica na Rota/Controller
  cadastrar: (compra, callback) => {
    const sql = "INSERT INTO compras (fornecedor_id, valorTotal) VALUES (?, ?)";
    const params = [compra.fornecedor_id, compra.valorTotal]; 
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Erro ao cadastrar compra:", err.message);
        // Verificar erro de chave estrangeira (fornecedor inexistente)
        if (err.message.includes("FOREIGN KEY constraint failed")) {
            return callback(new Error("Fornecedor não encontrado."));
        }
        return callback(err);
      }
      // Retorna o ID da compra inserida, útil para adicionar os itens da compra
      callback(null, { id: this.lastID }); 
    });
  },

  // Função para atualizar uma compra (geralmente não se atualiza uma compra concluída)
  // Incluída por completude, mas pode não ser usada.
  atualizar: (id, dadosCompra, callback) => {
    let fields = [];
    let params = [];

    // Exemplo: Permitir atualizar fornecedor_id ou valorTotal (cuidado com a lógica)
    if (dadosCompra.fornecedor_id !== undefined) { fields.push("fornecedor_id = ?"); params.push(dadosCompra.fornecedor_id); }
    if (dadosCompra.valorTotal !== undefined) { fields.push("valorTotal = ?"); params.push(dadosCompra.valorTotal); }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar fornecido."));
    }

    params.push(id);
    const sql = `UPDATE compras SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, params, function(err) {
      if (err) {
        console.error("Erro ao atualizar compra:", err.message);
        // Verificar erro de chave estrangeira (fornecedor inexistente)
        if (err.message.includes("FOREIGN KEY constraint failed")) {
            return callback(new Error("Fornecedor não encontrado para atualização."));
        }
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },

  // Função para deletar uma compra (e seus itens, devido ao ON DELETE CASCADE)
  deletar: (id, callback) => {
    // Deletar uma compra também deletará os itens associados (compra_itens) 
    // devido à configuração ON DELETE CASCADE na tabela compra_itens.
    const sql = "DELETE FROM compras WHERE id = ?";
    db.run(sql, [id], function(err) {
      if (err) {
        console.error("Erro ao deletar compra:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = Compra;

