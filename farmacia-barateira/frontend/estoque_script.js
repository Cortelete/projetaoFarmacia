document.addEventListener("DOMContentLoaded", () => {
    // Elementos da UI
    const tableBody = document.getElementById("medicamentos-table-body");
    const searchInput = document.getElementById("search-input");
    const addMedicamentoButton = document.getElementById("add-medicamento-button");
    const modal = document.getElementById("medicamento-modal");
    const modalTitle = document.getElementById("modal-title");
    const medicamentoForm = document.getElementById("medicamento-form");
    const medicamentoIdInput = document.getElementById("medicamento-id");
    const cancelButton = document.getElementById("cancel-button");
    const saveButton = document.getElementById("save-button");
    const modalErrorMessage = document.getElementById("modal-error-message");
    const fornecedorSelect = document.getElementById("fornecedor-select"); // Adicionado: select de fornecedores

    // URL base da API
    const API_BASE_URL = "http://localhost:3000/api"; 

    let allMedicamentos = []; // Armazena todos os medicamentos carregados
    let allFornecedores = []; // Armazena todos os fornecedores carregados da API

    // --- Funções Auxiliares ---

    const showModalError = (message) => {
        modalErrorMessage.textContent = message;
        modalErrorMessage.style.display = "block";
    };

    const closeModal = () => {
        medicamentoForm.reset();
        medicamentoIdInput.value = "";
        modalErrorMessage.style.display = "none";
        modalErrorMessage.textContent = "";
        modal.style.display = "none";
    };

    // Função para popular o select de fornecedores no modal
    const populateFornecedoresSelect = () => {
        if (!fornecedorSelect) return;
        fornecedorSelect.innerHTML = '<option value="">Selecione um fornecedor</option>'; // Opção padrão
        allFornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id; // O VALOR DA OPTION É O ID DO FORNECEDOR (NUMÉRICO)
            option.textContent = fornecedor.nome || fornecedor.nomeFantasia; // O TEXTO É O NOME DO FORNECEDOR
            fornecedorSelect.appendChild(option);
        });
    };

    const openModal = (medicamento = null) => {
        modalErrorMessage.style.display = "none";
        populateFornecedoresSelect(); // Sempre popula o select ao abrir o modal

        if (medicamento) {
            modalTitle.textContent = "Editar Medicamento";
            medicamentoIdInput.value = medicamento.id;
            document.getElementById("nome").value = medicamento.nome;
            document.getElementById("principioAtivo").value = medicamento.principioAtivo || "";
            document.getElementById("tipo").value = medicamento.tipo || "";
            document.getElementById("fabricante").value = medicamento.fabricante || "";
            document.getElementById("preco").value = medicamento.preco;
            document.getElementById("estoqueAtual").value = medicamento.estoqueAtual;
            document.getElementById("promocaoAtiva").value = medicamento.promocaoAtiva ? "1" : "0";
            
            // Selecionar o fornecedor correto pelo ID (agora med.fornecedor_id deve existir)
            if (medicamento.fornecedor_id) {
                fornecedorSelect.value = medicamento.fornecedor_id;
            } else {
                fornecedorSelect.value = ""; 
            }
            
        } else {
            modalTitle.textContent = "Adicionar Medicamento";
            medicamentoForm.reset();
            medicamentoIdInput.value = "";
            fornecedorSelect.value = ""; 
        }
        modal.style.display = "flex";
    };

    const renderTable = (medicamentos) => {
        tableBody.innerHTML = ""; 
        if (!medicamentos || medicamentos.length === 0) {
            // colspan ajustado para 8, pois agora a coluna "Fornecedor" substitui "Fabricante"
            tableBody.innerHTML = 
                `<tr><td colspan="8" class="text-center py-4 text-gray-500">Nenhum medicamento encontrado.</td></tr>`; 
            return;
        }

        medicamentos.forEach(med => {
            // Tenta obter o nome do fornecedor:
            // 1. Se a API já retorna 'fornecedor_nome' (via JOIN no backend - IDEAL)
            // 2. Ou, se não retorna, busca na lista 'allFornecedores' pelo 'fornecedor_id'
            const fornecedorExibido = med.fornecedor_nome || allFornecedores.find(f => f.id === med.fornecedor_id)?.nome || med.fabricante || "-"; 

            const row = document.createElement("tr");
            row.classList.add("border-b", "border-gray-200");
            row.innerHTML = `
                <td class="py-3 px-6 text-left whitespace-nowrap">${med.nome}</td>
                <td class="py-3 px-6 text-left">${med.principioAtivo || "-"}</td>
                <td class="py-3 px-6 text-left">${med.tipo || "-"}</td>
                <td class="py-3 px-6 text-right">R$ ${med.preco.toFixed(2).replace(".", ",")}</td>
                <td class="py-3 px-6 text-center">${med.estoqueAtual}</td>
                <td class="py-3 px-6 text-left">${fornecedorExibido}</td> <td class="py-3 px-6 text-center">
                    <span class="${med.promocaoAtiva ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"} py-1 px-3 rounded-full text-xs">
                        ${med.promocaoAtiva ? "Sim" : "Não"}
                    </span>
                </td>
                <td class="py-3 px-6 text-center">
                    <div class="flex item-center justify-center">
                        <button data-id="${med.id}" class="edit-button w-6 h-6 mr-2 text-blue-500 hover:text-blue-700 transform hover:scale-110" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button data-id="${med.id}" data-nome="${med.nome}" class="delete-button w-6 h-6 text-red-500 hover:text-red-700 transform hover:scale-110" title="Deletar">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        addTableActionListeners();
    };

    // FUNÇÃO PARA CARREGAR FORNECEDORES DA API (NECESSÁRIO PARA O SELECT)
    const fetchFornecedores = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/fornecedores`);
            if (!response.ok) {
                throw new Error(`Erro HTTP ao buscar fornecedores: ${response.status}`);
            }
            allFornecedores = await response.json();
            console.log("Fornecedores carregados:", allFornecedores);
            populateFornecedoresSelect(); 
        } catch (error) {
            console.error("Erro ao buscar fornecedores:", error);
        }
    };

    // FUNÇÃO PRINCIPAL PARA CARREGAR MEDICAMENTOS (AGORA CHAMA fetchFornecedores PRIMEIRO)
    const fetchMedicamentos = async () => {
        try {
            await fetchFornecedores(); // Garante que os fornecedores são carregados primeiro

            const response = await fetch(`${API_BASE_URL}/medicamentos`);
            if (!response.ok) {
                throw new Error(`Erro HTTP ao buscar medicamentos: ${response.status}`);
            }
            allMedicamentos = await response.json();
            console.log("Medicamentos carregados:", allMedicamentos);
            renderTable(allMedicamentos); 
        } catch (error) {
            console.error("Erro ao buscar medicamentos:", error);
            tableBody.innerHTML = 
                `<tr><td colspan="8" class="text-center py-4 text-red-500">Erro ao carregar medicamentos. Tente novamente mais tarde.</td></tr>`;
        }
    };

    const filterMedicamentos = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = allMedicamentos.filter(med => 
            med.nome.toLowerCase().includes(searchTerm) || 
            (med.principioAtivo && med.principioAtivo.toLowerCase().includes(searchTerm)) ||
            (med.fabricante && med.fabricante.toLowerCase().includes(searchTerm)) || // Filtra por fabricante original
            (allFornecedores.find(f => f.id === med.fornecedor_id)?.nome.toLowerCase().includes(searchTerm)) // Filtra por nome do fornecedor ligado
        );
        renderTable(filtered);
    };

    const addTableActionListeners = () => {
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                const medicamentoToEdit = allMedicamentos.find(med => med.id == id);
                if (medicamentoToEdit) {
                    openModal(medicamentoToEdit);
                }
            });
        });

        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                const nome = e.currentTarget.getAttribute("data-nome");
                if (confirm(`Tem certeza que deseja deletar o medicamento "${nome}"? Esta ação não pode ser desfeita.`)) {
                    deleteMedicamento(id);
                }
            });
        });
    };

    const deleteMedicamento = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/medicamentos/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();

            if (!response.ok) {
                alert(`Erro ao deletar: ${data.erro || response.statusText}`);
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            alert(data.mensagem || "Medicamento deletado com sucesso!");
            fetchMedicamentos(); 
        } catch (error) {
            console.error("Erro ao deletar medicamento:", error);
        }
    };

    // --- Event Listeners ---
    searchInput.addEventListener("input", filterMedicamentos);
    addMedicamentoButton.addEventListener("click", () => openModal());
    cancelButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    medicamentoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        modalErrorMessage.style.display = "none";

        const id = medicamentoIdInput.value;
        const isEditing = !!id;

        const medicamentoData = {
            nome: document.getElementById("nome").value,
            principioAtivo: document.getElementById("principioAtivo").value,
            tipo: document.getElementById("tipo").value,
            fabricante: document.getElementById("fabricante").value, 
            fornecedor_id: parseInt(fornecedorSelect.value), // ENVIANDO O ID DO FORNECEDOR
            preco: parseFloat(document.getElementById("preco").value),
            estoqueAtual: parseInt(document.getElementById("estoqueAtual").value),
            promocaoAtiva: parseInt(document.getElementById("promocaoAtiva").value)
        };

        // Validação se um fornecedor válido foi selecionado
        if (isNaN(medicamentoData.fornecedor_id) || medicamentoData.fornecedor_id <= 0) {
            showModalError("Por favor, selecione um fornecedor válido da lista.");
            return;
        }
        
        // Validação de Preço e Estoque
        if (isNaN(medicamentoData.preco) || medicamentoData.preco < 0 || isNaN(medicamentoData.estoqueAtual) || medicamentoData.estoqueAtual < 0) {
            showModalError("Preço e Estoque devem ser números válidos e não negativos.");
            return;
        }

        const url = isEditing ? `${API_BASE_URL}/medicamentos/${id}` : `${API_BASE_URL}/medicamentos`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(medicamentoData),
            });

            const data = await response.json();

            if (!response.ok) {
                showModalError(data.erro || `Erro ${response.status}`);
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            alert(data.mensagem || `Medicamento ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`);
            closeModal();
            fetchMedicamentos(); 
        } catch (error) {
            console.error(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} medicamento:`, error);
            if (!modalErrorMessage.textContent) {
                showModalError("Ocorreu um erro inesperado ao salvar.");
            }
        }
    });
    
    // --- Inicialização ---
    fetchMedicamentos(); // Carrega os dados iniciais quando a página é carregada (e fornecedores)

    const logoutButton = document.getElementById("logout-button");
    if(logoutButton) {
        logoutButton.addEventListener("click", () => {
            alert("Você foi desconectado.");
            window.location.href = "index.html"; 
        });
    }
});