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
  },

  consultarCustom: (sql, callback) => {
    db.all(sql, [], callback);
  },

  promover: (id, precoPromocional, callback) => {
    db.get(`SELECT * FROM medicamentos WHERE id = ?`, [id], (err, medicamento) => {
      if (err) return callback(err);
      if (!medicamento) return callback(new Error('Medicamento não encontrado'));

      // Validação 1: preço promocional ≥ compra + 10%
      const precoMinimo = medicamento.preco_compra * 1.10;
      if (precoPromocional < precoMinimo) {
        return callback(new Error('Preço promocional abaixo do mínimo permitido (compra + 10%).'));
      }

      // Validação 2: se já existe promoção com o mesmo princípio ativo, exceto este medicamento
      db.get(`SELECT * FROM medicamentos WHERE principio_ativo = ? AND em_promocao = 1 AND id != ?`, [medicamento.principio_ativo, id], (err, existente) => {
        if (err) return callback(err);
        if (existente) {
          return callback(new Error('Já existe um medicamento com este princípio ativo em promoção.'));
        }

        // Passou as validações: aplicar promoção
        db.run(`UPDATE medicamentos SET em_promocao = 1, preco_promocional = ? WHERE id = ?`, [precoPromocional, id], callback);
      });
    });
  }
};

module.exports = Medicamento;
