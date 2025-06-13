// Conteúdo de relatorios_script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTES E ELEMENTOS DO DOM ---
    const API_BASE_URL = "http://localhost:3000/api";
    const token = localStorage.getItem('authToken'); // Assumindo que você usa token de autenticação

    // Cards de Resumo
    const totalVendasEl = document.getElementById('total-vendas');
    const numVendasEl = document.getElementById('num-vendas');
    const ticketMedioEl = document.getElementById('ticket-medio');
    const novosClientesEl = document.getElementById('novos-clientes'); // Este card será atualizado com um dado estático por enquanto, pois não temos API para "novos clientes" por período

    // Controles de Filtro
    const tipoRelatorioSelect = document.getElementById('tipo-relatorio');
    const periodoSelect = document.getElementById('periodo');
    const dataInicioInput = document.getElementById('data-inicio');
    const dataFimInput = document.getElementById('data-fim');
    const gerarRelatorioButton = document.getElementById('gerar-relatorio-button');

    // Gráficos (Chart.js instances)
    let vendasChartInstance;
    let produtosChartInstance;
    const vendasCtx = document.getElementById('vendasChart').getContext('2d');
    const produtosCtx = document.getElementById('produtosChart').getContext('2d');

    // Tabela de Detalhamento de Vendas
    const vendasTableBody = document.getElementById('vendas-table-body'); // Adicione este ID ao <tbody> da sua tabela de detalhamento
    // No seu HTML atual, o <tbody> da tabela de detalhamento não tem ID.
    // Ele está aqui: <tbody class="text-gray-700 text-sm">
    // Mude para: <tbody id="vendas-table-body" class="text-gray-700 text-sm">

    // --- FUNÇÕES AUXILIARES ---

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatarPorcentagem(valor) {
        return `${valor.toFixed(1).replace('.', ',')}%`;
    }

    // Função para calcular datas com base no período selecionado
    function calcularDatasDoPeriodo(periodo) {
        const hoje = new Date();
        let dataInicio = new Date();
        let dataFim = new Date(hoje); // Começa com a data de hoje

        switch (periodo) {
            case 'hoje':
                // Já está configurado para hoje
                break;
            case 'semana':
                dataInicio.setDate(hoje.getDate() - 7);
                break;
            case 'mes':
                dataInicio.setMonth(hoje.getMonth() - 1);
                break;
            case 'trimestre':
                dataInicio.setMonth(hoje.getMonth() - 3);
                break;
            case 'ano':
                dataInicio.setFullYear(hoje.getFullYear() - 1);
                break;
            case 'personalizado':
                // As datas serão pegas diretamente dos inputs, não calculadas aqui
                return {
                    dataInicio: dataInicioInput.value,
                    dataFim: dataFimInput.value
                };
            default: // Padrão para 'mes'
                dataInicio.setMonth(hoje.getMonth() - 1);
                break;
        }

        // Formata as datas para YYYY-MM-DD
        const formatarParaInputDate = (date) => date.toISOString().split('T')[0];
        return {
            dataInicio: formatarParaInputDate(dataInicio),
            dataFim: formatarParaInputDate(dataFim)
        };
    }

    // --- FUNÇÕES DE ATUALIZAÇÃO DA UI ---

    async function atualizarCardsResumo(dataInicio, dataFim) {
        try {
            const response = await fetch(`${API_BASE_URL}/relatorios/vendas-resumo?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar resumo de vendas.');
            const data = await response.json();

            totalVendasEl.textContent = formatarMoeda(data.valorTotalVendas || 0);
            numVendasEl.textContent = data.totalVendas || 0;
            ticketMedioEl.textContent = formatarMoeda(data.ticketMedio || 0);
            // Novos clientes permanece estático por enquanto
            novosClientesEl.textContent = "42"; // Placeholder estático
            // Lógica de variação percentual (simulada por enquanto)
            document.querySelector('#total-vendas').nextElementSibling.querySelector('span:first-child').innerHTML = `<svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>12.5%`;
            document.querySelector('#num-vendas').nextElementSibling.querySelector('span:first-child').innerHTML = `<svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>8.3%`;
            document.querySelector('#ticket-medio').nextElementSibling.querySelector('span:first-child').innerHTML = `<svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>2.1%`;
            document.querySelector('#novos-clientes').nextElementSibling.querySelector('span:first-child').innerHTML = `<svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>15.7%`;

            console.log("Resumo de vendas atualizado:", data);

        } catch (error) {
            console.error("Erro ao atualizar cards de resumo:", error);
            // resetar para valores padrão/erro
            totalVendasEl.textContent = "R$ 0,00";
            numVendasEl.textContent = "0";
            ticketMedioEl.textContent = "R$ 0,00";
            novosClientesEl.textContent = "0";
        }
    }

    async function atualizarGraficoVendas(dataInicio, dataFim) {
        try {
            const response = await fetch(`${API_BASE_URL}/relatorios/vendas-por-periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar vendas por período.');
            const data = await response.json();

            const labels = data.map(item => item.data_formatada);
            const vendas = data.map(item => item.totalDiario);

            if (vendasChartInstance) {
                vendasChartInstance.destroy(); // Destrói o gráfico anterior antes de criar um novo
            }

            vendasChartInstance = new Chart(vendasCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Vendas (R$)',
                        data: vendas,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointBackgroundColor: 'rgba(59, 130, 246, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) { return formatarMoeda(value); }
                            }
                        }
                    },
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                label: function(context) { return formatarMoeda(context.raw); }
                            }
                        }
                    }
                }
            });
            console.log("Gráfico de vendas por período atualizado:", data);

        } catch (error) {
            console.error("Erro ao atualizar gráfico de vendas:", error);
            if (vendasChartInstance) vendasChartInstance.destroy();
            // Pode mostrar um gráfico vazio ou mensagem de erro
        }
    }

    async function atualizarGraficoProdutos(dataInicio, dataFim) {
        try {
            const response = await fetch(`${API_BASE_URL}/relatorios/produtos-mais-vendidos?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar produtos mais vendidos.');
            const data = await response.json();

            const labels = data.map(item => item.produto_nome);
            const unidadesVendidas = data.map(item => item.totalUnidadesVendidas);

            const backgroundColors = [
                'rgba(59, 130, 246, 0.7)', // blue-500
                'rgba(16, 185, 129, 0.7)', // green-500
                'rgba(245, 158, 11, 0.7)', // orange-500
                'rgba(139, 92, 246, 0.7)', // purple-500
                'rgba(239, 68, 68, 0.7)',  // red-500
                'rgba(34, 197, 94, 0.7)',  // lime-500
                'rgba(249, 115, 22, 0.7)', // amber-500
                'rgba(236, 72, 153, 0.7)', // pink-500
                'rgba(6, 182, 212, 0.7)',  // cyan-500
                'rgba(139, 230, 20, 0.7)'  // yellow-green-500
            ];

            if (produtosChartInstance) {
                produtosChartInstance.destroy();
            }

            produtosChartInstance = new Chart(produtosCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Unidades Vendidas',
                        data: unidadesVendidas,
                        backgroundColor: backgroundColors.slice(0, labels.length), // Usa cores conforme o número de produtos
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { display: false } }
                }
            });
            console.log("Gráfico de produtos mais vendidos atualizado:", data);

        } catch (error) {
            console.error("Erro ao atualizar gráfico de produtos:", error);
            if (produtosChartInstance) produtosChartInstance.destroy();
        }
    }

    async function atualizarTabelaVendas(dataInicio, dataFim) {
        try {
            const response = await fetch(`${API_BASE_URL}/relatorios/detalhes-vendas?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar detalhes de vendas.');
            const vendas = await response.json();

            vendasTableBody.innerHTML = ''; // Limpa a tabela
            if (vendas.length === 0) {
                vendasTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500">Nenhuma venda encontrada para o período.</td></tr>`;
                return;
            }

            vendas.forEach(venda => {
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-200 hover:bg-gray-50';
                row.innerHTML = `
                    <td class="py-3 px-6 text-left">#${venda.venda_id}</td>
                    <td class="py-3 px-6 text-left">${venda.dataVendaFormatada}</td>
                    <td class="py-3 px-6 text-left">${venda.cliente_nome}</td>
                    <td class="py-3 px-6 text-left">${venda.vendedor_nome}</td>
                    <td class="py-3 px-6 text-right">${venda.total_itens_vendidos}</td>
                    <td class="py-3 px-6 text-right font-medium">${formatarMoeda(venda.valorTotal)}</td>
                    <td class="py-3 px-6 text-center">
                        <span class="
                            ${venda.formaPagamento === 'Dinheiro' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${venda.formaPagamento === 'PIX' ? 'bg-blue-100 text-blue-800' : ''}
                            ${venda.formaPagamento && venda.formaPagamento.includes('Cartão de Crédito') ? 'bg-green-100 text-green-800' : ''}
                            ${venda.formaPagamento && venda.formaPagamento.includes('Cartão de Débito') ? 'bg-purple-100 text-purple-800' : ''}
                            text-xs px-2 py-1 rounded-full whitespace-nowrap">
                            ${venda.formaPagamento || 'N/A'}
                        </span>
                    </td>
                `;
                vendasTableBody.appendChild(row);
            });
            console.log("Tabela de vendas detalhada atualizada:", vendas);

            // Atualiza a contagem de registros
            document.querySelector('.text-sm.text-gray-600').textContent = `Mostrando ${vendas.length} de ${vendas.length} registros`; // Ajuste para refletir paginação real se houver
        } catch (error) {
            console.error("Erro ao atualizar tabela de vendas:", error);
            vendasTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Erro ao carregar detalhes de vendas.</td></tr>`;
        }
    }

    // --- FUNÇÃO PRINCIPAL: GERAR RELATÓRIO ---
    async function gerarRelatorio() {
        // Obter datas do período selecionado
        const periodoSelecionado = periodoSelect.value;
        const { dataInicio, dataFim } = calcularDatasDoPeriodo(periodoSelecionado);

        // Se o período for personalizado, usar os valores dos inputs diretamente
        if (periodoSelecionado === 'personalizado') {
            if (!dataInicioInput.value || !dataFimInput.value) {
                alert("Por favor, preencha as datas de início e fim para o período personalizado.");
                return;
            }
        }

        console.log(`Gerando relatório para o período de ${dataInicio} a ${dataFim}`);

        // Chamar as funções de atualização para cada componente do relatório
        await atualizarCardsResumo(dataInicio, dataFim);
        await atualizarGraficoVendas(dataInicio, dataFim);
        await atualizarGraficoProdutos(dataInicio, dataFim);
        await atualizarTabelaVendas(dataInicio, dataFim);

        // Lógica para tipo de relatório (vendas, estoque, clientes, financeiro)
        // Por enquanto, todos os gráficos e cards estão baseados em vendas.
        // Se 'tipoRelatorioSelect.value' mudar, a lógica de quais fetches são feitos deve ser diferente aqui.
        // Por exemplo:
        const tipoRelatorio = tipoRelatorioSelect.value;
        switch (tipoRelatorio) {
            case 'vendas':
                // Já atualizado acima
                break;
            case 'estoque':
                // Você precisaria de APIs específicas para relatórios de estoque
                // e funções para renderizar esses dados. Ex:
                // await fetch(`${API_BASE_URL}/relatorios/estoque-critico`, ...);
                // ... atualizar UI com dados de estoque ...
                break;
            // ... outros tipos ...
        }
    }

    // --- INICIALIZAÇÃO E LISTENERS ---

    // Configurar estado inicial dos campos de data
    function configurarDatasIniciais() {
        const hoje = new Date();
        const umMesAtras = new Date();
        umMesAtras.setMonth(hoje.getMonth() - 1); // Último mês

        dataFimInput.valueAsDate = hoje;
        dataInicioInput.valueAsDate = umMesAtras;

        dataInicioInput.disabled = true;
        dataFimInput.disabled = true;
    }
    configurarDatasIniciais(); // Chama na carga da página

    // Listener para o select de período
    periodoSelect.addEventListener('change', function() {
        if (this.value === 'personalizado') {
            dataInicioInput.disabled = false;
            dataFimInput.disabled = false;
        } else {
            dataInicioInput.disabled = true;
            dataFimInput.disabled = true;
            const { dataInicio, dataFim } = calcularDatasDoPeriodo(this.value);
            dataInicioInput.value = dataInicio;
            dataFimInput.value = dataFim;
        }
    });

    // Listener para o botão "Gerar Relatório"
    gerarRelatorioButton.addEventListener('click', gerarRelatorio);

    // Inicializa o relatório ao carregar a página
    gerarRelatorio(); 

    // --- LÓGICA DE LOGOUT ---
    const logoutButton = document.getElementById("logout-button");
    if(logoutButton) {
        logoutButton.addEventListener("click", () => {
            alert("Você foi desconectado.");
            window.location.href = "index.html"; 
        });
    }

});