document.addEventListener("DOMContentLoaded", () => {
    // --- CONSTANTES E VARIÁVEIS GLOBAIS ---
    const API_BASE_URL = "http://localhost:3000/api";
    const token = localStorage.getItem('authToken');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // --- ELEMENTOS DO DOM ---
    const clienteSearchInput = document.getElementById("cliente-search");
    const clienteSearchResults = document.getElementById("cliente-search-results");
    const clienteSelecionadoDiv = document.getElementById("cliente-selecionado");
    const novoClienteBtn = document.getElementById("novo-cliente-button");
    
    const vendedorSelect = document.getElementById('vendedor-select');

    const produtoSearchInput = document.getElementById("produto-search");
    const resultadosBuscaContainer = document.getElementById("resultados-busca");
    const paginationContainer = document.getElementById("pagination-container");
    
    const carrinhoContainer = document.getElementById("carrinho-container");
    const carrinhoSubtotalEl = document.getElementById("carrinho-subtotal");
    const descontoInput = document.getElementById('desconto');
    const carrinhoTotalGeralEl = document.getElementById("carrinho-total-geral");
    
    const finalizarVendaBtn = document.getElementById("finalizar-venda-button");
    const cancelarVendaBtn = document.getElementById("cancelar-venda-button");

    // --- ESTADO DA APLICAÇÃO ---
    let carrinho = [];
    let clienteAtual = null;
    let vendedorAtualId = usuarioLogado ? usuarioLogado.id : null;
    let produtosDisponiveis = [];
    let clientesDisponiveis = [];
    let debounceTimer;

    // --- ESTADO DA PAGINAÇÃO ---
    const ITENS_POR_PAGINA = 8;
    let paginaAtual = 0;
    let produtosFiltrados = [];

    // --- FUNÇÕES DE INICIALIZAÇÃO ---
    async function inicializarPagina() {
        if (!usuarioLogado) {
            showCustomAlert("Usuário não identificado. Faça login novamente.", "error");
            return;
        }
        await carregarVendedores();
        await carregarTodosOsProdutos();
        await carregarTodosOsClientes();
        configurarEventListeners();
        renderizarCarrinho();
    }

    async function carregarVendedores() {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`, { headers: { 'Authorization': `Bearer ${token}` }});
            if (!response.ok) throw new Error('Falha ao carregar vendedores.');
            const usuarios = await response.json();
            
            vendedorSelect.innerHTML = '';
            usuarios.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.nome} (${user.cargo})`;
                if (user.id === vendedorAtualId) option.selected = true;
                vendedorSelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function carregarTodosOsProdutos() {
        try {
            const response = await fetch(`${API_BASE_URL}/medicamentos`, { headers: { 'Authorization': `Bearer ${token}` }});
            if (!response.ok) throw new Error('Falha ao carregar produtos do estoque.');
            produtosDisponiveis = await response.json();
            filtrarErenderizarProdutos();
        } catch (error) {
            resultadosBuscaContainer.innerHTML = `<p class="col-span-full text-center text-red-500">${error.message}</p>`;
        }
    }

    async function carregarTodosOsClientes() {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes`, { headers: { 'Authorization': `Bearer ${token}` }});
            if (!response.ok) throw new Error('Falha ao carregar clientes.');
            clientesDisponiveis = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    // --- FUNÇÕES DE BUSCA, RENDERIZAÇÃO E PAGINAÇÃO ---
    function buscarClientes(termo) {
        if (termo.length < 2) {
            clienteSearchResults.classList.add('hidden');
            return;
        }
        const filtrados = clientesDisponiveis.filter(c => c.nome.toLowerCase().includes(termo.toLowerCase()));
        
        clienteSearchResults.innerHTML = '';
        if(filtrados.length > 0) {
            filtrados.slice(0, 5).forEach(cliente => {
                const div = document.createElement('div');
                div.className = 'p-2 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer';
                div.textContent = cliente.nome;
                div.addEventListener('click', () => selecionarCliente(cliente));
                clienteSearchResults.appendChild(div);
            });
            clienteSearchResults.classList.remove('hidden');
        } else {
             clienteSearchResults.classList.add('hidden');
        }
    }

    function selecionarCliente(cliente) {
        clienteAtual = cliente;
        clienteSearchInput.value = '';
        clienteSearchResults.classList.add('hidden');
        clienteSelecionadoDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-medium text-gray-800 dark:text-gray-200">${cliente.nome}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${cliente.email || 'Sem email'}</p>
                </div>
                <button data-action="remover-cliente" class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                    <svg class="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>`;
        clienteSelecionadoDiv.classList.remove('hidden');
    }
    
    function removerCliente() {
        clienteAtual = null;
        clienteSelecionadoDiv.classList.add('hidden');
        clienteSelecionadoDiv.innerHTML = '';
    }

    function filtrarErenderizarProdutos() {
        const termoBusca = produtoSearchInput.value.toLowerCase();
        produtosFiltrados = produtosDisponiveis.filter(p => 
            p.nome.toLowerCase().includes(termoBusca) || 
            (p.principioAtivo && p.principioAtivo.toLowerCase().includes(termoBusca))
        );
        paginaAtual = 0;
        renderizarPaginaDeProdutos();
    }
    
    function renderizarPaginaDeProdutos() {
        const start = paginaAtual * ITENS_POR_PAGINA;
        const end = start + ITENS_POR_PAGINA;
        const produtosDaPagina = produtosFiltrados.slice(start, end);
        renderizarResultadosBusca(produtosDaPagina);
        renderizarControlesDePaginacao();
    }

    function renderizarResultadosBusca(produtos) {
        resultadosBuscaContainer.innerHTML = "";
        if (produtos.length === 0) {
            resultadosBuscaContainer.innerHTML = `<p class="col-span-full text-center text-gray-500 dark:text-gray-400">Nenhum produto encontrado.</p>`;
            return;
        }
        produtos.forEach(produto => {
            resultadosBuscaContainer.insertAdjacentHTML('beforeend', criarCardProduto(produto));
        });
    }

    function criarCardProduto(produto) {
        let estoqueCor = 'text-green-600 dark:text-green-400';
        if (produto.estoqueAtual < 10 && produto.estoqueAtual > 0) estoqueCor = 'text-orange-500 dark:text-orange-400';
        if (produto.estoqueAtual === 0) estoqueCor = 'text-red-500 dark:text-red-400';

        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden produto-card transition-all duration-300 flex flex-col">
                <div class="p-4 flex-grow">
                    <h4 class="font-bold text-gray-800 dark:text-white truncate">${produto.nome}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${produto.principioAtivo || ''}</p>
                    <div class="flex justify-between items-center mt-3 text-sm">
                        <span class="font-semibold ${estoqueCor}">Estoque: ${produto.estoqueAtual}</span>
                        <span class="text-lg font-bold text-purple-600 dark:text-purple-400">${formatarMoeda(produto.preco)}</span>
                    </div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
                    <input type="number" id="qtd-${produto.id}" value="1" min="1" max="${produto.estoqueAtual}" class="w-20 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-center rounded-md p-1">
                    <button data-id="${produto.id}" data-action="adicionar" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed" ${produto.estoqueAtual === 0 ? 'disabled' : ''}>
                        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Add
                    </button>
                </div>
            </div>
        `;
    }

    function renderizarControlesDePaginacao() {
        paginationContainer.innerHTML = '';
        const totalPaginas = Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA);
        if (totalPaginas <= 1) return;

        const btnAnterior = document.createElement('button');
        btnAnterior.innerHTML = `&larr; Anterior`;
        btnAnterior.className = "px-4 py-2 mx-1 text-sm font-medium text-gray-700 bg-white rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed";
        btnAnterior.disabled = (paginaAtual === 0);
        btnAnterior.addEventListener('click', () => { paginaAtual--; renderizarPaginaDeProdutos(); });
        paginationContainer.appendChild(btnAnterior);

        const pageIndicator = document.createElement('span');
        pageIndicator.textContent = `Página ${paginaAtual + 1} de ${totalPaginas}`;
        pageIndicator.className = "px-4 py-2 mx-1 text-sm text-gray-700 dark:text-gray-300";
        paginationContainer.appendChild(pageIndicator);
        
        const btnProximo = document.createElement('button');
        btnProximo.innerHTML = `Próximo &rarr;`;
        btnProximo.className = "px-4 py-2 mx-1 text-sm font-medium text-gray-700 bg-white rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed";
        btnProximo.disabled = (paginaAtual >= totalPaginas - 1);
        btnProximo.addEventListener('click', () => { paginaAtual++; renderizarPaginaDeProdutos(); });
        paginationContainer.appendChild(btnProximo);
    }
    
    // --- LÓGICA DO CARRINHO ---
    function adicionarAoCarrinho(produtoId, quantidade) {
        const produto = produtosDisponiveis.find(p => p.id === produtoId);
        if (!produto) return;

        const itemExistente = carrinho.find(item => item.id === produtoId);
        const estoqueDisponivel = produto.estoqueAtual - (itemExistente ? itemExistente.quantidade : 0);

        if (quantidade > estoqueDisponivel) {
            showCustomAlert(`Apenas ${estoqueDisponivel} unidades disponíveis em estoque.`, 'error');
            return;
        }

        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: quantidade });
        }
        renderizarCarrinho();
    }
    
    function alterarQuantidadeCarrinho(produtoId, novaQuantidade) {
        const itemIndex = carrinho.findIndex(item => item.id === produtoId);
        if (itemIndex === -1) return;

        const produto = produtosDisponiveis.find(p => p.id === produtoId);
        if (novaQuantidade > produto.estoqueAtual) {
            showCustomAlert(`Estoque máximo (${produto.estoqueAtual}) atingido.`, 'error');
            carrinho[itemIndex].quantidade = produto.estoqueAtual;
        } else if (novaQuantidade < 1) {
            carrinho.splice(itemIndex, 1);
        } else {
            carrinho[itemIndex].quantidade = novaQuantidade;
        }
        renderizarCarrinho();
    }
    
    function renderizarCarrinho() {
        carrinhoContainer.innerHTML = '';
        if (carrinho.length === 0) {
            carrinhoContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 p-4">Carrinho vazio.</p>`;
        } else {
            carrinho.forEach(item => {
                carrinhoContainer.insertAdjacentHTML('beforeend', `
                    <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex-grow pr-2">
                            <p class="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">${item.nome}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">${formatarMoeda(item.preco)} x ${item.quantidade}</p>
                        </div>
                        <div class="font-medium text-gray-800 dark:text-gray-200 text-sm">${formatarMoeda(item.preco * item.quantidade)}</div>
                        <button data-id="${item.id}" data-action="remover-item" class="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                            <svg class="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                `);
            });
        }
        calcularTotais();
    }

    function calcularTotais() {
        const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        const descontoPercent = parseFloat(descontoInput.value) || 0;
        const valorDesconto = (subtotal * descontoPercent) / 100;
        const total = subtotal - valorDesconto;
        
        carrinhoSubtotalEl.textContent = formatarMoeda(subtotal);
        carrinhoTotalGeralEl.textContent = formatarMoeda(total);
    }
    
    // --- FUNÇÃO DE IMPRESSÃO ---
    function imprimirComprovante(vendaRegistrada, itensVendidos, totais) {
        const vendedorNome = vendedorSelect.options[vendedorSelect.selectedIndex].text.split(' (')[0];
        const now = new Date();

        let itensHtml = '';
        itensVendidos.forEach(item => {
            itensHtml += `
                <tr>
                    <td style="padding: 2px 0;">${item.quantidade}x</td>
                    <td style="padding: 2px 8px;">${item.nome}</td>
                    <td style="text-align:right; padding: 2px 0;">${formatarMoeda(item.preco * item.quantidade)}</td>
                </tr>
            `;
        });

        const comprovanteHtml = `
            <html><head><title>Comprovante Venda #${vendaRegistrada.vendaId}</title><style>
                body { font-family: 'Courier New', monospace; margin: 0; padding: 10px; font-size: 10px; color: #000; }
                .comprovante { width: 280px; margin: auto; } .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; }
                h2, p { margin: 0 0 3px 0; } .item-table { width: 100%; border-collapse: collapse; margin-top: 5px;}
                .total-section { border-top: 1px dashed #000; padding-top: 5px; margin-top: 5px;}
                .total-section div { display: flex; justify-content: space-between; }
            </style></head><body><div class="comprovante">
                <div class="header"><h2>Farmácia A Barateira</h2><p>Rua Principal, 123</p><p>CNPJ: 00.123.456/0001-78</p></div>
                <p>CUPOM NAO FISCAL</p><p>Venda: ${vendaRegistrada.vendaId} | Data: ${now.toLocaleString('pt-BR')}</p>
                <p>Vendedor: ${vendedorNome}</p><p>Cliente: ${clienteAtual ? clienteAtual.nome : 'Consumidor Final'}</p>
                <table class="item-table"><tbody>${itensHtml}</tbody></table>
                <div class="total-section">
                    <div><span>Subtotal:</span><span>${formatarMoeda(totais.subtotal)}</span></div>
                    <div><span>Desconto:</span><span>${totais.descontoPercent}%</span></div>
                    <div style="font-weight: bold; font-size: 14px;"><span>TOTAL:</span><span>${formatarMoeda(totais.total)}</span></div>
                </div><p style="text-align:center; margin-top: 15px;">Obrigado!</p>
            </div></body></html>`;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(comprovanteHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
    }

    // --- AÇÕES FINAIS ---
    function limparVenda() {
        carrinho = [];
        removerCliente();
        descontoInput.value = 0;
        document.getElementById('observacoes').value = '';
        renderizarCarrinho();
        filtrarErenderizarProdutos();
    }
    
    async function finalizarVenda() {
        if (carrinho.length === 0) return showCustomAlert("O carrinho está vazio.", "error");
        
        const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        const descontoPercent = parseFloat(descontoInput.value) || 0;
        const total = subtotal - ((subtotal * descontoPercent) / 100);

        const vendaData = {
            cliente_id: clienteAtual ? clienteAtual.id : null,
            usuario_id: vendedorAtualId,
            valorTotal: total,
            itens: carrinho.map(item => ({ medicamento_id: item.id, quantidade: item.quantidade, precoUnitario: item.preco }))
        };

        try {
            const response = await fetch(`${API_BASE_URL}/vendas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(vendaData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro || 'Erro ao finalizar venda.');

            imprimirComprovante(result, carrinho, { subtotal, descontoPercent, total });
            showCustomAlert(`Venda #${result.vendaId} registrada com sucesso!`, 'success');
            limparVenda();
            await carregarTodosOsProdutos();

        } catch (error) {
            showCustomAlert(error.message, 'error');
        }
    }
    
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // --- EVENT LISTENERS ---
    function configurarEventListeners() {
        clienteSearchInput.addEventListener('keyup', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => buscarClientes(e.target.value), 300);
        });

        produtoSearchInput.addEventListener('keyup', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => filtrarErenderizarProdutos(), 300);
        });

        resultadosBuscaContainer.addEventListener('click', e => {
            const button = e.target.closest('button[data-action="adicionar"]');
            if (button) {
                const produtoId = parseInt(button.dataset.id, 10);
                const qtdInput = document.getElementById(`qtd-${produtoId}`);
                const quantidade = parseInt(qtdInput.value, 10);
                adicionarAoCarrinho(produtoId, quantidade);
                qtdInput.value = 1;
            }
        });
        
        carrinhoContainer.addEventListener('click', e => {
            const button = e.target.closest('button[data-action="remover-item"]');
            if (button) {
                alterarQuantidadeCarrinho(parseInt(button.dataset.id, 10), 0);
            }
        });
        carrinhoContainer.addEventListener('change', e => {
             if(e.target.matches('input[type="number"]')) {
                const novaQuantidade = parseInt(e.target.value, 10);
                const produtoId = parseInt(e.target.dataset.id, 10);
                alterarQuantidadeCarrinho(produtoId, novaQuantidade);
            }
        });

        clienteSelecionadoDiv.addEventListener('click', e => {
            if (e.target.closest('button[data-action="remover-cliente"]')) removerCliente();
        });

        vendedorSelect.addEventListener('change', (e) => { vendedorAtualId = parseInt(e.target.value, 10); });
        
        novoClienteBtn.addEventListener('click', () => { window.open('clientes.html', '_blank'); });

        descontoInput.addEventListener('input', calcularTotais);
        finalizarVendaBtn.addEventListener('click', finalizarVenda);
        cancelarVendaBtn.addEventListener('click', () => {
            if (carrinho.length > 0 && confirm("Tem certeza que deseja cancelar e limpar a venda atual?")) {
                limparVenda();
            } else if (carrinho.length === 0) {
                limparVenda();
            }
        });
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    inicializarPagina();
});
