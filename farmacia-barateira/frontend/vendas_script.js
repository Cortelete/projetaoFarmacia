document.addEventListener("DOMContentLoaded", () => {
    // --- CONSTANTES E VARIÁVEIS GLOBAIS ---
    const API_BASE_URL = "http://localhost:3000/api";
    const token = localStorage.getItem('authToken');
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // --- ELEMENTOS DO DOM (DECLARADOS AQUI, NO INÍCIO DO DOMContentLoaded) ---
    // ESTA É A CORREÇÃO: DECLARAR UMA ÚNICA VEZ AQUI
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
    
    // Seleciona os botões
    const cancelarVendaBtn = document.getElementById("cancelar-venda-button");
    const realizarPagamentoBtn = document.getElementById("realizar-pagamento-button");
    const finalizarVendaBtn = document.getElementById("finalizar-venda-button"); // Botão "Finalizar Venda (Antigo)"

    // --- ESTADO DA APLICAÇÃO ---
    let carrinho = [];
    let clienteAtual = null;
    let vendedorAtualId = usuarioLogado ? usuarioLogado.id : null; 
    let produtosDisponiveis = [];
    let clientesDisponiveis = [];
    let debounceTimer;

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
        // Apenas configurar listeners, as variáveis do DOM já estão declaradas acima.
        configurarEventListeners(); 
        renderizarCarrinho();
    }

    async function carregarVendedores() {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao carregar vendedores.');
            const usuarios = await response.json();
            
            // vendedorSelect já está declarado no escopo acima
            if (vendedorSelect) { 
                vendedorSelect.innerHTML = '';
                usuarios.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = `${user.nome} (${user.cargo})`;
                    if (user.id === vendedorAtualId) option.selected = true;
                    vendedorSelect.appendChild(option);
                });
            } else {
                console.error("ERRO: Elemento 'vendedor-select' não encontrado para carregar vendedores.");
            }
        } catch (error) {
            console.error("Erro ao carregar vendedores:", error);
            showCustomAlert("Erro ao carregar vendedores. Verifique sua conexão e login.", "error");
        }
    }

    async function carregarTodosOsProdutos() {
        try {
            const response = await fetch(`${API_BASE_URL}/medicamentos`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao carregar produtos do estoque.');
            produtosDisponiveis = await response.json();
            filtrarErenderizarProdutos();
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            if (resultadosBuscaContainer) { // Verificação de segurança, resultadosBuscaContainer já está declarado
                 resultadosBuscaContainer.innerHTML = `<p class="col-span-full text-center text-red-500">${error.message}</p>`; 
            }
            showCustomAlert("Erro ao carregar produtos. Verifique sua conexão e login.", "error");
        }
    }

    async function carregarTodosOsClientes() {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao carregar clientes.');
            clientesDisponiveis = await response.json();
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
            showCustomAlert("Erro ao carregar clientes. Verifique sua conexão e login.", "error");
        }
    }

    // --- LÓGICA DE BUSCA, RENDERIZAÇÃO E PAGINAÇÃO ---
    // As funções já podem acessar as constantes de DOM porque estão no mesmo escopo
    function buscarClientes(termo) {
        if (!clienteSearchResults) return; // Verificação de segurança

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
        if (!clienteSearchInput || !clienteSelecionadoDiv || !clienteSearchResults) return; 

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
        if (!clienteSelecionadoDiv) return; 

        clienteAtual = null;
        clienteSelecionadoDiv.classList.add('hidden');
        clienteSelecionadoDiv.innerHTML = '';
    }

    function filtrarErenderizarProdutos() {
        if (!produtoSearchInput) return; 

        const termoBusca = produtoSearchInput.value.toLowerCase();
        produtosFiltrados = produtosDisponiveis.filter(p => 
            p.nome.toLowerCase().includes(termoBusca) || 
            (p.principioAtivo && p.principioAtivo.toLowerCase().includes(termoBusca))
        );
        paginaAtual = 0;
        renderizarPaginaDeProdutos();
    }
    
    function renderizarPaginaDeProdutos() {
        if (!resultadosBuscaContainer || !paginationContainer) return; 

        const start = paginaAtual * ITENS_POR_PAGINA;
        const end = start + ITENS_POR_PAGINA;
        const produtosDaPagina = produtosFiltrados.slice(start, end);
        renderizarResultadosBusca(produtosDaPagina);
        renderizarControlesDePaginacao();
    }

    function renderizarResultadosBusca(produtos) {
        if (!resultadosBuscaContainer) return; 

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
        const paginationContainer = document.getElementById("pagination-container"); 
        if (!paginationContainer) return; 

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
        const estoqueDisponivelParaAdicionar = produto.estoqueAtual - (itemExistente ? itemExistente.quantidade : 0);

        if (quantidade > estoqueDisponivelParaAdicionar) {
            showCustomAlert(`Apenas ${estoqueDisponivelParaAdicionar} unidades de "${produto.nome}" disponíveis em estoque para adicionar.`, 'error');
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

        const produtoNoEstoque = produtosDisponiveis.find(p => p.id === produtoId);
        
        if (novaQuantidade > produtoNoEstoque.estoqueAtual) {
            showCustomAlert(`Estoque máximo de "${produtoNoEstoque.nome}" (${produtoNoEstoque.estoqueAtual}) atingido.`, 'error');
            carrinho[itemIndex].quantidade = produtoNoEstoque.estoqueAtual; 
        } else if (novaQuantidade < 1) {
            carrinho.splice(itemIndex, 1); 
        } else {
            carrinho[itemIndex].quantidade = novaQuantidade;
        }
        renderizarCarrinho();
    }
    
    function renderizarCarrinho() {
        // As variáveis do DOM já estão declaradas no escopo pai
        if (!carrinhoContainer || !carrinhoSubtotalEl || !descontoInput || !carrinhoTotalGeralEl) return; 

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
        // As variáveis do DOM já estão declaradas no escopo pai
        if (!carrinhoSubtotalEl || !descontoInput || !carrinhoTotalGeralEl) return; 

        const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        const descontoPercent = parseFloat(descontoInput.value) || 0;
        const valorDesconto = (subtotal * descontoPercent) / 100;
        const total = subtotal - valorDesconto;
        
        carrinhoSubtotalEl.textContent = formatarMoeda(subtotal);
        carrinhoTotalGeralEl.textContent = formatarMoeda(total);
    }
    
    // --- FLUXO DE FINALIZAÇÃO DE VENDA (COM MODAIS) ---
    function iniciarFluxoPagamento() { 
        if (carrinho.length === 0) {
            showCustomAlert("O carrinho está vazio. Adicione produtos antes de finalizar.", "error");
            return;
        }
        abrirModalRevisaoVenda();
    }

    // Modal 1: Revisão da Compra
    function abrirModalRevisaoVenda() {
        const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        const descontoPercent = parseFloat(descontoInput.value) || 0; // descontoInput já está no escopo pai
        const total = subtotal - ((subtotal * descontoPercent) / 100);
        
        const modalAntigo = document.getElementById('confirm-revisao-overlay');
        if(modalAntigo) modalAntigo.remove();

        const modalHtml = `
            <div id="confirm-revisao-overlay" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm text-center">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Revisar Venda</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Por favor, revise os totais antes de prosseguir.</p>
                    <div class="text-left space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
                        <div class="flex justify-between"><span>Cliente:</span><span class="font-medium">${clienteAtual ? clienteAtual.nome : 'Consumidor Final'}</span></div>
                        <div class="flex justify-between"><span>Subtotal:</span><span class="font-medium">${formatarMoeda(subtotal)}</span></div>
                        <div class="flex justify-between"><span>Desconto:</span><span class="font-medium">${descontoPercent}%</span></div>
                        <div class="flex justify-between text-lg font-bold"><span>Total a Pagar:</span><span class="text-green-600 dark:text-green-400">${formatarMoeda(total)}</span></div>
                    </div>
                    <div class="space-y-3">
                           <button id="btn-prosseguir-pagamento" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition-colors">Prosseguir para Pagamento</button>
                           <button id="btn-cancelar-revisao" class="w-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded transition-colors">Voltar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('btn-prosseguir-pagamento').addEventListener('click', () => {
            document.getElementById('confirm-revisao-overlay').remove(); 
            abrirModalPagamento(total); 
        });
        document.getElementById('btn-cancelar-revisao').addEventListener('click', () => {
            document.getElementById('confirm-revisao-overlay').remove();
        });
    }

    // Modal 2: Opções de Pagamento
    function abrirModalPagamento(totalAPagar) {
        const modalAntigo = document.getElementById('modal-pagamento-overlay');
        if(modalAntigo) modalAntigo.remove();

        const modalHtml = `
            <div id="modal-pagamento-overlay" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm text-center">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Finalizar Pagamento</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Total a pagar: <span class="font-bold text-green-600 dark:text-green-400">${formatarMoeda(totalAPagar)}</span></p>
                    
                    <div class="text-left space-y-3 mb-6">
                        <label class="flex items-center space-x-2 p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/30 has-[:checked]:border-purple-500 transition-all">
                            <input type="radio" name="forma-pagamento-modal" value="Dinheiro" class="form-radio h-4 w-4 text-purple-600 focus:ring-purple-500" checked>
                            <span class="text-sm text-gray-700 dark:text-gray-300">Dinheiro</span>
                        </label>
                        <label class="flex items-center space-x-2 p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/30 has-[:checked]:border-purple-500 transition-all">
                            <input type="radio" name="forma-pagamento-modal" value="Cartão de Crédito" class="form-radio h-4 w-4 text-purple-600 focus:ring-purple-500">
                            <span class="text-sm text-gray-700 dark:text-gray-300">Crédito</span>
                        </label>
                        <label class="flex items-center space-x-2 p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/30 has-[:checked]:border-purple-500 transition-all">
                            <input type="radio" name="forma-pagamento-modal" value="Cartão de Débito" class="form-radio h-4 w-4 text-purple-600 focus:ring-purple-500">
                            <span class="text-sm text-gray-700 dark:text-gray-300">Débito</span>
                        </label>
                        <label class="flex items-center space-x-2 p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 has-[:checked]:bg-purple-50 dark:has-[:checked]:bg-purple-900/30 has-[:checked]:border-purple-500 transition-all">
                            <input type="radio" name="forma-pagamento-modal" value="PIX" class="form-radio h-4 w-4 text-purple-600 focus:ring-purple-500">
                            <span class="text-sm text-gray-700 dark:text-gray-300">PIX</span>
                        </label>
                    </div>

                    <div class="space-y-3">
                           <button id="btn-pagamento-efetuado" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors">Pagamento Efetuado</button>
                           <button id="btn-cancelar-pagamento" class="w-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded transition-colors">Voltar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('btn-pagamento-efetuado').addEventListener('click', processarPagamentoEregistrarVenda);
        document.getElementById('btn-cancelar-pagamento').addEventListener('click', () => {
            document.getElementById('modal-pagamento-overlay').remove();
            abrirModalRevisaoVenda(); 
        });
    }

    async function processarPagamentoEregistrarVenda() {
        // Obtenha os elementos aqui
        const descontoInput = document.getElementById('desconto'); // Obtenha o elemento
        const observacoesInput = document.getElementById('observacoes'); // Obtenha o elemento

        document.getElementById('modal-pagamento-overlay').remove(); 

        const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        const descontoPercent = parseFloat(descontoInput ? descontoInput.value : 0) || 0; // Acesso seguro
        const total = subtotal - (subtotal * descontoPercent / 100);
        const totais = { subtotal, descontoPercent, total };

        const formaPagamentoSelecionada = document.querySelector('input[name="forma-pagamento-modal"]:checked')?.value || "Não Informado";

        const vendaData = {
            cliente_id: clienteAtual ? clienteAtual.id : null,
            usuario_id: vendedorAtualId, 
            valorTotal: total,
            itens: carrinho.map(item => ({ 
                medicamento_id: item.id, 
                quantidade: item.quantidade, 
                precoUnitario: item.preco 
            })),
            formaPagamento: formaPagamentoSelecionada, 
            observacoes: observacoesInput ? observacoesInput.value : '' // Acesso seguro
        };

        try {
            const response = await fetch(`${API_BASE_URL}/vendas`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(vendaData)
            });
            const result = await response.json();

            if (!response.ok) {
                const errorMessage = result.erro || `Erro ${response.status} ao registrar venda.`;
                throw new Error(errorMessage);
            }
            
            gerarComprovante(result, carrinho, totais, vendaData);
            
            limparVenda();
            await carregarTodosOsProdutos(); 

        } catch (error) {
            console.error("Erro ao finalizar venda:", error);
            showCustomAlert(error.message, 'error'); 
        }
    }

    function gerarComprovante(vendaRegistrada, itensVendidos, totais, vendaInfo) {
        // vendedorSelect já está declarado no escopo pai
        if (!vendedorSelect) return; 

        const vendedor = vendedorSelect.options[vendedorSelect.selectedIndex]?.textContent.split(' (')[0] || 'Desconhecido';
        const dataVenda = new Date().toLocaleString('pt-BR');

        let itensHtml = '';
        itensVendidos.forEach(item => {
            itensHtml += `<tr><td style="padding: 4px 2px;">${item.quantidade}x ${item.nome}</td><td style="text-align:right; padding: 4px 2px;">${formatarMoeda(item.preco * item.quantidade)}</td></tr>`;
        });

        const comprovanteHtml = `
            <!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Venda #${vendaRegistrada.vendaId}</title>
            <style>
                body { font-family: 'Courier New', monospace; margin: 0; padding: 10px; font-size: 10pt; color: #000; background-color: #fff; }
                .comprovante { width: 300px; margin: auto; } .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; }
                h2, p { margin: 0 0 5px 0; } .item-table { width: 100%; border-collapse: collapse; margin-top: 10px;}
                .total-section { border-top: 1px dashed #000; padding-top: 5px; margin-top: 5px;}
                .total-section div { display: flex; justify-content: space-between; padding: 2px 0; }
                .no-print { margin-top: 20px; text-align: center; }
                @media print { .no-print { display: none; } }
            </style></head><body><div class="comprovante">
                <div class="header"><h2>Farmácia A Barateira</h2><p>Rua Principal, 123</p></div>
                <p>CUPOM NAO FISCAL</p><p>------------------------------</p>
                <p><strong>Venda:</strong> #${vendaRegistrada.vendaId}</p><p><strong>Data:</strong> ${dataVenda}</p>
                <p><strong>Vendedor:</strong> ${vendedor}</p><p><strong>Cliente:</strong> ${clienteAtual ? clienteAtual.nome : 'Consumidor Final'}</p>
                <p>------------------------------</p>
                <table class="item-table"><tbody>${itensHtml}</tbody></table>
                <div class="total-section">
                    <div><span>Subtotal:</span><span>${formatarMoeda(totais.subtotal)}</span></div>
                    <div><span>Desconto:</span><span>${totais.descontoPercent}%</span></div>
                    <div style="font-weight: bold; font-size: 1.2em;"><span>TOTAL:</span><span>${formatarMoeda(totais.total)}</span></div>
                </div>
                <p>------------------------------</p>
                <p><strong>Forma de Pagamento:</strong> ${vendaInfo.formaPagamento}</p>
                ${vendaInfo.observacoes ? `<p><strong>Obs:</strong> ${vendaInfo.observacoes}</p>` : ''}
                <p style="text-align:center; margin-top: 15px;">Obrigado e volte sempre!</p>
                <div class="no-print"><button onclick="window.print()">Imprimir</button> <button onclick="window.close()">Fechar</button></div>
            </div></body></html>`;

        const novaAba = window.open('', '_blank', 'width=320,height=600');
        novaAba.document.write(comprovanteHtml);
        novaAba.document.close();
    }

    // --- FUNÇÕES DE APOIO ---
    // A função limparVenda já acessa descontoInput e observacoesInput de forma segura.
    function limparVenda() {
        const observacoesInput = document.getElementById('observacoes'); // Acesso aqui também
        const formaPagamentoRadios = document.querySelectorAll('input[name="forma-pagamento"]'); // Acesso aqui também

        carrinho = [];
        removerCliente();
        // descontoInput já está no escopo, então basta usar
        if (descontoInput) descontoInput.value = 0; 
        if (observacoesInput) observacoesInput.value = '';
        formaPagamentoRadios.forEach(radio => radio.checked = false);
        renderizarCarrinho();
        filtrarErenderizarProdutos(); 
    }
    
    function formatarMoeda(valor) { 
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); 
    }

    // --- CONFIGURAÇÃO DOS EVENT LISTENERS ---
    // Esta função apenas ANEXA LISTENERS, não precisa declarar elementos aqui novamente
    function configurarEventListeners() {
        // Debug para verificar se os elementos foram encontrados no escopo pai
        console.log("DEBUG: clienteSearchInput", clienteSearchInput);
        console.log("DEBUG: vendedorSelect", vendedorSelect);
        console.log("DEBUG: realizarPagamentoBtn", realizarPagamentoBtn);
        console.log("DEBUG: cancelarVendaBtn", cancelarVendaBtn);


        // --- Adicionar Event Listeners ---
        if (clienteSearchInput) {
            clienteSearchInput.addEventListener('keyup', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => buscarClientes(e.target.value), 300);
            });
        }

        if (produtoSearchInput) {
            produtoSearchInput.addEventListener('keyup', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => filtrarErenderizarProdutos(), 300);
            });
        }

        if (resultadosBuscaContainer) {
            resultadosBuscaContainer.addEventListener('click', e => {
                const button = e.target.closest('button[data-action="adicionar"]');
                if (button) {
                    const produtoId = parseInt(button.dataset.id, 10);
                    // O input de quantidade é dinâmico, acessado por ID
                    const qtdInput = document.getElementById(`qtd-${produtoId}`); 
                    const quantidade = parseInt(qtdInput.value, 10);
                    adicionarAoCarrinho(produtoId, quantidade);
                    qtdInput.value = 1; 
                }
            });
        }
        
        if (carrinhoContainer) {
            carrinhoContainer.addEventListener('click', e => {
                const button = e.target.closest('button[data-action="remover-item"]');
                if(button) {
                    alterarQuantidadeCarrinho(parseInt(button.dataset.id, 10), 0); 
                }
            });
            
            carrinhoContainer.addEventListener('input', e => {
                if(e.target.matches('input[type="number"]')) {
                    // Lógica robusta para obter o produtoId do input dinâmico
                    const productIdMatch = e.target.id.match(/^qtd-(\d+)$/);
                    let produtoId = null;
                    if (productIdMatch) {
                        produtoId = parseInt(productIdMatch[1], 10);
                    } else if (e.target.dataset.id) { 
                        produtoId = parseInt(e.target.dataset.id, 10);
                    }

                    const novaQuantidade = parseInt(e.target.value, 10);
                    if (!isNaN(produtoId) && produtoId !== null) {
                        alterarQuantidadeCarrinho(produtoId, novaQuantidade);
                    }
                }
            });
        }

        if (clienteSelecionadoDiv) {
            clienteSelecionadoDiv.addEventListener('click', e => {
                if (e.target.closest('button[data-action="remover-cliente"]')) removerCliente();
            });
        }

        if (vendedorSelect) {
            vendedorSelect.addEventListener('change', (e) => { vendedorAtualId = parseInt(e.target.value, 10); });
        }
        
        if (novoClienteBtn) {
            novoClienteBtn.addEventListener('click', () => { window.open('clientes.html', '_blank'); });
        }

        if (descontoInput) { // descontoInput agora é acessível
            descontoInput.addEventListener('input', calcularTotais);
        } else {
            console.error("ERRO: Elemento 'desconto' não encontrado.");
        }

        // Listener para o NOVO botão "Realizar Pagamento"
        if (realizarPagamentoBtn) {
            realizarPagamentoBtn.addEventListener('click', iniciarFluxoPagamento);
            console.log("DEBUG: Listener de click adicionado ao Realizar Pagamento.");
        } else {
            console.error("ERRO: Botão 'realizar-pagamento-button' não encontrado no DOM. Verifique o HTML.");
        }

        // Listener para o botão "Cancelar Venda"
        if (cancelarVendaBtn) {
            cancelarVendaBtn.addEventListener('click', () => {
                if (carrinho.length > 0 && confirm("Tem certeza que deseja cancelar e limpar a venda atual?")) {
                    limparVenda();
                } else if (carrinho.length === 0) {
                    limparVenda(); 
                }
            });
        } else {
            console.error("ERRO: Botão 'cancelar-venda-button' não encontrado no DOM. Verifique o HTML.");
        }

        // O botão 'finalizar-venda-button' (Finalizar Venda - Antigo)
        // Se você quiser que ele faça o mesmo que "Realizar Pagamento", descomente a linha abaixo.
        // if (finalizarVendaBtn) {
        //     finalizarVendaBtn.addEventListener('click', iniciarFluxoPagamento); 
        // }
    }

    // Lógica de Logout
    const logoutButton = document.getElementById("logout-button"); // Obtido aqui
    if(logoutButton) {
        logoutButton.addEventListener("click", () => {
            console.log("Logout solicitado.");
            alert("Você foi desconectado.");
            localStorage.removeItem('authToken'); 
            localStorage.removeItem('usuarioLogado');
            window.location.href = "index.html"; 
        });
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    // inicializarPagina() é chamada aqui, no escopo global de DOMContentLoaded.
    inicializarPagina();
});