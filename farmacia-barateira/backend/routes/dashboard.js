// Conteúdo para /backend/routes/dashboard.js

const express = require("express");
const router = express.Router();
const DashboardModel = require("../models/dashboardModel");

// Rota para buscar todos os dados do dashboard de uma vez
router.get("/stats", (req, res) => {
    // Usamos um objeto para rastrear todas as consultas
    const stats = {};
    let queriesConcluidas = 0;
    const totalQueries = 4; // Total de métricas que estamos buscando

    const onQueryComplete = () => {
        queriesConcluidas++;
        if (queriesConcluidas === totalQueries) {
            res.json(stats);
        }
    };

    DashboardModel.getVendasHoje((err, row) => {
        stats.vendasHoje = row.total || 0;
        onQueryComplete();
    });

    DashboardModel.getContagemEstoqueBaixo((err, row) => {
        stats.estoqueBaixo = row.count || 0;
        onQueryComplete();
    });

    DashboardModel.getNovosClientesMes((err, row) => {
        stats.novosClientes = row.count || 0;
        onQueryComplete();
    });

    DashboardModel.getContagemTotalMedicamentos((err, row) => {
        stats.totalMedicamentos = row.count || 0;
        onQueryComplete();
    });
});

// Rota para Atividade Recente
router.get("/atividade-recente", (req, res) => {
    DashboardModel.getAtividadeRecente((err, atividades) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao buscar atividades." });
        }
        res.json(atividades);
    });
});

module.exports = router;