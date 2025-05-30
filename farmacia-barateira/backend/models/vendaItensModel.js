const db = require("../database/db");

const VendaItens = {
  // Função para cadastrar um item de venda
  cadastrar: (item, callback) => {
    const sql = "INSERT INTO venda_itens (venda_id, medicamento_id, quantidade, precoUnitario) VALUES (?, ?, ?, ?)";
    const params = [item.venda_id, item.medicamento_id, item.quantidade, item.precoUnitario];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Erro ao cadastrar item da venda:", err.message);
        return callback(err);
      }
      callback(null, { id: this.lastID });
    });
  },

  // Função para listar todos os itens de uma venda específica (com nome do medicamento)
  listarPorVendaId: (vendaId, callback) => {
    const sql = `
      SELECT 
        vi.id, vi.venda_id, vi.medicamento_id, 
        m.nome as medicamento_nome, m.principioAtivo as medicamento_principioAtivo,
        vi.quantidade, vi.precoUnitario
      FROM venda_itens vi
      JOIN medicamentos m ON vi.medicamento_id = m.id
      WHERE vi.venda_id = ?
    `;
    db.all(sql, [vendaId], callback);
  },

  // Função para buscar um item de venda específico pelo ID (menos comum, mas pode ser útil)
  buscarPorId: (id, callback) => {
     const sql = `
      SELECT 
        vi.id, vi.venda_id, vi.medicamento_id, 
        m.nome as medicamento_nome, m.principioAtivo as medicamento_principioAtivo,
        vi.quantidade, vi.precoUnitario
      FROM venda_itens vi
      JOIN medicamentos m ON vi.medicamento_id = m.id
      WHERE vi.id = ?
    `;
    db.get(sql, [id], callback);
  },

  // Atualizar um item de venda (geralmente não é feito, mas incluído por completude)
  atualizar: (id, dadosItem, callback) => {
    let fields = [];
    let params = [];

    // Campos que poderiam ser atualizados (cuidado com a lógica de negócio)
    if (dadosItem.quantidade !== undefined) { fields.push("quantidade = ?"); params.push(dadosItem.quantidade); }
    if (dadosItem.precoUnitario !== undefined) { fields.push("precoUnitario = ?"); params.push(dadosItem.precoUnitario); }
    // Geralmente não se muda venda_id ou medicamento_id de um item existente

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar fornecido."));
    }

    params.push(id);
    const sql = `UPDATE venda_itens SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, params, function(err) {
      if (err) {
        console.error("Erro ao atualizar item da venda:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },

  // Deletar um item de venda específico (menos comum que deletar a venda inteira)
  deletar: (id, callback) => {
    const sql = "DELETE FROM venda_itens WHERE id = ?";
    db.run(sql, [id], function(err) {
      if (err) {
        console.error("Erro ao deletar item da venda:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = VendaItens;

