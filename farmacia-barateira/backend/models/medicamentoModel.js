const db = require('../database/db');

const Medicamento = {
  listarTodos: (callback) => {
    db.all('SELECT * FROM medicamentos', callback);
  },
  cadastrar: (med, callback) => {
    const sql = `
      INSERT INTO medicamentos 
      (nome, principioAtivo, tipo, preco, estoqueAtual, fabricante) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [med.nome, med.principioAtivo, med.tipo, med.preco, med.estoqueAtual, med.fabricante];
    db.run(sql, params, callback);
  }
};

module.exports = Medicamento;
