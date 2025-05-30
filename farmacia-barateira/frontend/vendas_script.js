document.addEventListener("DOMContentLoaded", () => {
    // Definição da URL base da API
    const API_BASE_URL = "http://localhost:3000/api";
    
    // Elementos do DOM
    const clienteSearch = document.getElementById("cliente-search");
    const clienteSelecionado = document.getElementById("cliente-selecionado");
    const produtoSearch = document.getElementById("produto-search");
    const resultadosBusca = document.getElementById("resultados-busca");
    const carrinhoItens = document.getElementById("carrinho-itens");
    const totalItens = document.getElementById("total-itens");
    const subtotal = document.getElementById("subtotal");
    const desconto = document.getElementById("desconto");
    const total = document.getElementById("total");
    const finalizarVendaButton = document.getElementById("finalizar-venda-button");
    const finalizarVendaButtonBottom = document.getElementById("finalizar-venda-button-bottom");
    const cancelarVendaButton = document.getElementById("cancelar-venda-button");
    const cancelarVendaButtonBottom = document.getElementById("cancelar-venda-button-bottom");
    const confirmacaoModal = document.getElementById("confirmacao-modal");
    const imprimirButton = document.getElementById("imprimir-button");
    const novaVendaButton = document.getElementById("nova-venda-button");
    const logoutButton = document.getElementById("logout-button");
    
    // Variáveis de estado
    let carrinhoAtual = [];
    let clienteAtual = null;
    let descontoAtual = 0;
    
    // Verificar autenticação
function verificarAutenticacao() {
    return true; // autenticação desativada
}
    
    // Buscar clientes
    clienteSearch.addEventListener("input", async () => {
        const termo = clienteSearch.value.trim();
        if (termo.length < 3) return;
        
        try {
            const token = localStorage.getItem('token');
            // Em produção, fazer requisição real
            // const response = await fetch(`${API_BASE_URL}/clientes/busca?termo=${termo}`, {
            //     headers: { "Authorization": `Bearer ${token}` }
            // });
            // const clientes = await response.json();
            
            // Simulação de resposta
            const clientes = [
                { id: 1, nome: "Maria Silva", cpf: "123.456.789-00" },
                { id: 2, nome: "João Santos", cpf: "987.654.321-00" }
            ].filter(c => c.nome.toLowerCase().includes(termo.toLowerCase()) || 
                          c.cpf.includes(termo));
            
            // Exibir resultados
            if (clientes.length > 0) {
                // Implementar dropdown de resultados
                console.log("Clientes encontrados:", clientes);
                // Selecionar o primeiro cliente para demonstração
                selecionarCliente(clientes[0]);
            }
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    });
    
    // Selecionar cliente
    function selecionarCliente(cliente) {
        clienteAtual = cliente;
        clienteSelecionado.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-medium text-gray-800">${cliente.nome}</p>
                    <p class="text-sm text-gray-600">CPF: ${cliente.cpf}</p>
                </div>
                <button class="text-red-500 hover:text-red-700" onclick="removerCliente()">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        `;
        clienteSelecionado.style.display = "block";
        clienteSearch.value = "";
    }
    
    // Remover cliente selecionado
    window.removerCliente = function() {
        clienteAtual = null;
        clienteSelecionado.style.display = "none";
    };
    
    // Buscar produtos
    document.getElementById("buscar-produto-button").addEventListener("click", async () => {
        const termo = produtoSearch.value.trim();
        if (termo.length < 2) return;
        
        try {
            const token = localStorage.getItem('token');
            // Em produção, fazer requisição real
            // const response = await fetch(`${API_BASE_URL}/medicamentos/busca?termo=${termo}`, {
            //     headers: { "Authorization": `Bearer ${token}` }
            // });
            // const produtos = await response.json();
            
            // Simulação de resposta
            const produtos = [
                { 
                    id: 1, 
                    nome: "Dorflexol Extra Power", 
                    principioAtivo: "Flexina Dorada", 
                    tipo: "Manipulado", 
                    estoque: 42, 
                    preco: 19.90 
                },
                { 
                    id: 2, 
                    nome: "Paracetamol 500mg", 
                    principioAtivo: "Acetaminofeno", 
                    tipo: "Genérico", 
                    estoque: 120, 
                    preco: 5.99 
                },
                { 
                    id: 3, 
                    nome: "Vitamina C 1000mg", 
                    principioAtivo: "Ácido Ascórbico", 
                    tipo: "Suplemento", 
                    estoque: 85, 
                    preco: 12.50 
                }
            ].filter(p => p.nome.toLowerCase().includes(termo.toLowerCase()) || 
                          p.principioAtivo.toLowerCase().includes(termo.toLowerCase()));
            
            // Exibir resultados
            renderizarResultadosBusca(produtos);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    });
    
    // Renderizar resultados da busca de produtos
    function renderizarResultadosBusca(produtos) {
        resultadosBusca.innerHTML = "";
        
        if (produtos.length === 0) {
            resultadosBusca.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">Nenhum produto encontrado.</p>
                </div>
            `;
            return;
        }
        
        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.className = "bg-white rounded-lg shadow-md overflow-hidden produto-card transition-all duration-300";
            card.innerHTML = `
                <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-xl font-semibold text-gray-800">${produto.nome}</h3>
                            <p class="text-gray-600 mt-1">${produto.principioAtivo}</p>
                        </div>
                        <div class="text-3xl">💊</div>
                    </div>
                </div>
                <div class="p-5">
                    <div class="mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-700">Tipo:</span>
                            <span class="font-medium">${produto.tipo}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-700">Estoque:</span>
                            <span class="font-medium">${produto.estoque} unidades</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-700">Preço:</span>
                            <span class="font-medium text-green-600">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center">
                            <label for="qtd-${produto.id}" class="mr-2 text-sm text-gray-700">Quantidade:</label>
                            <input type="number" id="qtd-${produto.id}" min="1" max="${produto.estoque}" value="1" class="w-16 border rounded py-1 px-2 text-center">
                        </div>
                        <button class="bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-3 rounded text-sm flex items-center"
                                onclick="adicionarAoCarrinho(${produto.id}, '${produto.nome}', '${produto.tipo}', ${produto.preco})">
                            <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Adicionar
                        </button>
                    </div>
                </div>
            `;
            resultadosBusca.appendChild(card);
        });
    }
    
    // Adicionar produto ao carrinho
    window.adicionarAoCarrinho = function(id, nome, tipo, preco) {
        const quantidade = parseInt(document.getElementById(`qtd-${id}`).value);
        if (quantidade < 1) return;
        
        // Verificar se o produto já está no carrinho
        const index = carrinhoAtual.findIndex(item => item.id === id);
        
        if (index !== -1) {
            // Atualizar quantidade
            carrinhoAtual[index].quantidade += quantidade;
            carrinhoAtual[index].subtotal = carrinhoAtual[index].quantidade * carrinhoAtual[index].preco;
        } else {
            // Adicionar novo item
            carrinhoAtual.push({
                id,
                nome,
                tipo,
                preco,
                quantidade,
                subtotal: quantidade * preco
            });
        }
        
        // Atualizar interface
        atualizarCarrinho();
    };
    
    // Remover item do carrinho
    window.removerDoCarrinho = function(id) {
        carrinhoAtual = carrinhoAtual.filter(item => item.id !== id);
        atualizarCarrinho();
    };
    
    // Alterar quantidade de item no carrinho
    window.alterarQuantidade = function(id, incremento) {
        const index = carrinhoAtual.findIndex(item => item.id === id);
        if (index === -1) return;
        
        const novaQuantidade = carrinhoAtual[index].quantidade + incremento;
        if (novaQuantidade < 1) return;
        
        carrinhoAtual[index].quantidade = novaQuantidade;
        carrinhoAtual[index].subtotal = novaQuantidade * carrinhoAtual[index].preco;
        
        atualizarCarrinho();
    };
    
    // Atualizar interface do carrinho
    function atualizarCarrinho() {
        carrinhoItens.innerHTML = "";
        
        if (carrinhoAtual.length === 0) {
            carrinhoItens.innerHTML = `
                <tr class="border-b border-gray-200">
                    <td colspan="5" class="py-4 text-center text-gray-500">
                        Carrinho vazio. Adicione produtos para iniciar uma venda.
                    </td>
                </tr>
            `;
            
            totalItens.textContent = "0";
            subtotal.textContent = "R$ 0,00";
            total.textContent = "R$ 0,00";
            return;
        }
        
        let quantidadeTotal = 0;
        let valorSubtotal = 0;
        
        carrinhoAtual.forEach(item => {
            const tr = document.createElement("tr");
            tr.className = "border-b border-gray-200 hover:bg-gray-50";
            tr.innerHTML = `
                <td class="py-3 px-6 text-left">
                    <div>
                        <p class="font-medium">${item.nome}</p>
                        <p class="text-xs text-gray-500">${item.tipo}</p>
                    </div>
                </td>
                <td class="py-3 px-6 text-center">
                    <div class="flex justify-center items-center">
                        <button class="text-gray-500 hover:text-gray-700 mr-2" onclick="alterarQuantidade(${item.id}, -1)">
                            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <span>${item.quantidade}</span>
                        <button class="text-gray-500 hover:text-gray-700 ml-2" onclick="alterarQuantidade(${item.id}, 1)">
                            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                </td>
                <td class="py-3 px-6 text-right">R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
                <td class="py-3 px-6 text-right font-medium">R$ ${item.subtotal.toFixed(2).replace('.', ',')}</td>
                <td class="py-3 px-6 text-center">
                    <button class="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded-full transition-colors" onclick="removerDoCarrinho(${item.id})">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </td>
            `;
            carrinhoItens.appendChild(tr);
            
            quantidadeTotal += item.quantidade;
            valorSubtotal += item.subtotal;
        });
        
        // Atualizar resumo
        totalItens.textContent = quantidadeTotal;
        subtotal.textContent = `R$ ${valorSubtotal.toFixed(2).replace('.', ',')}`;
        
        // Calcular desconto
        descontoAtual = parseFloat(desconto.value) || 0;
        const valorDesconto = (valorSubtotal * descontoAtual) / 100;
        const valorTotal = valorSubtotal - valorDesconto;
        
        total.textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }
    
    // Atualizar total quando o desconto mudar
    desconto.addEventListener("input", () => {
        atualizarCarrinho();
    });
    
    // Finalizar venda
    function finalizarVenda() {
        if (carrinhoAtual.length === 0) {
            alert("Adicione produtos ao carrinho para finalizar a venda.");
            return;
        }
        
        if (!clienteAtual) {
            alert("Selecione um cliente para finalizar a venda.");
            return;
        }
        
        // Calcular valores finais
        const valorSubtotal = carrinhoAtual.reduce((acc, item) => acc + item.subtotal, 0);
        const valorDesconto = (valorSubtotal * descontoAtual) / 100;
        const valorTotal = valorSubtotal - valorDesconto;
        
        // Preparar dados da venda
        const venda = {
            cliente_id: clienteAtual.id,
            itens: carrinhoAtual.map(item => ({
                produto_id: item.id,
                quantidade: item.quantidade,
                preco_unitario: item.preco
            })),
            desconto: descontoAtual,
            valor_total: valorTotal,
            forma_pagamento: document.querySelector('input[name="pagamento"]:checked').value,
            observacoes: document.getElementById("observacoes").value
        };
        
        // Em produção, enviar para o backend
        console.log("Venda finalizada:", venda);
        
        // Mostrar modal de confirmação
        confirmacaoModal.style.display = "flex";
    }
    
    // Eventos de finalizar venda
    finalizarVendaButton.addEventListener("click", finalizarVenda);
    finalizarVendaButtonBottom.addEventListener("click", finalizarVenda);
    
    // Eventos de cancelar venda
    cancelarVendaButton.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja cancelar esta venda?")) {
            limparVenda();
        }
    });
    
    cancelarVendaButtonBottom.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja cancelar esta venda?")) {
            limparVenda();
        }
    });
    
    // Limpar venda atual
    function limparVenda() {
        carrinhoAtual = [];
        clienteAtual = null;
        descontoAtual = 0;
        
        // Resetar interface
        clienteSelecionado.style.display = "none";
        desconto.value = "0";
        document.getElementById("observacoes").value = "";
        document.querySelector('input[name="pagamento"][value="cartao_credito"]').checked = true;
        
        atualizarCarrinho();
        produtoSearch.value = "";
        resultadosBusca.innerHTML = "";
    }
    
    // Eventos do modal de confirmação
    imprimirButton.addEventListener("click", () => {
        // Simulação de impressão
        alert("Enviando para impressão...");
    });
    
    novaVendaButton.addEventListener("click", () => {
        confirmacaoModal.style.display = "none";
        limparVenda();
    });
    
    // Logout
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        window.location.href = "index.html";
    });
    
    // Inicialização
    verificarAutenticacao();
    atualizarCarrinho();
    
    // Configurar opções de pagamento
    const periodoSelect = document.getElementById('periodo');
    const opcoesCartao = document.getElementById('opcoes-cartao');
    
    document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'cartao_credito') {
                opcoesCartao.style.display = 'block';
            } else {
                opcoesCartao.style.display = 'none';
            }
        });
    });
});
