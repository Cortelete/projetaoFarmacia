const db = require('../database/db');

const Medicamento = {
  listar: (callback) => {
    db.all("SELECT * FROM medicamentos", [], callback);
  },

inserir: (dados, callback) => {
  const { principio_ativo, nome_fantasia, fabricante, preco_compra, preco_venda, estoque, estoque_minimo } = dados;
  db.run(`INSERT INTO medicamentos (principio_ativo, nome_fantasia, fabricante, preco_compra, preco_venda, estoque, estoque_minimo) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [principio_ativo, nome_fantasia, fabricante, preco_compra, preco_venda, estoque, estoque_minimo],
    callback);
}

consultarCustom: (sql, callback) => {
  db.all(sql, [], callback);
}
};

module.exports = Medicamento;
