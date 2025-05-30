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

    // URL base da API
    const API_BASE_URL = "http://localhost:3000/api"; // Ajuste se necessário

    let allMedicamentos = []; // Armazena todos os medicamentos carregados
    let currentMedicamento = null; // Guarda o medicamento sendo editado

    // --- Funções Auxiliares ---

    // Função para exibir mensagens de erro no modal
    const showModalError = (message) => {
        modalErrorMessage.textContent = message;
        modalErrorMessage.style.display = "block";
    };

    // Função para limpar e fechar o modal
    const closeModal = () => {
        medicamentoForm.reset();
        medicamentoIdInput.value = "";
        modalErrorMessage.style.display = "none";
        modalErrorMessage.textContent = "";
        modal.style.display = "none";
        currentMedicamento = null;
    };

    // Função para abrir o modal (para adicionar ou editar)
    const openModal = (medicamento = null) => {
        modalErrorMessage.style.display = "none";
        if (medicamento) {
            // Modo Edição
            modalTitle.textContent = "Editar Medicamento";
            medicamentoIdInput.value = medicamento.id;
            document.getElementById("nome").value = medicamento.nome;
            document.getElementById("principioAtivo").value = medicamento.principioAtivo || "";
            document.getElementById("tipo").value = medicamento.tipo || "";
            document.getElementById("fabricante").value = medicamento.fabricante || "";
            document.getElementById("preco").value = medicamento.preco;
            document.getElementById("estoqueAtual").value = medicamento.estoqueAtual;
            document.getElementById("promocaoAtiva").value = medicamento.promocaoAtiva ? "1" : "0";
            currentMedicamento = medicamento;
        } else {
            // Modo Adição
            modalTitle.textContent = "Adicionar Medicamento";
            medicamentoForm.reset();
            medicamentoIdInput.value = "";
            currentMedicamento = null;
        }
        modal.style.display = "flex";
    };

    // Função para renderizar a tabela de medicamentos
    const renderTable = (medicamentos) => {
        tableBody.innerHTML = ""; // Limpa a tabela
        if (!medicamentos || medicamentos.length === 0) {
            tableBody.innerHTML = 
                `<tr><td colspan="8" class="text-center py-4 text-gray-500">Nenhum medicamento encontrado.</td></tr>`;
            return;
        }

        medicamentos.forEach(med => {
            const row = document.createElement("tr");
            row.classList.add("border-b", "border-gray-200");
            row.innerHTML = `
                <td class="py-3 px-6 text-left whitespace-nowrap">${med.nome}</td>
                <td class="py-3 px-6 text-left">${med.principioAtivo || "-"}</td>
                <td class="py-3 px-6 text-left">${med.tipo || "-"}</td>
                <td class="py-3 px-6 text-right">R$ ${med.preco.toFixed(2).replace(".", ",")}</td>
                <td class="py-3 px-6 text-center">${med.estoqueAtual}</td>
                <td class="py-3 px-6 text-left">${med.fabricante || "-"}</td>
                <td class="py-3 px-6 text-center">
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

        // Adiciona event listeners aos botões de editar e deletar DEPOIS de criar as linhas
        addTableActionListeners();
    };

    // Função para carregar medicamentos da API
    const fetchMedicamentos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/medicamentos`);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            allMedicamentos = await response.json();
            renderTable(allMedicamentos); // Renderiza a tabela com todos os dados
        } catch (error) {
            console.error("Erro ao buscar medicamentos:", error);
            tableBody.innerHTML = 
                `<tr><td colspan="8" class="text-center py-4 text-red-500">Erro ao carregar medicamentos. Tente novamente mais tarde.</td></tr>`;
        }
    };

    // Função para filtrar medicamentos baseado na busca
    const filterMedicamentos = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = allMedicamentos.filter(med => 
            med.nome.toLowerCase().includes(searchTerm) || 
            (med.principioAtivo && med.principioAtivo.toLowerCase().includes(searchTerm))
        );
        renderTable(filtered);
    };

    // Função para adicionar listeners aos botões de ação da tabela
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

    // Função para deletar medicamento via API
    const deleteMedicamento = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/medicamentos/${id}`, {
                method: "DELETE"
            });
            const data = await response.json(); // Tenta ler a resposta mesmo em erro

            if (!response.ok) {
                 // Exibe erro específico da API (ex: FK constraint) ou genérico
                alert(`Erro ao deletar: ${data.erro || response.statusText}`);
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            alert(data.mensagem || "Medicamento deletado com sucesso!");
            fetchMedicamentos(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao deletar medicamento:", error);
            // Alert já foi mostrado no bloco if (!response.ok)
        }
    };

    // --- Event Listeners ---

    // Busca
    searchInput.addEventListener("input", filterMedicamentos);

    // Abrir modal para adicionar
    addMedicamentoButton.addEventListener("click", () => openModal());

    // Fechar modal
    cancelButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        // Fecha se clicar fora do conteúdo do modal
        if (e.target === modal) {
            closeModal();
        }
    });

    // Salvar (Adicionar ou Editar)
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
            preco: parseFloat(document.getElementById("preco").value),
            estoqueAtual: parseInt(document.getElementById("estoqueAtual").value),
            promocaoAtiva: parseInt(document.getElementById("promocaoAtiva").value)
        };

        // Validação simples no frontend
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
            fetchMedicamentos(); // Recarrega a lista

        } catch (error) {
            console.error(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} medicamento:`, error);
            // Mensagem de erro já exibida no modal se veio da API
            if (!modalErrorMessage.textContent) {
                 showModalError("Ocorreu um erro inesperado ao salvar.");
            }
        }
    });
    
    // --- Inicialização ---
    fetchMedicamentos(); // Carrega os dados iniciais quando a página é carregada

    // Lógica de Logout (simples exemplo)
    const logoutButton = document.getElementById("logout-button");
    if(logoutButton) {
        logoutButton.addEventListener("click", () => {
            // Limpar dados de sessão/local storage se houver
            // localStorage.removeItem('usuarioLogado');
            alert("Você foi desconectado.");
            window.location.href = "index.html"; // Redireciona para a tela de login
        });
    }

});

