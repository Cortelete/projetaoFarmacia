// Conteúdo COMPLETO e FUNCIONAL para /dashboard_script.js

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('authToken');

    // --- Seleção dos Elementos dos Cards ---
    // Adicionei IDs únicos a cada elemento de valor no HTML para selecioná-los de forma segura.
    const vendasHojeEl = document.getElementById("stats-vendas-hoje");
    const estoqueBaixoEl = document.getElementById("stats-estoque-baixo");
    const novosClientesEl = document.getElementById("stats-novos-clientes");
    const totalMedicamentosEl = document.getElementById("stats-total-medicamentos");
    const atividadeRecenteContainer = document.getElementById("atividade-recente-container");
    
    /**
     * Formata um número como moeda brasileira (BRL).
     * @param {number} valor O número a ser formatado.
     * @returns {string} O valor formatado como moeda.
     */
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    /**
     * Busca os dados da API e atualiza os cards do dashboard.
     */
    async function carregarDadosDashboard() {
        if (!token) {
            console.error("Token de autenticação não encontrado.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar os dados do dashboard.');
            }

            const stats = await response.json();

            // Atualiza os cards com os dados reais
            if (vendasHojeEl) vendasHojeEl.textContent = formatarMoeda(stats.vendasHoje);
            if (estoqueBaixoEl) estoqueBaixoEl.textContent = stats.estoqueBaixo;
            if (novosClientesEl) novosClientesEl.textContent = stats.novosClientes;
            if (totalMedicamentosEl) totalMedicamentosEl.textContent = stats.totalMedicamentos;
            
            // Aqui, no futuro, carregaremos a atividade recente
            // carregarAtividadeRecente();

        } catch (error) {
            console.error("Erro ao carregar dados do dashboard:", error);
            if(vendasHojeEl) vendasHojeEl.textContent = "Erro";
            // Você pode adicionar mensagens de erro nos outros cards também
        }
    }
    
    /**
     * Lógica de Logout
     */
    const logoutButton = document.getElementById("logout-button");
    if(logoutButton) {
        logoutButton.addEventListener("click", () => {
            // Limpa o "passaporte" do usuário do navegador
            localStorage.removeItem("authToken");
            localStorage.removeItem("usuarioLogado");

            // Usa o alerta personalizado e redireciona
            if (typeof showCustomAlert === 'function') {
                showCustomAlert("Você foi desconectado com sucesso!", "success");
                // O redirecionamento já acontece ao clicar "Ok" no alerta
            } else {
                alert("Você foi desconectado.");
                window.location.href = "index.html";
            }
        });
    }

    // --- INICIALIZAÇÃO ---
    carregarDadosDashboard();
    console.log("Dashboard carregado e dados solicitados.");
});
