document.addEventListener("DOMContentLoaded", () => {
    // Definição da URL base da API
    const API_BASE_URL = "http://localhost:3000/api";
    
    // Elementos do DOM
    const fornecedoresContainer = document.getElementById("fornecedores-container");
    const searchInput = document.getElementById("search-input");
    const addFornecedorButton = document.getElementById("add-fornecedor-button");
    const fornecedorModal = document.getElementById("fornecedor-modal");
    const fornecedorForm = document.getElementById("fornecedor-form");
    const cancelButton = document.getElementById("cancel-button");
    const modalErrorMessage = document.getElementById("modal-error-message");
    const logoutButton = document.getElementById("logout-button");
    
    // Verificar autenticação
function verificarAutenticacao() {
    return true; // autenticação desativada
}
    
    // Carregar fornecedores do backend
    async function carregarFornecedores() {
        if (!verificarAutenticacao()) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/fornecedores`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            if (response.ok) {
                const fornecedores = await response.json();
                renderizarFornecedores(fornecedores);
            } else {
                console.error("Erro ao carregar fornecedores:", response.status);
                // Mostrar mensagem de erro
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            // Mostrar mensagem de erro
        }
    }
    
    // Renderizar fornecedores na interface
    function renderizarFornecedores(fornecedores) {
        // Limpar o container
        fornecedoresContainer.innerHTML = "";
        
        if (fornecedores && fornecedores.length === 0) {
            fornecedoresContainer.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">Nenhum fornecedor encontrado.</p>
                </div>
            `;
            return;
        }
        
        // Para fins de demonstração, usaremos dados de exemplo
        // Quando a API estiver pronta, use os dados reais de 'fornecedores'
        const fornecedoresExemplo = [
            {
                id: 1,
                nome: "Pharma Distribuidora",
                cnpj: "12.345.678/0001-90",
                email: "contato@pharmadistribuidora.com",
                telefone: "(11) 3456-7890",
                endereco: "Av. Industrial, 1000 - São Paulo/SP",
                categorias: ["Medicamentos", "Cosméticos", "Vitaminas"],
                ultima_compra: "2025-05-15"
            },
            {
                id: 2,
                nome: "MediTech Equipamentos",
                cnpj: "98.765.432/0001-10",
                email: "vendas@meditech.com.br",
                telefone: "(11) 2345-6789",
                endereco: "Rua Tecnológica, 500 - Campinas/SP",
                categorias: ["Equipamentos", "Instrumentos", "Tecnologia"],
                ultima_compra: "2025-04-02"
            },
            {
                id: 3,
                nome: "NaturaPharma",
                cnpj: "45.678.901/0001-23",
                email: "comercial@naturapharma.com.br",
                telefone: "(11) 4567-8901",
                endereco: "Estrada Rural, 789 - Ribeirão Preto/SP",
                categorias: ["Fitoterápicos", "Naturais", "Orgânicos"],
                ultima_compra: "2025-05-20"
            }
        ];
        
        // Renderizar cada fornecedor
        fornecedoresExemplo.forEach(fornecedor => {
            const card = criarCardFornecedor(fornecedor);
            fornecedoresContainer.appendChild(card);
        });
    }
    
    // Criar card de fornecedor
    function criarCardFornecedor(fornecedor) {
        const div = document.createElement("div");
        div.className = "bg-white rounded-lg shadow-md overflow-hidden fornecedor-card transition-all duration-300";
        
        // Determinar o emoji com base no tipo de fornecedor
        let emoji = "🏢"; // Padrão
        if (fornecedor.categorias.includes("Equipamentos")) {
            emoji = "🔬";
        } else if (fornecedor.categorias.includes("Fitoterápicos") || fornecedor.categorias.includes("Naturais")) {
            emoji = "🌿";
        }
        
        div.innerHTML = `
            <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${fornecedor.nome}</h3>
                        <p class="text-gray-600 mt-1">CNPJ: ${fornecedor.cnpj}</p>
                    </div>
                    <div class="text-3xl">${emoji}</div>
                </div>
            </div>
            <div class="p-5">
                <div class="mb-4">
                    <p class="flex items-center text-gray-700 mb-2">
                        <svg class="h-5 w-5 mr-2 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        ${fornecedor.email}
                    </p>
                    <p class="flex items-center text-gray-700 mb-2">
                        <svg class="h-5 w-5 mr-2 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        ${fornecedor.telefone}
                    </p>
                    <p class="flex items-center text-gray-700">
                        <svg class="h-5 w-5 mr-2 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        ${fornecedor.endereco}
                    </p>
                </div>
                <div class="mt-4">
                    <h4 class="font-medium text-gray-700 mb-2">Produtos Fornecidos:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${fornecedor.categorias.map(categoria => {
                            // Definir cores com base na categoria
                            let bgColor = "bg-blue-100";
                            let textColor = "text-blue-800";
                            
                            if (categoria === "Equipamentos" || categoria === "Instrumentos" || categoria === "Tecnologia") {
                                bgColor = "bg-yellow-100";
                                textColor = "text-yellow-800";
                            } else if (categoria === "Fitoterápicos" || categoria === "Naturais" || categoria === "Orgânicos") {
                                bgColor = "bg-green-100";
                                textColor = "text-green-800";
                            } else if (categoria === "Cosméticos") {
                                bgColor = "bg-purple-100";
                                textColor = "text-purple-800";
                            }
                            
                            return `<span class="${bgColor} ${textColor} text-xs px-2 py-1 rounded-full">${categoria}</span>`;
                        }).join('')}
                    </div>
                </div>
                <div class="flex justify-between items-center mt-4">
                    <div>
                        <span class="text-sm text-gray-500">Última compra: ${formatarData(fornecedor.ultima_compra)}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" 
                                onclick="editarFornecedor(${fornecedor.id})">
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                                onclick="excluirFornecedor(${fornecedor.id})">
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
    
    // Função para editar fornecedor
    window.editarFornecedor = function(id) {
        // Buscar dados do fornecedor e preencher o formulário
        const fornecedor = buscarFornecedorPorId(id);
        if (fornecedor) {
            document.getElementById("fornecedor-id").value = fornecedor.id;
            document.getElementById("nome").value = fornecedor.nome;
            document.getElementById("cnpj").value = fornecedor.cnpj;
            document.getElementById("email").value = fornecedor.email;
            document.getElementById("telefone").value = fornecedor.telefone;
            document.getElementById("endereco").value = fornecedor.endereco;
            
            // Marcar as categorias
            const checkboxes = document.querySelectorAll('input[name="categoria"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = fornecedor.categorias.includes(checkbox.value);
            });
            
            document.getElementById("modal-title").textContent = "Editar Fornecedor";
            fornecedorModal.style.display = "flex";
        }
    };
    
    // Função para excluir fornecedor
    window.excluirFornecedor = function(id) {
        if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
            // Implementar lógica de exclusão
            console.log("Excluindo fornecedor:", id);
            // Após excluir, recarregar a lista
            carregarFornecedores();
        }
    };
    
    // Função auxiliar para buscar fornecedor por ID (simulada)
    function buscarFornecedorPorId(id) {
        // Simulação - em produção, buscar do backend
        const fornecedoresExemplo = [
            {
                id: 1,
                nome: "Pharma Distribuidora",
                cnpj: "12.345.678/0001-90",
                email: "contato@pharmadistribuidora.com",
                telefone: "(11) 3456-7890",
                endereco: "Av. Industrial, 1000 - São Paulo/SP",
                categorias: ["Medicamentos", "Cosméticos", "Vitaminas"],
                ultima_compra: "2025-05-15"
            },
            {
                id: 2,
                nome: "MediTech Equipamentos",
                cnpj: "98.765.432/0001-10",
                email: "vendas@meditech.com.br",
                telefone: "(11) 2345-6789",
                endereco: "Rua Tecnológica, 500 - Campinas/SP",
                categorias: ["Equipamentos", "Instrumentos", "Tecnologia"],
                ultima_compra: "2025-04-02"
            },
            {
                id: 3,
                nome: "NaturaPharma",
                cnpj: "45.678.901/0001-23",
                email: "comercial@naturapharma.com.br",
                telefone: "(11) 4567-8901",
                endereco: "Estrada Rural, 789 - Ribeirão Preto/SP",
                categorias: ["Fitoterápicos", "Naturais", "Orgânicos"],
                ultima_compra: "2025-05-20"
            }
        ];
        return fornecedoresExemplo.find(fornecedor => fornecedor.id === id);
    }
    
    // Abrir modal para adicionar fornecedor
    addFornecedorButton.addEventListener("click", () => {
        // Limpar formulário
        fornecedorForm.reset();
        document.getElementById("fornecedor-id").value = "";
        document.getElementById("modal-title").textContent = "Adicionar Fornecedor";
        
        // Mostrar modal
        fornecedorModal.style.display = "flex";
    });
    
    // Fechar modal
    cancelButton.addEventListener("click", () => {
        fornecedorModal.style.display = "none";
    });
    
    // Submeter formulário
    fornecedorForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        // Obter dados do formulário
        const fornecedorId = document.getElementById("fornecedor-id").value;
        const nome = document.getElementById("nome").value;
        const cnpj = document.getElementById("cnpj").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;
        
        // Obter categorias selecionadas
        const categorias = [];
        document.querySelectorAll('input[name="categoria"]:checked').forEach(checkbox => {
            categorias.push(checkbox.value);
        });
        
        const fornecedorData = {
            nome,
            cnpj,
            email,
            telefone,
            endereco,
            categorias
        };
        
        try {
            const token = localStorage.getItem('token');
            const url = fornecedorId 
                ? `${API_BASE_URL}/fornecedores/${fornecedorId}` 
                : `${API_BASE_URL}/fornecedores`;
            const method = fornecedorId ? "PUT" : "POST";
            
            // Simulação - em produção, enviar para o backend
            console.log(`${method} fornecedor:`, fornecedorData);
            
            // Fechar modal e recarregar lista
            fornecedorModal.style.display = "none";
            carregarFornecedores();
            
        } catch (error) {
            console.error("Erro ao salvar fornecedor:", error);
            modalErrorMessage.textContent = "Erro ao salvar fornecedor. Tente novamente.";
            modalErrorMessage.style.display = "block";
        }
    });
    
    // Pesquisar fornecedores
    searchInput.addEventListener("input", () => {
        const termo = searchInput.value.toLowerCase();
        // Implementar lógica de pesquisa
        // Por enquanto, apenas recarregar todos
        carregarFornecedores();
    });
    
    // Logout
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        window.location.href = "index.html";
    });
    
    // Inicialização
    verificarAutenticacao();
    carregarFornecedores();
});
