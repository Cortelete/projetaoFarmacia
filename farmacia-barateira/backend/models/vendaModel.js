const db = require("../database/db");

const Venda = {
  // Função para listar todas as vendas (pode incluir JOINs para detalhes)
  listarTodas: (callback) => {
    // Exemplo simples, pode ser expandido com JOINs para nome do cliente e usuário
    const sql = `
      SELECT 
        v.id, v.cliente_id, c.nome as cliente_nome, 
        v.usuario_id, u.nome as usuario_nome, 
        v.dataVenda, v.valorTotal 
      FROM vendas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      JOIN usuarios u ON v.usuario_id = u.id
      ORDER BY v.dataVenda DESC
    `;
    db.all(sql, callback);
  },

  // Função para buscar uma venda pelo ID (pode incluir JOINs)
  buscarPorId: (id, callback) => {
    const sql = `
      SELECT 
        v.id, v.cliente_id, c.nome as cliente_nome, 
        v.usuario_id, u.nome as usuario_nome, 
        v.dataVenda, v.valorTotal 
      FROM vendas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      JOIN usuarios u ON v.usuario_id = u.id
      WHERE v.id = ?
    `;
    db.get(sql, [id], callback);
  },

  // Função para cadastrar uma nova venda (apenas o registro principal da venda)
  // A lógica de adicionar itens e atualizar estoque geralmente fica na Rota/Controller
  cadastrar: (venda, callback) => {
    const sql = "INSERT INTO vendas (cliente_id, usuario_id, valorTotal) VALUES (?, ?, ?)";
    // cliente_id pode ser null
    const params = [venda.cliente_id, venda.usuario_id, venda.valorTotal]; 
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Erro ao cadastrar venda:", err.message);
        return callback(err);
      }
      // Retorna o ID da venda inserida, útil para adicionar os itens da venda
      callback(null, { id: this.lastID }); 
    });
  },

  // Função para atualizar uma venda (geralmente não se atualiza uma venda concluída, talvez status?)
  // Por ora, vamos deixar uma função básica caso seja necessário, mas pode não ser usada.
  atualizar: (id, dadosVenda, callback) => {
    let fields = [];
    let params = [];

    // Exemplo: Permitir atualizar cliente_id ou valorTotal (cuidado com a lógica de negócio)
    if (dadosVenda.cliente_id !== undefined) { fields.push("cliente_id = ?"); params.push(dadosVenda.cliente_id); }
    if (dadosVenda.valorTotal !== undefined) { fields.push("valorTotal = ?"); params.push(dadosVenda.valorTotal); }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar fornecido."));
    }

    params.push(id);
    const sql = `UPDATE vendas SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, params, function(err) {
      if (err) {
        console.error("Erro ao atualizar venda:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },

  // Função para deletar uma venda (e seus itens, devido ao ON DELETE CASCADE)
  deletar: (id, callback) => {
    // Deletar uma venda também deletará os itens associados (venda_itens) 
    // devido à configuração ON DELETE CASCADE na tabela venda_itens.
    const sql = "DELETE FROM vendas WHERE id = ?";
    db.run(sql, [id], function(err) {
      if (err) {
        console.error("Erro ao deletar venda:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = Venda;

