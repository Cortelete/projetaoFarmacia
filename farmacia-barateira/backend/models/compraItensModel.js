const db = require("../database/db");

const CompraItens = {
  // Função para cadastrar um item de compra
  cadastrar: (item, callback) => {
    const sql = "INSERT INTO compra_itens (compra_id, medicamento_id, quantidade, precoUnitario) VALUES (?, ?, ?, ?)";
    const params = [item.compra_id, item.medicamento_id, item.quantidade, item.precoUnitario];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Erro ao cadastrar item da compra:", err.message);
         // Verificar erro de chave estrangeira (compra ou medicamento inexistente)
        if (err.message.includes("FOREIGN KEY constraint failed")) {
            // Poderia verificar qual FK falhou, mas uma mensagem genérica pode ser suficiente
            return callback(new Error("Compra ou Medicamento não encontrado."));
        }
        return callback(err);
      }
      callback(null, { id: this.lastID });
    });
  },

  // Função para listar todos os itens de uma compra específica (com nome do medicamento)
  listarPorCompraId: (compraId, callback) => {
    const sql = `
      SELECT 
        ci.id, ci.compra_id, ci.medicamento_id, 
        m.nome as medicamento_nome, m.principioAtivo as medicamento_principioAtivo,
        ci.quantidade, ci.precoUnitario
      FROM compra_itens ci
      JOIN medicamentos m ON ci.medicamento_id = m.id
      WHERE ci.compra_id = ?
    `;
    db.all(sql, [compraId], callback);
  },

  // Função para buscar um item de compra específico pelo ID
  buscarPorId: (id, callback) => {
     const sql = `
      SELECT 
        ci.id, ci.compra_id, ci.medicamento_id, 
        m.nome as medicamento_nome, m.principioAtivo as medicamento_principioAtivo,
        ci.quantidade, ci.precoUnitario
      FROM compra_itens ci
      JOIN medicamentos m ON ci.medicamento_id = m.id
      WHERE ci.id = ?
    `;
    db.get(sql, [id], callback);
  },

  // Atualizar um item de compra (geralmente não é feito)
  atualizar: (id, dadosItem, callback) => {
    let fields = [];
    let params = [];

    // Campos que poderiam ser atualizados
    if (dadosItem.quantidade !== undefined) { fields.push("quantidade = ?"); params.push(dadosItem.quantidade); }
    if (dadosItem.precoUnitario !== undefined) { fields.push("precoUnitario = ?"); params.push(dadosItem.precoUnitario); }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar fornecido."));
    }

    params.push(id);
    const sql = `UPDATE compra_itens SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, params, function(err) {
      if (err) {
        console.error("Erro ao atualizar item da compra:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },

  // Deletar um item de compra específico
  deletar: (id, callback) => {
    const sql = "DELETE FROM compra_itens WHERE id = ?";
    db.run(sql, [id], function(err) {
      if (err) {
        console.error("Erro ao deletar item da compra:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = CompraItens;

