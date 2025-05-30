document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Carregado. Iniciando script vendas..."); // Log inicial
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
    const descontoInput = document.getElementById("desconto");
    const total = document.getElementById("total");
    const finalizarVendaButton = document.getElementById("finalizar-venda-button");
    const finalizarVendaButtonBottom = document.getElementById("finalizar-venda-button-bottom");
    const cancelarVendaButton = document.getElementById("cancelar-venda-button");
    const cancelarVendaButtonBottom = document.getElementById("cancelar-venda-button-bottom");
    const logoutButton = document.getElementById("logout-button");
    const buscarProdutoButton = document.getElementById("buscar-produto-button");

    // Variáveis de estado
    let carrinhoAtual = [];
    let clienteAtual = null;
    let descontoAtual = 0;
    // Dados simulados - Idealmente viriam do backend
    let produtosSimulados = [
        { id: 1, nome: "Dorflexol Extra Power", principioAtivo: "Flexina Dorada", tipo: "Manipulado", estoque: 42, preco: 19.90 },
        { id: 2, nome: "Paracetamol 500mg", principioAtivo: "Acetaminofeno", tipo: "Genérico", estoque: 120, preco: 5.99 },
        { id: 3, nome: "Vitamina C 1000mg", principioAtivo: "Ácido Ascórbico", tipo: "Suplemento", estoque: 85, preco: 12.50 }
    ];

    // --- Funções Auxiliares ---
    function formatarMoeda(valor) {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    // --- Lógica de Clientes ---
    if (clienteSearch) {
        clienteSearch.addEventListener("input", async () => {
            const termo = clienteSearch.value.trim();
            if (termo.length < 3) return;
            try {
                // Simulação - Substituir por fetch real se necessário
                const clientes = [
                    { id: 1, nome: "Maria Silva", cpf: "123.456.789-00" },
                    { id: 2, nome: "João Santos", cpf: "987.654.321-00" }
                ].filter(c => c.nome.toLowerCase().includes(termo.toLowerCase()) || c.cpf.includes(termo));
                if (clientes.length > 0) {
                    console.log("Clientes encontrados (simulado):", clientes);
                    selecionarCliente(clientes[0]); // Seleciona o primeiro para demo
                }
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
                alert("Erro ao buscar clientes.");
            }
        });
    }

    function selecionarCliente(cliente) {
        console.log("Selecionando cliente:", cliente);
        clienteAtual = cliente;
        if (clienteSelecionado) {
            clienteSelecionado.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-medium text-gray-800">${cliente.nome}</p>
                        <p class="text-sm text-gray-600">CPF: ${cliente.cpf}</p>
                    </div>
                    <button data-action="remover-cliente" class="text-red-500 hover:text-red-700">
                        <svg class="h-5 w-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            `;
            clienteSelecionado.style.display = "block";
        }
        if (clienteSearch) clienteSearch.value = "";
    }

    function removerCliente() {
        console.log("Removendo cliente selecionado.");
        clienteAtual = null;
        if (clienteSelecionado) {
            clienteSelecionado.style.display = "none";
            clienteSelecionado.innerHTML = '';
        }
    }

    if (clienteSelecionado) {
        clienteSelecionado.addEventListener('click', (event) => {
            const target = event.target.closest('button');
            if (target && target.dataset.action === 'remover-cliente') {
                removerCliente();
            }
        });
    }

    // --- Lógica de Produtos ---
    async function buscarProdutos() {
        const termo = produtoSearch ? produtoSearch.value.trim() : '';
        console.log(`Buscando produtos com termo: "${termo}"`);
        if (termo.length < 2) {
            // Limpa resultados se termo for curto, ou mantém os atuais
            // renderizarResultadosBusca(produtosSimulados); // Ou limpa:
            if (resultadosBusca) resultadosBusca.innerHTML = '<p class="col-span-full text-center text-gray-500">Digite ao menos 2 caracteres para buscar.</p>';
            return;
        }
        try {
            // Simulação - Substituir por fetch real se necessário
            // const response = await fetch(`${API_BASE_URL}/medicamentos?q=${termo}`);
            // if (!response.ok) throw new Error('Erro ao buscar produtos');
            // const produtosEncontrados = await response.json();
            const produtosFiltrados = produtosSimulados.filter(p =>
                p.nome.toLowerCase().includes(termo.toLowerCase()) ||
                (p.principioAtivo && p.principioAtivo.toLowerCase().includes(termo.toLowerCase()))
            );
            console.log("Produtos encontrados (simulado):", produtosFiltrados);
            renderizarResultadosBusca(produtosFiltrados);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            if (resultadosBusca) resultadosBusca.innerHTML = '<p class="col-span-full text-center text-red-500">Erro ao buscar produtos.</p>';
        }
    }

    if (buscarProdutoButton) {
        buscarProdutoButton.addEventListener("click", buscarProdutos);
    }
    // Inicializa a busca com produtos simulados para teste
    renderizarResultadosBusca(produtosSimulados);

    function renderizarResultadosBusca(produtos) {
        console.log("Renderizando resultados da busca...");
        if (!resultadosBusca) return; // Verifica se o elemento existe
        resultadosBusca.innerHTML = "";
        if (!Array.isArray(produtos) || produtos.length === 0) {
            resultadosBusca.innerHTML = `<div class="col-span-full text-center py-8"><p class="text-gray-500">Nenhum produto encontrado.</p></div>`;
            return;
        }
        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.className = "bg-white rounded-lg shadow-md overflow-hidden produto-card transition-all duration-300";
            card.dataset.produtoId = produto.id; // Adiciona ID do produto ao card para referência
            card.innerHTML = `
                <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-xl font-semibold text-gray-800">${produto.nome}</h3>
                            <p class="text-gray-600 mt-1">${produto.principioAtivo || 'N/A'}</p>
                        </div>
                        <div class="text-3xl">💊</div>
                    </div>
                </div>
                <div class="p-5">
                    <div class="mb-4">
                        <div class="flex justify-between mb-2"><span class="text-gray-700">Tipo:</span><span class="font-medium">${produto.tipo || 'N/A'}</span></div>
                        <div class="flex justify-between mb-2"><span class="text-gray-700">Estoque:</span><span class="font-medium">${produto.estoque !== undefined ? produto.estoque + ' unidades' : 'N/A'}</span></div>
                        <div class="flex justify-between"><span class="text-gray-700">Preço:</span><span class="font-medium text-green-600">${produto.preco !== undefined ? formatarMoeda(produto.preco) : 'N/A'}</span></div>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center">
                            <label for="qtd-${produto.id}" class="mr-2 text-sm text-gray-700">Quantidade:</label>
                            <input type="number" id="qtd-${produto.id}" min="1" max="${produto.estoque}" value="1" class="w-16 border rounded py-1 px-2 text-center">
                        </div>
                        <button data-action="adicionar" data-id="${produto.id}" data-nome="${produto.nome}" data-tipo="${produto.tipo}" data-preco="${produto.preco}" class="bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-3 rounded text-sm flex items-center">
                            <svg class="h-4 w-4 mr-1 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Adicionar
                        </button>
                    </div>
                </div>
            `;
            resultadosBusca.appendChild(card);
        });
        console.log("Resultados renderizados.");
    }

    // Event listener para adicionar produto (delegação)
    if (resultadosBusca) {
        resultadosBusca.addEventListener('click', (event) => {
            console.log("Clique detectado em resultadosBusca.");
            const target = event.target.closest('button[data-action="adicionar"]');
            if (target) {
                console.log("Botão 'Adicionar' clicado:", target);
                const id = parseInt(target.dataset.id);
                const nome = target.dataset.nome;
                const tipo = target.dataset.tipo;
                const preco = parseFloat(target.dataset.preco);
                const inputQuantidade = document.getElementById(`qtd-${id}`);
                const quantidade = parseInt(inputQuantidade.value);
                // const estoqueMax = parseInt(inputQuantidade.max); // Usar dados do array simulado

                console.log(`Tentando adicionar: ID=${id}, Nome=${nome}, Qtd=${quantidade}, Preço=${preco}`);

                if (isNaN(quantidade) || quantidade < 1) {
                    alert("Quantidade inválida.");
                    return;
                }
                // Verifica se a quantidade a adicionar excede o estoque disponível
                const produtoNoEstoque = produtosSimulados.find(p => p.id === id);
                if (!produtoNoEstoque || quantidade > produtoNoEstoque.estoque) {
                     alert(`Quantidade (${quantidade}) excede o estoque disponível (${produtoNoEstoque?.estoque || 0} unidades).`);
                     return;
                }
                // Verifica se a quantidade no carrinho + a adicionar excede o estoque
                const itemNoCarrinho = carrinhoAtual.find(item => item.id === id);
                const quantidadeJaNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
                if ((quantidadeJaNoCarrinho + quantidade) > produtoNoEstoque.estoque) {
                    alert(`Não é possível adicionar ${quantidade} unidade(s). Estoque total (${produtoNoEstoque.estoque}) seria excedido (já existem ${quantidadeJaNoCarrinho} no carrinho).`);
                    return;
                }

                adicionarAoCarrinho(id, nome, tipo, preco, quantidade);
            } else {
                 console.log("Clique não foi no botão 'Adicionar'.");
            }
        });
    }

    // --- Lógica do Carrinho ---
    function adicionarAoCarrinho(id, nome, tipo, preco, quantidade) {
        console.log(`Função adicionarAoCarrinho chamada com: ID=${id}, Qtd=${quantidade}`);
        const index = carrinhoAtual.findIndex(item => item.id === id);
        console.log("Estado do carrinho ANTES:", JSON.parse(JSON.stringify(carrinhoAtual)));

        if (index !== -1) {
            console.log(`Produto ${id} já existe no carrinho. Atualizando quantidade.`);
            carrinhoAtual[index].quantidade += quantidade;
            carrinhoAtual[index].subtotal = carrinhoAtual[index].quantidade * carrinhoAtual[index].preco;
        } else {
            console.log(`Produto ${id} não existe no carrinho. Adicionando novo item.`);
            carrinhoAtual.push({
                id,
                nome,
                tipo,
                preco,
                quantidade,
                subtotal: quantidade * preco
            });
        }
        console.log("Estado do carrinho DEPOIS:", JSON.parse(JSON.stringify(carrinhoAtual)));
        atualizarCarrinho();
    }

    function removerDoCarrinho(id) {
        console.log(`Removendo item ${id} do carrinho.`);
        carrinhoAtual = carrinhoAtual.filter(item => item.id !== id);
        atualizarCarrinho();
    }

    function alterarQuantidade(id, incremento) {
        console.log(`Alterando quantidade do item ${id} por ${incremento}.`);
        const index = carrinhoAtual.findIndex(item => item.id === id);
        if (index === -1) return;

        const novaQuantidade = carrinhoAtual[index].quantidade + incremento;
        const produtoEstoque = produtosSimulados.find(p => p.id === id)?.estoque || 0;

        if (novaQuantidade < 1) {
            removerDoCarrinho(id);
            return;
        }
        if (novaQuantidade > produtoEstoque) {
            alert(`Quantidade máxima (${produtoEstoque}) atingida.`);
            return;
        }
        carrinhoAtual[index].quantidade = novaQuantidade;
        carrinhoAtual[index].subtotal = novaQuantidade * carrinhoAtual[index].preco;
        atualizarCarrinho();
    }

    function atualizarCarrinho() {
        console.log("--- Atualizando Carrinho --- ");
        console.log("Carrinho atual para renderizar:", JSON.parse(JSON.stringify(carrinhoAtual)));
        if (!carrinhoItens) return; // Verifica se o elemento existe
        carrinhoItens.innerHTML = "";

        if (carrinhoAtual.length === 0) {
            console.log("Carrinho está vazio. Exibindo mensagem.");
            carrinhoItens.innerHTML = `
                <tr class="border-b border-gray-200">
                    <td colspan="5" class="py-4 text-center text-gray-500">
                        Carrinho vazio.
                    </td>
                </tr>
            `;
        } else {
            console.log("Renderizando itens do carrinho...");
            carrinhoAtual.forEach((item, index) => {
                console.log(`Renderizando item ${index + 1}:`, item);
                const tr = document.createElement("tr");
                tr.className = "border-b border-gray-200 hover:bg-gray-50";
                tr.innerHTML = `
                    <td class="py-3 px-6 text-left">
                        <div>
                            <p class="font-medium">${item.nome}</p>
                            <p class="text-xs text-gray-500">${item.tipo || 'N/A'}</p>
                        </div>
                    </td>
                    <td class="py-3 px-6 text-center">
                        <div class="flex justify-center items-center">
                            <button data-action="alterar-quantidade" data-id="${item.id}" data-incremento="-1" class="text-gray-500 hover:text-gray-700 mr-2">
                                <svg class="h-4 w-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                            </button>
                            <span>${item.quantidade}</span>
                            <button data-action="alterar-quantidade" data-id="${item.id}" data-incremento="1" class="text-gray-500 hover:text-gray-700 ml-2">
                                <svg class="h-4 w-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </button>
                        </div>
                    </td>
                    <td class="py-3 px-6 text-right">${formatarMoeda(item.preco)}</td>
                    <td class="py-3 px-6 text-right font-medium">${formatarMoeda(item.subtotal)}</td>
                    <td class="py-3 px-6 text-center">
                        <button data-action="remover" data-id="${item.id}" class="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded-full transition-colors">
                            <svg class="h-5 w-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </td>
                `;
                carrinhoItens.appendChild(tr);
            });
            console.log("Itens renderizados.");
        }
        atualizarResumoVenda();
        console.log("--- Fim Atualização Carrinho ---");
    }

    // Event listener para ações no carrinho (delegação)
    if (carrinhoItens) {
        carrinhoItens.addEventListener('click', (event) => {
            console.log("Clique detectado na tabela do carrinho.");
            const target = event.target.closest('button');
            if (!target) return;

            const action = target.dataset.action;
            const id = parseInt(target.dataset.id);
            console.log(`Ação no carrinho: ${action}, ID: ${id}`);

            if (action === 'alterar-quantidade') {
                const incremento = parseInt(target.dataset.incremento);
                alterarQuantidade(id, incremento);
            } else if (action === 'remover') {
                removerDoCarrinho(id);
            }
        });
    }

    // --- Lógica de Resumo e Finalização ---
    function atualizarResumoVenda() {
        console.log("Atualizando resumo da venda...");
        const quantidadeTotal = carrinhoAtual.reduce((acc, item) => acc + item.quantidade, 0);
        const valorSubtotal = carrinhoAtual.reduce((acc, item) => acc + item.subtotal, 0);

        if (descontoInput) {
            descontoAtual = parseFloat(descontoInput.value) || 0;
            if (descontoAtual < 0) descontoAtual = 0;
            if (descontoAtual > 100) descontoAtual = 100;
            descontoInput.value = descontoAtual; // Garante que o valor no input esteja correto
        } else {
            descontoAtual = 0; // Se não houver input de desconto
        }

        const valorDesconto = (valorSubtotal * descontoAtual) / 100;
        const valorTotal = valorSubtotal - valorDesconto;

        if (totalItens) totalItens.textContent = quantidadeTotal;
        if (subtotal) subtotal.textContent = formatarMoeda(valorSubtotal);
        if (total) total.textContent = formatarMoeda(valorTotal);
        console.log(`Resumo atualizado: Itens=${quantidadeTotal}, Subtotal=${formatarMoeda(valorSubtotal)}, Total=${formatarMoeda(valorTotal)}`);
    }

    if (descontoInput) {
        descontoInput.addEventListener("input", atualizarResumoVenda);
    }

    async function finalizarVenda() { // Tornada async para usar await no fetch
        console.log("Tentando finalizar venda...");
        if (carrinhoAtual.length === 0) {
            alert("Adicione produtos ao carrinho para finalizar a venda.");
            return;
        }
        if (!clienteAtual) {
            // Permitir venda sem cliente selecionado? Se sim, ajustar backend
            // Por ora, mantemos a exigência:
            alert("Selecione um cliente para finalizar a venda.");
            return;
            // Ou, para permitir venda sem cliente:
            // clienteAtual = { id: null }; // Envia ID nulo ou um ID padrão de 'Consumidor Final'
        }
        const formaPagamentoElement = document.querySelector('input[name="pagamento"]:checked');
        if (!formaPagamentoElement) {
            alert("Selecione uma forma de pagamento.");
            return;
        }

        // AJUSTE: Definir um usuario_id fixo ou nulo, já que não há login
        const usuario_id_fixo = 1; // Exemplo: Usar ID 1 como padrão

        const venda = {
            cliente_id: clienteAtual.id,
            usuario_id: usuario_id_fixo, // <<<<<<< AJUSTE AQUI
            itens: carrinhoAtual.map(item => ({
                medicamento_id: item.id,
                quantidade: item.quantidade,
                preco_unitario: item.preco // Backend espera 'precoUnitario'? Verificar backend/routes/vendas.js
            })),
            // O backend parece calcular o valor total e não usa outros campos no POST
        };

        console.log("Dados da Venda para Enviar:", venda);

        try {
            const response = await fetch(`${API_BASE_URL}/vendas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Não precisa de Authorization header
                },
                body: JSON.stringify(venda)
            });

            const responseData = await response.json(); // Tenta ler o JSON mesmo em erro

            if (!response.ok) {
                console.error("Erro na resposta do backend:", response.status, responseData);
                // Tenta dar uma mensagem mais útil baseado no erro comum de estoque
                if (response.status === 409 && responseData.erro?.includes("estoque")) {
                    throw new Error(responseData.erro || "Erro ao atualizar estoque (quantidade insuficiente).");
                } else {
                    throw new Error(responseData.erro || `Erro ${response.status} ao registrar venda.`);
                }
            }

            console.log('Venda registrada com sucesso:', responseData);
            alert('Venda finalizada com sucesso!');

            // Atualizar estoque local simulado (IMPORTANTE: o backend já faz isso!)
            // Apenas para manter a UI consistente *antes* de recarregar dados
            venda.itens.forEach(itemVendido => {
                const indexProduto = produtosSimulados.findIndex(p => p.id === itemVendido.medicamento_id);
                if (indexProduto !== -1) {
                    produtosSimulados[indexProduto].estoque -= itemVendido.quantidade;
                }
            });

            limparVenda();
            // Idealmente, buscaria os produtos novamente do backend para ter estoque atualizado
            // buscarProdutos(); // Ou renderizar a lista atualizada:
            renderizarResultadosBusca(produtosSimulados);

        } catch (error) {
            console.error("Erro ao finalizar venda:", error);
            alert(`Erro ao finalizar venda: ${error.message}`);
            // Não limpar a venda em caso de erro para o usuário poder tentar corrigir
        }
    }

    function limparVenda() {
        console.log("Limpando dados da venda atual...");
        carrinhoAtual = [];
        clienteAtual = null;
        descontoAtual = 0;
        if(descontoInput) descontoInput.value = 0;
        if(produtoSearch) produtoSearch.value = '';
        if(clienteSearch) clienteSearch.value = '';
        // if(resultadosBusca) resultadosBusca.innerHTML = ''; // Não limpar para mostrar estoque atualizado
        if(clienteSelecionado) {
             clienteSelecionado.style.display = 'none';
             clienteSelecionado.innerHTML = '';
        }
        const obsElement = document.getElementById('observacoes');
        if(obsElement) obsElement.value = '';
        const formaPagamentoDefault = document.querySelector('input[name="pagamento"][value="cartao_credito"]');
        if (formaPagamentoDefault) formaPagamentoDefault.checked = true;
        atualizarCarrinho(); // Limpa a tabela e atualiza o resumo
        // renderizarResultadosBusca(produtosSimulados); // Recarrega produtos após limpar
        console.log("Limpeza concluída.");
    }

    function cancelarVenda() {
        if (confirm("Tem certeza que deseja cancelar a venda atual? Os itens do carrinho serão perdidos.")) {
            console.log("Cancelando venda...");
            limparVenda();
            renderizarResultadosBusca(produtosSimulados); // Mostra produtos novamente
        }
    }

    // Adicionar listeners aos botões de finalizar/cancelar
    if (finalizarVendaButton) finalizarVendaButton.addEventListener('click', finalizarVenda);
    if (finalizarVendaButtonBottom) finalizarVendaButtonBottom.addEventListener('click', finalizarVenda);
    if (cancelarVendaButton) cancelarVendaButton.addEventListener('click', cancelarVenda);
    if (cancelarVendaButtonBottom) cancelarVendaButtonBottom.addEventListener('click', cancelarVenda);

    // --- Lógica Adicional (Logout, etc.) ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout solicitado.");
            // localStorage.removeItem('token'); // Não há token
            // localStorage.removeItem('usuario');
            alert("Logout realizado!");
            window.location.href = 'index.html'; // Redireciona para a página de login
        });
    }

    // Inicialização
    console.log("Inicializando carrinho e resumo...");
    atualizarCarrinho(); // Garante que o resumo seja calculado inicialmente
});

