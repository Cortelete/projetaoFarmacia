// Conteúdo para /backend/models/dashboardModel.js

const db = require("../database/db");

// Define um limiar para estoque baixo. Pode ser ajustado.
const ESTOQUE_BAIXO_LIMIAR = 10;

const DashboardModel = {

    // Pega o valor total vendido no dia de hoje.
    getVendasHoje: (callback) => {
        // Pega a data de hoje no formato YYYY-MM-DD
        const hoje = new Date().toISOString().slice(0, 10);
        const sql = `SELECT SUM(valorTotal) as total FROM vendas WHERE DATE(dataVenda) = ?`;
        db.get(sql, [hoje], (err, row) => {
            callback(err, row || { total: 0 });
        });
    },

    // Conta quantos produtos estão com estoque abaixo do limiar.
    getContagemEstoqueBaixo: (callback) => {
        const sql = `SELECT COUNT(id) as count FROM medicamentos WHERE estoqueAtual < ?`;
        db.get(sql, [ESTOQUE_BAIXO_LIMIAR], (err, row) => {
            callback(err, row || { count: 0 });
        });
    },

    // Conta quantos clientes foram cadastrados nos últimos 30 dias.
    getNovosClientesMes: (callback) => {
        const sql = `SELECT COUNT(id) as count FROM clientes WHERE DATE(dataCadastro) >= DATE('now', '-30 days')`;
        db.get(sql, [], (err, row) => {
            callback(err, row || { count: 0 });
        });
    },

    // Conta o total de medicamentos cadastrados.
    getContagemTotalMedicamentos: (callback) => {
        const sql = `SELECT COUNT(id) as count FROM medicamentos`;
        db.get(sql, [], (err, row) => {
            callback(err, row || { count: 0 });
        });
    },
    
    // Pega o histórico das 5 atividades mais recentes. (Requer a tabela de histórico que faremos depois)
    getAtividadeRecente: (callback) => {
        // Placeholder: Por enquanto, retorna uma lista vazia.
        // No futuro, aqui faremos: SELECT * FROM historico_acoes ORDER BY timestamp DESC LIMIT 5
        const atividades = [
            // { descricao: 'Venda #123 finalizada por João', data: new Date() },
            // { descricao: 'Cliente Maria Silva cadastrado', data: new Date() }
        ];
        callback(null, atividades);
    }
};

module.exports = DashboardModel;