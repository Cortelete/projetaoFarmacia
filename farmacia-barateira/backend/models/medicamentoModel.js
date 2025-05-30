const db = require("../database/db");

const Medicamento = {
  // Função para listar todos os medicamentos
  listarTodos: (callback) => {
    // Inclui todos os campos, inclusive promocaoAtiva
    const sql = "SELECT id, nome, principioAtivo, tipo, preco, estoqueAtual, fabricante, promocaoAtiva FROM medicamentos";
    db.all(sql, callback);
  },

  // Função para cadastrar um novo medicamento (incluindo promocaoAtiva)
  cadastrar: (med, callback) => {
    // Define promocaoAtiva como 0 (Não) se não for fornecido
    const promocaoAtiva = med.promocaoAtiva === 1 ? 1 : 0; 
    const sql = `
      INSERT INTO medicamentos 
      (nome, principioAtivo, tipo, preco, estoqueAtual, fabricante, promocaoAtiva) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      med.nome,
      med.principioAtivo,
      med.tipo,
      med.preco,
      med.estoqueAtual,
      med.fabricante,
      promocaoAtiva // Usa o valor tratado
    ];
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Erro ao cadastrar medicamento:", err.message);
        return callback(err);
      }
      callback(null, { id: this.lastID });
    });
  },

  // Função para buscar um medicamento pelo ID
  buscarPorId: (id, callback) => {
    const sql = "SELECT id, nome, principioAtivo, tipo, preco, estoqueAtual, fabricante, promocaoAtiva FROM medicamentos WHERE id = ?";
    db.get(sql, [id], callback);
  },

  // Função para atualizar um medicamento
  atualizar: (id, dadosMed, callback) => {
    let fields = [];
    let params = [];

    // Adiciona campos permitidos para atualização
    if (dadosMed.nome) { fields.push("nome = ?"); params.push(dadosMed.nome); }
    if (dadosMed.principioAtivo) { fields.push("principioAtivo = ?"); params.push(dadosMed.principioAtivo); }
    if (dadosMed.tipo) { fields.push("tipo = ?"); params.push(dadosMed.tipo); }
    if (dadosMed.preco !== undefined) { fields.push("preco = ?"); params.push(dadosMed.preco); }
    if (dadosMed.estoqueAtual !== undefined) { fields.push("estoqueAtual = ?"); params.push(dadosMed.estoqueAtual); }
    if (dadosMed.fabricante) { fields.push("fabricante = ?"); params.push(dadosMed.fabricante); }
    if (dadosMed.promocaoAtiva !== undefined) { 
      // Garante que promocaoAtiva seja 0 ou 1
      const promocao = dadosMed.promocaoAtiva === 1 ? 1 : 0;
      fields.push("promocaoAtiva = ?"); 
      params.push(promocao); 
    }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar fornecido."));
    }

    params.push(id); // Adiciona o ID ao final para a cláusula WHERE
    const sql = `UPDATE medicamentos SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, params, function(err) {
      if (err) {
        console.error("Erro ao atualizar medicamento:", err.message);
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },

  // Função para deletar um medicamento
  deletar: (id, callback) => {
    const sql = "DELETE FROM medicamentos WHERE id = ?";
    db.run(sql, [id], function(err) {
      if (err) {
        console.error("Erro ao deletar medicamento:", err.message);
        // Considerar restrições (venda_itens, compra_itens)
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  },
  
  // Função específica para atualizar estoque (pode ser útil para vendas/compras)
  atualizarEstoque: (id, quantidadeDelta, callback) => {
    // quantidadeDelta pode ser positivo (compra) ou negativo (venda)
    const sql = "UPDATE medicamentos SET estoqueAtual = estoqueAtual + ? WHERE id = ? AND estoqueAtual + ? >= 0"; // Evita estoque negativo
    db.run(sql, [quantidadeDelta, id, quantidadeDelta], function(err) {
      if (err) {
        console.error("Erro ao atualizar estoque:", err.message);
        return callback(err);
      }
      if (this.changes === 0) {
          // Pode ter falhado por não encontrar o ID ou por tentar deixar estoque negativo
          return callback(new Error("Não foi possível atualizar o estoque. Verifique o ID ou a quantidade."));
      }
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = Medicamento;

