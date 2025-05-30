document.addEventListener("DOMContentLoaded", () => {
    // Definição da URL base da API
    const API_BASE_URL = "http://localhost:3000/api";
    
    // Elementos do DOM
    const clientesContainer = document.getElementById("clientes-container");
    const searchInput = document.getElementById("search-input");
    const addClienteButton = document.getElementById("add-cliente-button");
    const clienteModal = document.getElementById("cliente-modal");
    const clienteForm = document.getElementById("cliente-form");
    const cancelButton = document.getElementById("cancel-button");
    const modalErrorMessage = document.getElementById("modal-error-message");
    const logoutButton = document.getElementById("logout-button");
    
    // Verificar autenticação
function verificarAutenticacao() {
    return true; // autenticação desativada
}
    
    // Carregar clientes do backend
    async function carregarClientes() {
        if (!verificarAutenticacao()) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/clientes`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            if (response.ok) {
                const clientes = await response.json();
                renderizarClientes(clientes);
            } else {
                console.error("Erro ao carregar clientes:", response.status);
                // Mostrar mensagem de erro
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            // Mostrar mensagem de erro
        }
    }
    
    // Renderizar clientes na interface
    function renderizarClientes(clientes) {
        // Limpar o container
        clientesContainer.innerHTML = "";
        
        if (clientes.length === 0) {
            clientesContainer.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">Nenhum cliente encontrado.</p>
                </div>
            `;
            return;
        }
        
        // Para fins de demonstração, usaremos dados de exemplo
        // Quando a API estiver pronta, use os dados reais de 'clientes'
        const clientesExemplo = [
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
        
        // Renderizar cada cliente
        clientesExemplo.forEach(cliente => {
            const card = criarCardCliente(cliente);
            clientesContainer.appendChild(card);
        });
    }
    
    // Criar card de cliente
    function criarCardCliente(cliente) {
        const div = document.createElement("div");
        div.className = "bg-white rounded-lg shadow-md overflow-hidden cliente-card transition-all duration-300";
        div.innerHTML = `
            <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800 flex items-center">
                            <span class="mr-2">${cliente.nome}</span>
                            <span class="${cliente.status ? 'text-green-500 bg-green-100' : 'text-gray-500 bg-gray-100'} text-sm px-2 py-1 rounded-full">
                                ${cliente.status ? 'Ativo' : 'Inativo'}
                            </span>
                        </h3>
                        <p class="text-gray-600 mt-1">CPF: ${cliente.cpf}</p>
                    </div>
                    <div class="text-3xl">${cliente.status ? '👩' : '👤'}</div>
                </div>
            </div>
            <div class="p-5">
                <div class="mb-4">
                    <p class="flex items-center text-gray-700 mb-2">
                        <svg class="h-5 w-5 mr-2 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        ${cliente.email}
                    </p>
                    <p class="flex items-center text-gray-700 mb-2">
                        <svg class="h-5 w-5 mr-2 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        ${cliente.telefone}
                    </p>
                    <p class="flex items-center text-gray-700">
                        <svg class="h-5 w-5 mr-2 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        ${cliente.endereco}
                    </p>
                </div>
                <div class="flex justify-between items-center mt-4">
                    <div>
                        <span class="text-sm text-gray-500">Cliente desde: ${formatarData(cliente.data_cadastro)}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" 
                                onclick="editarCliente(${cliente.id})">
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                                onclick="excluirCliente(${cliente.id})">
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return div;
    }
    
    // Formatar data para exibição
    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }
    
    // Função para editar cliente
    window.editarCliente = function(id) {
        // Buscar dados do cliente e preencher o formulário
        const cliente = buscarClientePorId(id);
        if (cliente) {
            document.getElementById("cliente-id").value = cliente.id;
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("cpf").value = cliente.cpf;
            document.getElementById("email").value = cliente.email;
            document.getElementById("telefone").value = cliente.telefone;
            document.getElementById("endereco").value = cliente.endereco;
            document.getElementById("status").value = cliente.status;
            document.getElementById("data_cadastro").value = cliente.data_cadastro;
            
            document.getElementById("modal-title").textContent = "Editar Cliente";
            clienteModal.style.display = "flex";
        }
    };
    
    // Função para excluir cliente
    window.excluirCliente = function(id) {
        if (confirm("Tem certeza que deseja excluir este cliente?")) {
            // Implementar lógica de exclusão
            console.log("Excluindo cliente:", id);
            // Após excluir, recarregar a lista
            carregarClientes();
        }
    };
    
    // Função auxiliar para buscar cliente por ID (simulada)
    function buscarClientePorId(id) {
        // Simulação - em produção, buscar do backend
        const clientesExemplo = [
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
        return clientesExemplo.find(cliente => cliente.id === id);
    }
    
    // Abrir modal para adicionar cliente
    addClienteButton.addEventListener("click", () => {
        // Limpar formulário
        clienteForm.reset();
        document.getElementById("cliente-id").value = "";
        document.getElementById("modal-title").textContent = "Adicionar Cliente";
        
        // Definir data atual no campo de data
        const hoje = new Date().toISOString().split('T')[0];
        document.getElementById("data_cadastro").value = hoje;
        
        // Mostrar modal
        clienteModal.style.display = "flex";
    });
    
    // Fechar modal
    cancelButton.addEventListener("click", () => {
        clienteModal.style.display = "none";
    });
    
    // Submeter formulário
    clienteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        // Obter dados do formulário
        const clienteId = document.getElementById("cliente-id").value;
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;
        const status = document.getElementById("status").value;
        const data_cadastro = document.getElementById("data_cadastro").value;
        
        const clienteData = {
            nome,
            cpf,
            email,
            telefone,
            endereco,
            status,
            data_cadastro
        };
        
        try {
            const token = localStorage.getItem('token');
            const url = clienteId 
                ? `${API_BASE_URL}/clientes/${clienteId}` 
                : `${API_BASE_URL}/clientes`;
            const method = clienteId ? "PUT" : "POST";
            
            // Simulação - em produção, enviar para o backend
            console.log(`${method} cliente:`, clienteData);
            
            // Fechar modal e recarregar lista
            clienteModal.style.display = "none";
            carregarClientes();
            
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
            modalErrorMessage.textContent = "Erro ao salvar cliente. Tente novamente.";
            modalErrorMessage.style.display = "block";
        }
    });
    
    // Pesquisar clientes
    searchInput.addEventListener("input", () => {
        const termo = searchInput.value.toLowerCase();
        // Implementar lógica de pesquisa
        // Por enquanto, apenas recarregar todos
        carregarClientes();
    });
    
    // Logout
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        window.location.href = "index.html";
    });
    
    // Inicialização
    verificarAutenticacao();
    carregarClientes();
});
