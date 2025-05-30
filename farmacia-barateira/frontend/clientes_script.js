document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Carregado. Iniciando script clientes...");
    // Definição da URL base da API
    const API_BASE_URL = "http://localhost:3000/api";

    // Elementos do DOM
    const clientesContainer = document.getElementById("clientes-container");
    const searchInput = document.getElementById("search-input");
    const addClienteButton = document.getElementById("add-cliente-button");
    const clienteModal = document.getElementById("cliente-modal"); // Assumindo que o modal existe no HTML
    const clienteForm = document.getElementById("cliente-form"); // Assumindo que o form existe no modal
    const cancelButton = document.getElementById("cancel-button"); // Assumindo que o botão cancelar existe
    const modalErrorMessage = document.getElementById("modal-error-message"); // Assumindo que existe
    const modalTitle = document.getElementById("modal-title"); // Assumindo que existe
    const clienteIdInput = document.getElementById("cliente-id"); // Assumindo input hidden para ID
    const logoutButton = document.getElementById("logout-button");

    // Dados simulados (substituir por fetch real)
    let clientesExemplo = [
        {
            id: 1,
            nome: "Maria Silva",
            cpf: "123.456.789-00",
            email: "maria.silva@email.com",
            telefone: "(11) 98765-4321",
            endereco: "Rua das Flores, 123",
            status: 1,
            data_cadastro: "2023-01-10"
        },
        {
            id: 2,
            nome: "João Santos",
            cpf: "987.654.321-00",
            email: "joao.santos@email.com",
            telefone: "(11) 91234-5678",
            endereco: "Av. Principal, 456",
            status: 1,
            data_cadastro: "2023-03-15"
        },
        {
            id: 3,
            nome: "Ana Oliveira",
            cpf: "456.789.123-00",
            email: "ana.oliveira@email.com",
            telefone: "(11) 95555-9999",
            endereco: "Rua Secundária, 789",
            status: 0,
            data_cadastro: "2023-06-22"
        }
    ];

    // --- Funções Auxiliares ---
    function formatarData(dataString) {
        if (!dataString) return "N/A";
        try {
            const data = new Date(dataString);
            // Adiciona verificação se a data é válida
            if (isNaN(data.getTime())) return "Data inválida";
            return data.toLocaleDateString("pt-BR", { timeZone: "UTC" }); // Adiciona timezone para consistência
        } catch (e) {
            return "Data inválida";
        }
    }

    // --- Lógica Principal ---

    // Carregar clientes (simulado)
    async function carregarClientes(filtro = "") {
        console.log(`Carregando clientes com filtro: "${filtro}"`);
        // Simulação de fetch
        try {
            // No futuro, usar fetch(`${API_BASE_URL}/clientes?q=${filtro}`)
            const clientesFiltrados = clientesExemplo.filter(cliente =>
                cliente.nome.toLowerCase().includes(filtro.toLowerCase()) ||
                cliente.cpf.includes(filtro)
            );
            renderizarClientes(clientesFiltrados);
        } catch (error) {
            console.error("Erro ao carregar clientes (simulado):", error);
            if (clientesContainer) clientesContainer.innerHTML = 
                `<div class="col-span-full text-center py-8 text-red-500">Erro ao carregar clientes.</div>`;
        }
    }

    // Renderizar clientes na interface
    function renderizarClientes(clientes) {
        if (!clientesContainer) return;
        clientesContainer.innerHTML = ""; // Limpar container

        if (!Array.isArray(clientes) || clientes.length === 0) {
            clientesContainer.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">Nenhum cliente encontrado.</p>
                </div>
            `;
            return;
        }

        clientes.forEach(cliente => {
            const card = criarCardCliente(cliente);
            clientesContainer.appendChild(card);
        });
        console.log(`${clientes.length} clientes renderizados.`);
    }

    // Criar card de cliente HTML
    function criarCardCliente(cliente) {
        const div = document.createElement("div");
        div.className = "bg-white rounded-lg shadow-md overflow-hidden cliente-card transition-all duration-300";
        div.dataset.clienteId = cliente.id; // Adiciona ID para referência

        const statusClass = cliente.status ? "text-green-500 bg-green-100" : "text-gray-500 bg-gray-100";
        const statusText = cliente.status ? "Ativo" : "Inativo";
        const emoji = cliente.status ? "👩" : "👤"; // Exemplo simples

        div.innerHTML = `
            <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800 flex items-center">
                            <span class="mr-2">${cliente.nome}</span>
                            <span class="${statusClass} text-sm px-2 py-1 rounded-full">${statusText}</span>
                        </h3>
                        <p class="text-gray-600 mt-1">CPF: ${cliente.cpf || "N/A"}</p>
                    </div>
                    <div class="text-3xl">${emoji}</div>
                </div>
            </div>
            <div class="p-5">
                <div class="mb-4 space-y-2">
                    <p class="flex items-center text-gray-700">
                        <svg class="h-5 w-5 mr-2 text-cyan-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <span class="truncate">${cliente.email || "N/A"}</span>
                    </p>
                    <p class="flex items-center text-gray-700">
                        <svg class="h-5 w-5 mr-2 text-cyan-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <span class="truncate">${cliente.telefone || "N/A"}</span>
                    </p>
                    <p class="flex items-start text-gray-700">
                        <svg class="h-5 w-5 mr-2 text-cyan-600 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>${cliente.endereco || "N/A"}</span>
                    </p>
                </div>
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div>
                        <span class="text-sm text-gray-500">Cliente desde: ${formatarData(cliente.data_cadastro)}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button data-action="editar" data-id="${cliente.id}" class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" title="Editar Cliente">
                            <svg class="h-5 w-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button data-action="excluir" data-id="${cliente.id}" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors" title="Excluir Cliente">
                            <svg class="h-5 w-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return div;
    }

    // --- Funções de Ação (Editar/Excluir/Adicionar) ---

    function abrirModalEdicao(id) {
        console.log("Abrindo modal para editar cliente ID:", id);
        // Simulação: Buscar dados do cliente (em produção, seria um fetch)
        const cliente = clientesExemplo.find(c => c.id === id);
        if (!cliente) {
            alert("Cliente não encontrado!");
            return;
        }

        // Preencher formulário
        if (clienteForm && clienteModal && modalTitle && clienteIdInput) {
            clienteForm.reset(); // Limpa o form
            clienteIdInput.value = cliente.id;
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("cpf").value = cliente.cpf;
            document.getElementById("email").value = cliente.email;
            document.getElementById("telefone").value = cliente.telefone;
            document.getElementById("endereco").value = cliente.endereco;
            document.getElementById("status").value = cliente.status;
            // O campo data_cadastro geralmente não é editável, mas se for:
            // document.getElementById("data_cadastro").value = cliente.data_cadastro.split('T')[0];

            modalTitle.textContent = "Editar Cliente";
            if (modalErrorMessage) modalErrorMessage.style.display = "none";
            clienteModal.style.display = "flex";
        } else {
            console.error("Elementos do modal não encontrados!");
        }
    }

    function abrirModalAdicao() {
        console.log("Abrindo modal para adicionar novo cliente.");
        if (clienteForm && clienteModal && modalTitle && clienteIdInput) {
            clienteForm.reset();
            clienteIdInput.value = ""; // Garante que ID está vazio para adição
            modalTitle.textContent = "Adicionar Cliente";

            // Opcional: Definir data atual no campo de data
            // const hoje = new Date().toISOString().split('T')[0];
            // document.getElementById("data_cadastro").value = hoje;

            if (modalErrorMessage) modalErrorMessage.style.display = "none";
            clienteModal.style.display = "flex";
        } else {
            console.error("Elementos do modal não encontrados!");
        }
    }

    function fecharModal() {
        if (clienteModal) {
            clienteModal.style.display = "none";
            console.log("Modal fechado.");
        }
    }

    async function salvarCliente(event) {
        event.preventDefault(); // Impede recarregamento da página
        console.log("Tentando salvar cliente...");

        // Obter dados do formulário
        const clienteId = clienteIdInput ? clienteIdInput.value : "";
        const nome = document.getElementById("nome")?.value;
        const cpf = document.getElementById("cpf")?.value;
        const email = document.getElementById("email")?.value;
        const telefone = document.getElementById("telefone")?.value;
        const endereco = document.getElementById("endereco")?.value;
        const status = document.getElementById("status")?.value;
        // const data_cadastro = document.getElementById("data_cadastro")?.value;

        const clienteData = {
            nome,
            cpf,
            email,
            telefone,
            endereco,
            status: parseInt(status) // Garante que status seja número
            // data_cadastro // Backend geralmente define isso
        };

        console.log("Dados do cliente para salvar:", clienteData);
        const isEdicao = !!clienteId;

        try {
            // Simulação de POST/PUT
            console.log(`Simulando ${isEdicao ? 'PUT' : 'POST'} para /api/clientes${isEdicao ? '/' + clienteId : ''}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da rede

            if (isEdicao) {
                // Atualizar na lista simulada
                const index = clientesExemplo.findIndex(c => c.id === parseInt(clienteId));
                if (index !== -1) {
                    clientesExemplo[index] = { ...clientesExemplo[index], ...clienteData };
                }
            } else {
                // Adicionar na lista simulada
                const novoId = clientesExemplo.length > 0 ? Math.max(...clientesExemplo.map(c => c.id)) + 1 : 1;
                clientesExemplo.push({ id: novoId, ...clienteData, data_cadastro: new Date().toISOString() });
            }

            console.log("Cliente salvo com sucesso (simulado).");
            fecharModal();
            carregarClientes(searchInput ? searchInput.value : ""); // Recarrega a lista com filtro atual

        } catch (error) {
            console.error("Erro ao salvar cliente (simulado):", error);
            if (modalErrorMessage) {
                modalErrorMessage.textContent = "Erro ao salvar cliente. Tente novamente.";
                modalErrorMessage.style.display = "block";
            }
        }
    }

    async function excluirCliente(id) {
        console.log("Tentando excluir cliente ID:", id);
        if (confirm("Tem certeza que deseja excluir este cliente?")) {
            try {
                // Simulação de DELETE
                console.log(`Simulando DELETE para /api/clientes/${id}`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay

                // Remover da lista simulada
                clientesExemplo = clientesExemplo.filter(c => c.id !== id);

                console.log("Cliente excluído com sucesso (simulado).");
                carregarClientes(searchInput ? searchInput.value : ""); // Recarrega a lista
            } catch (error) {
                console.error("Erro ao excluir cliente (simulado):", error);
                alert("Erro ao excluir cliente. Tente novamente.");
            }
        }
    }

    // --- Event Listeners ---

    // Pesquisa
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            carregarClientes(searchInput.value);
        });
    }

    // Botão Adicionar Cliente
    if (addClienteButton) {
        addClienteButton.addEventListener("click", abrirModalAdicao);
    }

    // Botão Cancelar no Modal
    if (cancelButton) {
        cancelButton.addEventListener("click", fecharModal);
    }

    // Submissão do Formulário do Modal
    if (clienteForm) {
        clienteForm.addEventListener("submit", salvarCliente);
    }

    // Delegação de Eventos para botões Editar/Excluir nos Cards
    if (clientesContainer) {
        clientesContainer.addEventListener("click", (event) => {
            const target = event.target.closest("button[data-action]"); // Busca o botão mais próximo com data-action
            if (!target) return; // Sai se não clicou em um botão com data-action

            const action = target.dataset.action;
            const id = parseInt(target.dataset.id);

            console.log(`Ação detectada: ${action}, ID: ${id}`);

            if (action === "editar") {
                abrirModalEdicao(id);
            } else if (action === "excluir") {
                excluirCliente(id);
            }
        });
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            console.log("Logout solicitado.");
            // localStorage.removeItem('token'); // Remover se usar token real
            // localStorage.removeItem('usuarioLogado');
            alert("Logout realizado!");
            window.location.href = "index.html";
        });
    }

    // --- Inicialização ---
    console.log("Inicializando página de clientes...");
    carregarClientes(); // Carrega clientes iniciais

});

