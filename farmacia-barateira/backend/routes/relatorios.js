// Conteúdo de routes/relatorios.js
const express = require("express");
const router = express.Router();
const Relatorio = require("../models/relatorioModel");
const { verifyToken, checkRole } = require("../middleware/authMiddleware"); // Assumindo que você usa isso

// Middleware para padronizar e validar datas para relatórios
const validateDatesMiddleware = (req, res, next) => {
    let { dataInicio, dataFim, tipoRelatorio } = req.query;

    // Define um padrão de 30 dias se as datas não forem fornecidas
    if (!dataFim) {
        dataFim = new Date();
    } else {
        dataFim = new Date(dataFim);
    }

    if (!dataInicio) {
        dataInicio = new Date(dataFim);
        // Ajusta data de início com base no tipo de relatório para um período razoável
        if (tipoRelatorio === 'hoje') {
            dataInicio = new Date(dataFim); // Começa e termina hoje
        } else if (tipoRelatorio === 'semana') {
            dataInicio.setDate(dataFim.getDate() - 7); // 7 dias atrás
        } else if (tipoRelatorio === 'trimestre') {
            dataInicio.setMonth(dataFim.getMonth() - 3); // 3 meses atrás
        } else if (tipoRelatorio === 'ano') {
            dataInicio.setFullYear(dataFim.getFullYear() - 1); // 1 ano atrás
        } else { // Padrão para 'mes' ou outros que não definem explicitamente
            dataInicio.setMonth(dataFim.getMonth() - 1); // 1 mês atrás
        }
    } else {
        dataInicio = new Date(dataInicio);
    }
    
    // Formata para 'YYYY-MM-DD HH:MM:SS' para o SQLite
    // Adiciona 00:00:00 para dataInicio e 23:59:59 para dataFim para cobrir o dia inteiro
    req.dataInicioFormatted = dataInicio.toISOString().split('T')[0] + ' 00:00:00';
    req.dataFimFormatted = dataFim.toISOString().split('T')[0] + ' 23:59:59';

    next();
};

// --- ROTAS DE RELATÓRIOS ---
// Todas as rotas de relatório são protegidas por verifyToken e checkRole
// Adapte os cargos conforme sua necessidade
const RELATORIO_ROLES = ["Gerente", "Administrador"];

router.get("/vendas-resumo", verifyToken, checkRole(RELATORIO_ROLES), validateDatesMiddleware, (req, res) => {
    Relatorio.getResumoVendas(req.dataInicioFormatted, req.dataFimFormatted, (err, data) => {
        if (err) {
            console.error("Erro ao buscar resumo de vendas:", err);
            return res.status(500).json({ erro: "Erro interno ao buscar resumo de vendas." });
        }
        res.json(data || {}); 
    });
});

router.get("/vendas-por-periodo", verifyToken, checkRole(RELATORIO_ROLES), validateDatesMiddleware, (req, res) => {
    Relatorio.getVendasPorPeriodo(req.dataInicioFormatted, req.dataFimFormatted, (err, data) => {
        if (err) {
            console.error("Erro ao buscar vendas por período:", err);
            return res.status(500).json({ erro: "Erro interno ao buscar vendas por período." });
        }
        res.json(data);
    });
});

router.get("/produtos-mais-vendidos", verifyToken, checkRole(RELATORIO_ROLES), validateDatesMiddleware, (req, res) => {
    Relatorio.getProdutosMaisVendidos(req.dataInicioFormatted, req.dataFimFormatted, (err, data) => {
        if (err) {
            console.error("Erro ao buscar produtos mais vendidos:", err);
            return res.status(500).json({ erro: "Erro interno ao buscar produtos mais vendidos." });
        }
        res.json(data);
    });
});

router.get("/detalhes-vendas", verifyToken, checkRole(RELATORIO_ROLES), validateDatesMiddleware, (req, res) => {
    Relatorio.getDetalhesVendas(req.dataInicioFormatted, req.dataFimFormatted, (err, data) => {
        if (err) {
            console.error("Erro ao buscar detalhes de vendas:", err);
            return res.status(500).json({ erro: "Erro interno ao buscar detalhes de vendas." });
        }
        res.json(data);
    });
});

router.get("/estoque-critico", verifyToken, checkRole(RELATORIO_ROLES), (req, res) => {
    Relatorio.getEstoqueCritico((err, data) => {
        if (err) {
            console.error("Erro ao buscar estoque crítico:", err);
            return res.status(500).json({ erro: "Erro interno ao buscar estoque crítico." });
        }
        res.json(data);
    });
});

router.get("/desempenho-vendedores", verifyToken, checkRole(RELATORIO_ROLES), validateDatesMiddleware, (req, res) => {
    Relatorio.getDesempenhoVendedores(req.dataInicioFormatted, req.dataFimFormatted, (err, data) => {
        if (err) {
            console.error("Erro ao buscar desempenho de vendedores:", err);
            return res.status(500).json({ erro: "Erro interno ao buscar desempenho de vendedores." });
        }
        res.json(data);
    });
});

module.exports = router;