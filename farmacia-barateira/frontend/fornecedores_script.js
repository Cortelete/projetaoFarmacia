document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Carregado. Iniciando script fornecedores...");
    // Definição da URL base da API
    const API_BASE_URL = "http://localhost:3000/api";

    // Elementos do DOM
    const fornecedoresContainer = document.getElementById("fornecedores-container");
    const searchInput = document.getElementById("search-input");
    const addFornecedorButton = document.getElementById("add-fornecedor-button");
    const fornecedorModal = document.getElementById("fornecedor-modal"); // Assumindo que existe no HTML
    const fornecedorForm = document.getElementById("fornecedor-form"); // Assumindo que existe no modal
    const cancelButton = document.getElementById("cancel-button"); // Assumindo que existe
    const modalErrorMessage = document.getElementById("modal-error-message"); // Assumindo que existe
    const modalTitle = document.getElementById("modal-title"); // Assumindo que existe
    const fornecedorIdInput = document.getElementById("fornecedor-id"); // Assumindo input hidden para ID
    const logoutButton = document.getElementById("logout-button");

    // Dados simulados (substituir por fetch real)
    let fornecedoresExemplo = [
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

    // --- Funções Auxiliares ---
    function formatarData(dataString) {
        if (!dataString) return "N/A";
        try {
            const data = new Date(dataString);
            if (isNaN(data.getTime())) return "Data inválida";
            return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
        } catch (e) {
            return "Data inválida";
        }
    }

    // --- Lógica Principal ---

    // Carregar fornecedores (simulado)
    async function carregarFornecedores(filtro = "") {
        console.log(`Carregando fornecedores com filtro: "${filtro}"`);
        try {
            // Simulação de fetch
            const fornecedoresFiltrados = fornecedoresExemplo.filter(fornecedor =>
                fornecedor.nome.toLowerCase().includes(filtro.toLowerCase()) ||
                fornecedor.cnpj.includes(filtro)
            );
            renderizarFornecedores(fornecedoresFiltrados);
        } catch (error) {
            console.error("Erro ao carregar fornecedores (simulado):", error);
            if (fornecedoresContainer) fornecedoresContainer.innerHTML =
                `<div class="col-span-full text-center py-8 text-red-500">Erro ao carregar fornecedores.</div>`;
        }
    }

    // Renderizar fornecedores na interface
    function renderizarFornecedores(fornecedores) {
        if (!fornecedoresContainer) return;
        fornecedoresContainer.innerHTML = ""; // Limpar container

        if (!Array.isArray(fornecedores) || fornecedores.length === 0) {
            fornecedoresContainer.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">Nenhum fornecedor encontrado.</p>
                </div>
            `;
            return;
        }

        fornecedores.forEach(fornecedor => {
            const card = criarCardFornecedor(fornecedor);
            fornecedoresContainer.appendChild(card);
        });
        console.log(`${fornecedores.length} fornecedores renderizados.`);
    }

    // Criar card de fornecedor HTML
    function criarCardFornecedor(fornecedor) {
        const div = document.createElement("div");
        div.className = "bg-white rounded-lg shadow-md overflow-hidden fornecedor-card transition-all duration-300";
        div.dataset.fornecedorId = fornecedor.id;

        let emoji = "🏢";
        if (fornecedor.categorias.includes("Equipamentos")) emoji = "🔬";
        else if (fornecedor.categorias.includes("Fitoterápicos") || fornecedor.categorias.includes("Naturais")) emoji = "🌿";

        const categoriasHTML = fornecedor.categorias.map(categoria => {
            let bgColor = "bg-blue-100";
            let textColor = "text-blue-800";
            if (["Equipamentos", "Instrumentos", "Tecnologia"].includes(categoria)) { bgColor = "bg-yellow-100"; textColor = "text-yellow-800"; }
            else if (["Fitoterápicos", "Naturais", "Orgânicos"].includes(categoria)) { bgColor = "bg-green-100"; textColor = "text-green-800"; }
            else if (categoria === "Cosméticos") { bgColor = "bg-purple-100"; textColor = "text-purple-800"; }
            return `<span class="${bgColor} ${textColor} text-xs px-2 py-1 rounded-full">${categoria}</span>`;
        }).join("");

        div.innerHTML = `
            <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${fornecedor.nome}</h3>
                        <p class="text-gray-600 mt-1">CNPJ: ${fornecedor.cnpj || "N/A"}</p>
                    </div>
                    <div class="text-3xl">${emoji}</div>
                </div>
            </div>
            <div class="p-5">
                <div class="mb-4 space-y-2">
                    <p class="flex items-center text-gray-700">
                        <svg class="h-5 w-5 mr-2 text-cyan-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <span class="truncate">${fornecedor.email || "N/A"}</span>
                    </p>
                    <p class="flex items-center text-gray-700">
                        <svg class="h-5 w-5 mr-2 text-cyan-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <span class="truncate">${fornecedor.telefone || "N/A"}</span>
                    </p>
                    <p class="flex items-start text-gray-700">
                        <svg class="h-5 w-5 mr-2 text-cyan-600 flex-shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>${fornecedor.endereco || "N/A"}</span>
                    </p>
                </div>
                <div class="mt-4">
                    <h4 class="font-medium text-gray-700 mb-2">Produtos Fornecidos:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${categoriasHTML}
                    </div>
                </div>
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div>
                        <span class="text-sm text-gray-500">Última compra: ${formatarData(fornecedor.ultima_compra)}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button data-action="editar" data-id="${fornecedor.id}" class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" title="Editar Fornecedor">
                            <svg class="h-5 w-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button data-action="excluir" data-id="${fornecedor.id}" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors" title="Excluir Fornecedor">
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
        console.log("Abrindo modal para editar fornecedor ID:", id);
        const fornecedor = fornecedoresExemplo.find(f => f.id === id);
        if (!fornecedor) {
            alert("Fornecedor não encontrado!");
            return;
        }

        if (fornecedorForm && fornecedorModal && modalTitle && fornecedorIdInput) {
            fornecedorForm.reset();
            fornecedorIdInput.value = fornecedor.id;
            document.getElementById("nome").value = fornecedor.nome;
            document.getElementById("cnpj").value = fornecedor.cnpj;
            document.getElementById("email").value = fornecedor.email;
            document.getElementById("telefone").value = fornecedor.telefone;
            document.getElementById("endereco").value = fornecedor.endereco;

            // Marcar as categorias
            const checkboxes = document.querySelectorAll("input[name=\"categoria\"]");
            checkboxes.forEach(checkbox => {
                checkbox.checked = fornecedor.categorias.includes(checkbox.value);
            });

            modalTitle.textContent = "Editar Fornecedor";
            if (modalErrorMessage) modalErrorMessage.style.display = "none";
            fornecedorModal.style.display = "flex";
        } else {
            console.error("Elementos do modal não encontrados!");
        }
    }

    function abrirModalAdicao() {
        console.log("Abrindo modal para adicionar novo fornecedor.");
        if (fornecedorForm && fornecedorModal && modalTitle && fornecedorIdInput) {
            fornecedorForm.reset();
            fornecedorIdInput.value = "";
            modalTitle.textContent = "Adicionar Fornecedor";
            if (modalErrorMessage) modalErrorMessage.style.display = "none";
            fornecedorModal.style.display = "flex";
        } else {
            console.error("Elementos do modal não encontrados!");
        }
    }

    function fecharModal() {
        if (fornecedorModal) {
            fornecedorModal.style.display = "none";
            console.log("Modal fechado.");
        }
    }

    async function salvarFornecedor(event) {
        event.preventDefault();
        console.log("Tentando salvar fornecedor...");

        const fornecedorId = fornecedorIdInput ? fornecedorIdInput.value : "";
        const nome = document.getElementById("nome")?.value;
        const cnpj = document.getElementById("cnpj")?.value;
        const email = document.getElementById("email")?.value;
        const telefone = document.getElementById("telefone")?.value;
        const endereco = document.getElementById("endereco")?.value;

        const categorias = [];
        document.querySelectorAll("input[name=\"categoria\"]:checked").forEach(checkbox => {
            categorias.push(checkbox.value);
        });

        const fornecedorData = { nome, cnpj, email, telefone, endereco, categorias };
        console.log("Dados do fornecedor para salvar:", fornecedorData);
        const isEdicao = !!fornecedorId;

        try {
            // Simulação de POST/PUT
            console.log(`Simulando ${isEdicao ? "PUT" : "POST"} para /api/fornecedores${isEdicao ? "/" + fornecedorId : ""}`);
            await new Promise(resolve => setTimeout(resolve, 500));

            if (isEdicao) {
                const index = fornecedoresExemplo.findIndex(f => f.id === parseInt(fornecedorId));
                if (index !== -1) {
                    fornecedoresExemplo[index] = { ...fornecedoresExemplo[index], ...fornecedorData };
                }
            } else {
                const novoId = fornecedoresExemplo.length > 0 ? Math.max(...fornecedoresExemplo.map(f => f.id)) + 1 : 1;
                fornecedoresExemplo.push({ id: novoId, ...fornecedorData, ultima_compra: null }); // Adiciona com ultima_compra nula
            }

            console.log("Fornecedor salvo com sucesso (simulado).");
            fecharModal();
            carregarFornecedores(searchInput ? searchInput.value : "");

        } catch (error) {
            console.error("Erro ao salvar fornecedor (simulado):", error);
            if (modalErrorMessage) {
                modalErrorMessage.textContent = "Erro ao salvar fornecedor. Tente novamente.";
                modalErrorMessage.style.display = "block";
            }
        }
    }

    async function excluirFornecedor(id) {
        console.log("Tentando excluir fornecedor ID:", id);
        const fornecedor = fornecedoresExemplo.find(f => f.id === id);
        if (confirm(`Tem certeza que deseja excluir o fornecedor "${fornecedor?.nome || id}"?`)) {
            try {
                // Simulação de DELETE
                console.log(`Simulando DELETE para /api/fornecedores/${id}`);
                await new Promise(resolve => setTimeout(resolve, 500));

                fornecedoresExemplo = fornecedoresExemplo.filter(f => f.id !== id);

                console.log("Fornecedor excluído com sucesso (simulado).");
                carregarFornecedores(searchInput ? searchInput.value : "");
            } catch (error) {
                console.error("Erro ao excluir fornecedor (simulado):", error);
                alert("Erro ao excluir fornecedor. Tente novamente.");
            }
        }
    }

    // --- Event Listeners ---

    // Pesquisa
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            carregarFornecedores(searchInput.value);
        });
    }

    // Botão Adicionar Fornecedor
    if (addFornecedorButton) {
        addFornecedorButton.addEventListener("click", abrirModalAdicao);
    }

    // Botão Cancelar no Modal
    if (cancelButton) {
        cancelButton.addEventListener("click", fecharModal);
    }

    // Submissão do Formulário do Modal
    if (fornecedorForm) {
        fornecedorForm.addEventListener("submit", salvarFornecedor);
    }

    // Delegação de Eventos para botões Editar/Excluir nos Cards
    if (fornecedoresContainer) {
        fornecedoresContainer.addEventListener("click", (event) => {
            const target = event.target.closest("button[data-action]");
            if (!target) return;

            const action = target.dataset.action;
            const id = parseInt(target.dataset.id);

            console.log(`Ação detectada: ${action}, ID: ${id}`);

            if (action === "editar") {
                abrirModalEdicao(id);
            } else if (action === "excluir") {
                excluirFornecedor(id);
            }
        });
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            console.log("Logout solicitado.");
            alert("Logout realizado!");
            window.location.href = "index.html";
        });
    }

    // --- Inicialização ---
    console.log("Inicializando página de fornecedores...");
    carregarFornecedores(); // Carrega fornecedores iniciais

});

