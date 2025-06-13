document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Carregado. Iniciando script fornecedores...");
    // Definição da URL base da API
    const API_BASE_URL = "http://localhost:3000/api";

    // Elementos do DOM
    const fornecedoresContainer = document.getElementById("fornecedores-container");
    const searchInput = document.getElementById("search-input");
    const addFornecedorButton = document.getElementById("add-fornecedor-button");
    const fornecedorModal = document.getElementById("fornecedor-modal");
    const fornecedorForm = document.getElementById("fornecedor-form");
    const cancelButton = document.getElementById("cancel-button");
    const saveButton = document.getElementById("save-button"); 
    const modalErrorMessage = document.getElementById("modal-error-message");
    const modalTitle = document.getElementById("modal-title");
    const fornecedorIdInput = document.getElementById("fornecedor-id");

    // Novos elementos para os botões de filtro
    const filterAllButton = document.querySelector('.flex-wrap > button:nth-child(1)'); // "Todos"
    const filterMedicamentosButton = document.querySelector('.flex-wrap > button:nth-child(2)'); // "Medicamentos"
    const filterEquipamentosButton = document.querySelector('.flex-wrap > button:nth-child(3)'); // "Equipamentos"


    let allFornecedores = []; // Armazenará os fornecedores reais da API

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

    // carregarFornecedores agora aceita um filtro de categoria e um termo de busca
    async function carregarFornecedores(filtroTermo = "", filtroCategoria = "Todos") {
        console.log(`Carregando fornecedores da API. Termo: "${filtroTermo}", Categoria: "${filtroCategoria}"`);
        try {
            const response = await fetch(`${API_BASE_URL}/fornecedores`);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            allFornecedores = await response.json(); // Armazena TODOS os fornecedores brutos
            
            let fornecedoresFiltrados = allFornecedores;

            // Aplica filtro por termo de busca (se houver)
            if (filtroTermo) {
                fornecedoresFiltrados = fornecedoresFiltrados.filter(fornecedor =>
                    (fornecedor.nome && fornecedor.nome.toLowerCase().includes(filtroTermo.toLowerCase())) ||
                    (fornecedor.nomeFantasia && fornecedor.nomeFantasia.toLowerCase().includes(filtroTermo.toLowerCase())) ||
                    (fornecedor.razaoSocial && fornecedor.razaoSocial.toLowerCase().includes(filtroTermo.toLowerCase())) ||
                    (fornecedor.cnpj && fornecedor.cnpj.includes(filtroTermo)) ||
                    (fornecedor.email && fornecedor.email.toLowerCase().includes(filtroTermo.toLowerCase())) ||
                    (fornecedor.telefone && fornecedor.telefone.includes(filtroTermo)) ||
                    (fornecedor.endereco && fornecedor.endereco.toLowerCase().includes(filtroTermo.toLowerCase())) ||
                    (fornecedor.categorias && JSON.parse(fornecedor.categorias).some(cat => cat.toLowerCase().includes(filtroTermo.toLowerCase())))
                );
            }

            // Aplica filtro por categoria (se não for "Todos")
            if (filtroCategoria !== "Todos") {
                fornecedoresFiltrados = fornecedoresFiltrados.filter(fornecedor => {
                    const categoriasArray = fornecedor.categorias ? JSON.parse(fornecedor.categorias) : [];
                    return categoriasArray.some(cat => cat.toLowerCase() === filtroCategoria.toLowerCase());
                });
            }

            renderizarFornecedores(fornecedoresFiltrados);
        } catch (error) {
            console.error("Erro ao carregar fornecedores da API:", error);
            if (fornecedoresContainer) fornecedoresContainer.innerHTML =
                `<div class="col-span-full text-center py-8 text-red-500">Erro ao carregar fornecedores da API.</div>`;
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
        const categoriasArray = fornecedor.categorias ? JSON.parse(fornecedor.categorias) : [];

        // Emojis mais diversificados baseados nas categorias
        if (categoriasArray.includes("Equipamentos") || categoriasArray.includes("Instrumentos") || categoriasArray.includes("Tecnologia")) emoji = "🔬";
        else if (categoriasArray.includes("Fitoterápicos") || categoriasArray.includes("Naturais")) emoji = "🌿";
        else if (categoriasArray.includes("Medicamentos")) emoji = "💊";
        else if (categoriasArray.includes("Cosméticos")) emoji = "💅";
        else if (categoriasArray.includes("Higiene Pessoal")) emoji = "🧴";
        else if (categoriasArray.includes("Suplementos") || categoriasArray.includes("Vitaminas")) emoji = "💪"; // Suplementos/Vitaminas
        else if (categoriasArray.includes("Hospitalar")) emoji = "🏥";
        else if (categoriasArray.includes("Veterinários")) emoji = "🐾";
        else if (categoriasArray.includes("Skincare")) emoji = "✨";


        const categoriasHTML = categoriasArray.map(categoria => {
            let bgColor = "bg-blue-100";
            let textColor = "text-blue-800";
            // Cores mais diversificadas para categorias
            if (["Equipamentos", "Instrumentos", "Tecnologia", "Hospitalar"].includes(categoria)) { bgColor = "bg-yellow-100"; textColor = "text-yellow-800"; }
            else if (["Fitoterápicos", "Naturais", "Orgânicos", "Alimentos Saudáveis"].includes(categoria)) { bgColor = "bg-green-100"; textColor = "text-green-800"; }
            else if (["Cosméticos", "Perfumaria", "Skincare", "Dermocosméticos"].includes(categoria)) { bgColor = "bg-purple-100"; textColor = "text-purple-800"; }
            else if (["Medicamentos", "Medicamentos Genéricos", "Medicamentos Veterinários"].includes(categoria)) { bgColor = "bg-red-100"; textColor = "text-red-800"; }
            else if (["Higiene Pessoal", "Limpeza Geral"].includes(categoria)) { bgColor = "bg-pink-100"; textColor = "text-pink-800"; }
            else if (["Suplementos", "Vitaminas"].includes(categoria)) { bgColor = "bg-orange-100"; textColor = "text-orange-800"; }
            return `<span class="${bgColor} ${textColor} text-xs px-2 py-1 rounded-full">${categoria}</span>`;
        }).join("");

        div.innerHTML = `
            <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${fornecedor.nomeFantasia || fornecedor.nome || "N/A"}</h3>
                        <p class="text-gray-600 mt-1">Razão Social: ${fornecedor.razaoSocial || "N/A"}</p>
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
                    <h4 class="font-medium text-gray-700 mb-2">Categorias de Produtos:</h4>
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
        const fornecedor = allFornecedores.find(f => f.id === id); 
        if (!fornecedor) {
            alert("Fornecedor não encontrado!");
            return;
        }

        if (fornecedorForm && fornecedorModal && modalTitle && fornecedorIdInput) {
            fornecedorForm.reset();
            fornecedorIdInput.value = fornecedor.id;
            // Preenche os campos do modal com os dados do fornecedor, usando os IDs corretos do HTML
            document.getElementById("nome-fantasia").value = fornecedor.nomeFantasia || fornecedor.nome || "";
            document.getElementById("razao-social").value = fornecedor.razaoSocial || "";
            document.getElementById("cnpj").value = fornecedor.cnpj || "";
            document.getElementById("email-fornecedor").value = fornecedor.email || "";
            document.getElementById("telefone-fornecedor").value = fornecedor.telefone || "";
            document.getElementById("endereco-fornecedor").value = fornecedor.endereco || "";

            // Seleciona a categoria principal no select do modal
            const tipoProdutoSelect = document.getElementById("tipo-produto");
            const categorias = fornecedor.categorias ? JSON.parse(fornecedor.categorias) : [];
            if (tipoProdutoSelect && categorias.length > 0) {
                tipoProdutoSelect.value = categorias[0]; 
            } else if (tipoProdutoSelect) {
                tipoProdutoSelect.value = ""; 
            }

            modalTitle.textContent = "Editar Fornecedor";
            if (modalErrorMessage) modalErrorMessage.style.display = "none";
            fornecedorModal.style.display = "flex";
        } else {
            console.error("Elementos do modal de fornecedor não encontrados!");
        }
    }

    function abrirModalAdicao() {
        console.log("Abrindo modal para adicionar novo fornecedor.");
        if (fornecedorForm && fornecedorModal && modalTitle && fornecedorIdInput) {
            fornecedorForm.reset();
            fornecedorIdInput.value = "";
            modalTitle.textContent = "Adicionar Fornecedor";
            if (modalErrorMessage) modalErrorMessage.style.display = "none";
            const tipoProdutoSelect = document.getElementById("tipo-produto");
            if (tipoProdutoSelect) tipoProdutoSelect.value = ""; 
            fornecedorModal.style.display = "flex";
        } else {
            console.error("Elementos do modal de fornecedor não encontrados!");
        }
    }

    function fecharModal() {
        if (fornecedorModal) {
            fornecedorModal.style.display = "none";
            console.log("Modal de fornecedor fechado.");
        }
    }

    async function salvarFornecedor(event) {
        event.preventDefault();
        console.log("Tentando salvar fornecedor...");

        const fornecedorId = fornecedorIdInput ? fornecedorIdInput.value : "";
        const nomeFantasia = document.getElementById("nome-fantasia")?.value;
        const razaoSocial = document.getElementById("razao-social")?.value;
        const cnpj = document.getElementById("cnpj")?.value;
        const email = document.getElementById("email-fornecedor")?.value;
        const telefone = document.getElementById("telefone-fornecedor")?.value;
        const endereco = document.getElementById("endereco-fornecedor")?.value;
        const categoriaPrincipal = document.getElementById("tipo-produto")?.value; 

        // Coletar todas as categorias, mesmo que do select venha apenas uma
        const categoriasParaSalvar = categoriaPrincipal ? [categoriaPrincipal] : [];

        // Os dados enviados para a API devem corresponder ao que o backend espera no model de fornecedor
        const fornecedorData = { 
            nome: nomeFantasia, // Usando nome fantasia como 'nome' principal
            nomeFantasia: nomeFantasia, 
            razaoSocial: razaoSocial, 
            cnpj: cnpj, 
            email: email, 
            telefone: telefone, 
            endereco: endereco, 
            categorias: JSON.stringify(categoriasParaSalvar) // Enviando como JSON string
        };
        console.log("Dados do fornecedor para salvar:", fornecedorData);
        const isEdicao = !!fornecedorId;

        const url = isEdicao ? `${API_BASE_URL}/fornecedores/${fornecedorId}` : `${API_BASE_URL}/fornecedores`;
        const method = isEdicao ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fornecedorData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (modalErrorMessage) {
                    modalErrorMessage.textContent = data.erro || `Erro ${response.status}: Falha ao salvar fornecedor.`;
                    modalErrorMessage.style.display = "block";
                }
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            alert(data.mensagem || `Fornecedor ${isEdicao ? 'atualizado' : 'cadastrado'} com sucesso!`);
            fecharModal();
            carregarFornecedores(searchInput ? searchInput.value : ""); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao salvar fornecedor:", error);
            if (modalErrorMessage && !modalErrorMessage.textContent) { 
                modalErrorMessage.textContent = "Ocorreu um erro inesperado ao salvar o fornecedor.";
                modalErrorMessage.style.display = "block";
            }
        }
    }

    async function excluirFornecedor(id) {
        console.log("Tentando excluir fornecedor ID:", id);
        const fornecedor = allFornecedores.find(f => f.id === id); 
        if (confirm(`Tem certeza que deseja excluir o fornecedor "${fornecedor?.nome || fornecedor?.nomeFantasia || id}"? Esta ação não pode ser desfeita.`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
                    method: "DELETE"
                });
                const data = await response.json();

                if (!response.ok) {
                    alert(`Erro ao excluir: ${data.erro || response.statusText}`);
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                alert(data.mensagem || "Fornecedor excluído com sucesso!");
                carregarFornecedores(searchInput ? searchInput.value : ""); 
            } catch (error) {
                console.error("Erro ao excluir fornecedor:", error);
                alert("Erro ao excluir fornecedor. Tente novamente.");
            }
        }
    }

    // --- Event Listeners ---
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            carregarFornecedores(searchInput.value, "Todos"); // Mantém "Todos" por padrão na busca
        });
    }

    if (addFornecedorButton) {
        addFornecedorButton.addEventListener("click", abrirModalAdicao);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", fecharModal);
    }
    if (fornecedorModal) {
        fornecedorModal.addEventListener("click", (e) => {
            if (e.target === fornecedorModal) {
                fecharModal();
            }
        });
    }

    if (fornecedorForm) {
        fornecedorForm.addEventListener("submit", salvarFornecedor);
    }

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

    // Adicionando Event Listeners para os botões de filtro de categoria
    if (filterAllButton) {
        filterAllButton.addEventListener('click', () => {
            carregarFornecedores(searchInput.value, "Todos");
            // Atualizar classes CSS para indicar qual botão está ativo
            filterAllButton.classList.add('bg-cyan-100', 'text-cyan-800');
            filterMedicamentosButton.classList.remove('bg-cyan-100', 'text-cyan-800');
            filterEquipamentosButton.classList.remove('bg-cyan-100', 'text-cyan-800');
        });
    }

    if (filterMedicamentosButton) {
        filterMedicamentosButton.addEventListener('click', () => {
            carregarFornecedores(searchInput.value, "Medicamentos");
            filterAllButton.classList.remove('bg-cyan-100', 'text-cyan-800');
            filterMedicamentosButton.classList.add('bg-cyan-100', 'text-cyan-800');
            filterEquipamentosButton.classList.remove('bg-cyan-100', 'text-cyan-800');
        });
    }

    if (filterEquipamentosButton) {
        filterEquipamentosButton.addEventListener('click', () => {
            carregarFornecedores(searchInput.value, "Equipamentos");
            filterAllButton.classList.remove('bg-cyan-100', 'text-cyan-800');
            filterMedicamentosButton.classList.remove('bg-cyan-100', 'text-cyan-800');
            filterEquipamentosButton.classList.add('bg-cyan-100', 'text-cyan-800');
        });
    }


    const logoutButton = document.getElementById("logout-button");
    if(logoutButton) {
        logoutButton.addEventListener("click", () => {
            alert("Você foi desconectado.");
            window.location.href = "index.html"; 
        });
    }

    // --- Inicialização ---
    console.log("Inicializando página de fornecedores...");
    carregarFornecedores(); // Carrega todos os fornecedores inicialmente
});