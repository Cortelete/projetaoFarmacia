// Conteúdo de models/relatorioModel.js
const db = require("../database/db");

const Relatorio = {
    // Relatório de Resumo de Vendas (Total de Vendas, Número de Vendas, Ticket Médio)
    getResumoVendas: (dataInicio, dataFim, callback) => {
        // SQL com timezone para compatibilidade com CURRENT_TIMESTAMP do SQLite
        const sql = `
            SELECT 
                COUNT(id) AS totalVendas,
                IFNULL(SUM(valorTotal), 0) AS valorTotalVendas,
                IFNULL(AVG(valorTotal), 0) AS ticketMedio
            FROM 
                vendas
            WHERE 
                STRFTIME('%Y-%m-%d %H:%M:%S', dataVenda) BETWEEN ? AND ?;
        `;
        db.get(sql, [dataInicio, dataFim], callback);
    },

    // Relatório de Vendas por Período (para gráfico de linha)
    getVendasPorPeriodo: (dataInicio, dataFim, callback) => {
        // Agrupado por dia para o gráfico de linha
        const sql = `
            SELECT 
                STRFTIME('%d/%m', dataVenda) AS data_formatada, -- Formato DD/MM para exibição
                STRFTIME('%Y-%m-%d', dataVenda) AS data_ordenacao, -- Para ordenação correta
                SUM(valorTotal) AS totalDiario
            FROM 
                vendas
            WHERE 
                STRFTIME('%Y-%m-%d %H:%M:%S', dataVenda) BETWEEN ? AND ?
            GROUP BY 
                data_ordenacao
            ORDER BY 
                data_ordenacao;
        `;
        db.all(sql, [dataInicio, dataFim], callback);
    },

    // Relatório de Produtos Mais Vendidos (para gráfico de barras)
    getProdutosMaisVendidos: (dataInicio, dataFim, callback) => {
        const sql = `
            SELECT 
                m.nome AS produto_nome,
                SUM(vi.quantidade) AS totalUnidadesVendidas
            FROM 
                venda_itens vi
            JOIN 
                vendas v ON vi.venda_id = v.id
            JOIN 
                medicamentos m ON vi.medicamento_id = m.id
            WHERE 
                STRFTIME('%Y-%m-%d %H:%M:%S', v.dataVenda) BETWEEN ? AND ?
            GROUP BY 
                m.nome
            ORDER BY 
                totalUnidadesVendidas DESC
            LIMIT 5; -- Top 5 produtos
        `;
        db.all(sql, [dataInicio, dataFim], callback);
    },

    // Relatório de Detalhes de Vendas (para tabela)
    getDetalhesVendas: (dataInicio, dataFim, callback) => {
        const sql = `
            SELECT 
                v.id AS venda_id,
                STRFTIME('%d/%m/%Y %H:%M', v.dataVenda) AS dataVendaFormatada, -- Formato para exibição
                v.valorTotal,
                v.formaPagamento,
                IFNULL(c.nome, 'Consumidor Final') AS cliente_nome, -- Se cliente_id for NULL, mostra "Consumidor Final"
                u.nome AS vendedor_nome,
                SUM(vi.quantidade) AS total_itens_vendidos -- Soma das quantidades de itens da venda
            FROM 
                vendas v
            LEFT JOIN 
                clientes c ON v.cliente_id = c.id
            JOIN 
                usuarios u ON v.usuario_id = u.id
            JOIN
                venda_itens vi ON vi.venda_id = v.id
            WHERE 
                STRFTIME('%Y-%m-%d %H:%M:%S', v.dataVenda) BETWEEN ? AND ?
            GROUP BY
                v.id -- Agrupa por venda para somar a quantidade total de itens
            ORDER BY
                v.dataVenda DESC;
        `;
        db.all(sql, [dataInicio, dataFim], callback);
    },

    // Relatório de estoque crítico
    getEstoqueCritico: (callback) => {
        const sql = `
            SELECT 
                id, nome, estoqueAtual, preco, fabricante, fornecedor_id, promocaoAtiva,
                (SELECT f.nome FROM fornecedores f WHERE f.id = m.fornecedor_id) AS fornecedor_nome
            FROM 
                medicamentos m
            WHERE 
                estoqueAtual <= 10 -- Define o limite para estoque crítico
            ORDER BY 
                estoqueAtual ASC;
        `;
        db.all(sql, callback);
    },

    // Relatório de desempenho de vendedores (vendas por vendedor)
    getDesempenhoVendedores: (dataInicio, dataFim, callback) => {
        const sql = `
            SELECT 
                u.nome AS vendedor_nome,
                COUNT(v.id) AS totalVendas,
                SUM(v.valorTotal) AS valorTotalVendido
            FROM 
                vendas v
            JOIN 
                usuarios u ON v.usuario_id = u.id
            WHERE 
                STRFTIME('%Y-%m-%d %H:%M:%S', v.dataVenda) BETWEEN ? AND ?
            GROUP BY 
                u.nome
            ORDER BY 
                valorTotalVendido DESC;
        `;
        db.all(sql, [dataInicio, dataFim], callback);
    }
};

module.exports = Relatorio;