document.addEventListener("DOMContentLoaded", () => {
    // --- CONSTANTES E VARIÁVEIS GLOBAIS ---
    const API_BASE_URL = "http://localhost:3000/api";
    const token = localStorage.getItem('authToken');

    // Elementos do DOM
    const clientesContainer = document.getElementById("clientes-container");
    const searchInput = document.getElementById("search-input");
    const addClienteButton = document.getElementById("add-cliente-button");
    const filtrosContainer = document.getElementById('filtros-status');

    // Elementos do Modal
    const modal = document.getElementById("cliente-modal");
    const modalTitle = document.getElementById("modal-title");
    const fecharModalBtn = document.getElementById('fechar-modal-btn');
    const cancelButton = document.getElementById("cancel-button");
    const clienteForm = document.getElementById("cliente-form");
    const clienteIdInput = document.getElementById("cliente-id");
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const enderecoInput = document.getElementById('endereco');
    const statusSelect = document.getElementById('status');
    const emojiInput = document.getElementById('emoji');

    let todosClientes = [];
    let filtroStatus = 'todos';

    // --- FUNÇÕES DE RENDERIZAÇÃO E LÓGICA ---

    async function carregarClientes() {
        clientesContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Carregando clientes...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}/clientes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar clientes.');
            
            todosClientes = await response.json();
            filtrarErenderizar();
        } catch (error) {
            clientesContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        }
    }

    function filtrarErenderizar() {
        const termoBusca = searchInput.value.toLowerCase();
        
        const clientesFiltrados = todosClientes.filter(cliente => {
            const correspondeStatus = (filtroStatus === 'todos' || cliente.status == filtroStatus);
            const correspondeBusca = cliente.nome.toLowerCase().includes(termoBusca) || (cliente.email && cliente.email.toLowerCase().includes(termoBusca));
            return correspondeStatus && correspondeBusca;
        });
        renderizarClientes(clientesFiltrados);
    }

    function renderizarClientes(clientes) {
        clientesContainer.innerHTML = "";
        if (clientes.length === 0) {
            clientesContainer.innerHTML = `<div class="col-span-full text-center py-8"><p class="text-gray-500 dark:text-gray-400">Nenhum cliente encontrado.</p></div>`;
            return;
        }
        clientes.forEach(cliente => {
            clientesContainer.insertAdjacentHTML('beforeend', criarCardCliente(cliente));
        });
    }

    function criarCardCliente(cliente) {
        const isAtivo = cliente.status == 1;
        const statusClass = isAtivo ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        const statusText = isAtivo ? "Ativo" : "Inativo";
        const emoji = cliente.emoji || '👤';

        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cliente-card transition-all duration-300">
                <div class="p-5 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                <span class="mr-2 truncate">${cliente.nome}</span>
                                <span class="text-xs font-semibold px-2 py-1 rounded-full ${statusClass}">${statusText}</span>
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 mt-1">${cliente.email || "Sem email"}</p>
                        </div>
                        <div class="text-3xl">${emoji}</div>
                    </div>
                </div>
                <div class="p-5 space-y-3">
                    <p class="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                        <svg class="h-5 w-5 mr-2 text-purple-500 dark:text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <span class="truncate">${cliente.telefone || "Sem telefone"}</span>
                    </p>
                    <p class="flex items-start text-gray-700 dark:text-gray-300 text-sm">
                        <svg class="h-5 w-5 mr-2 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>${cliente.endereco || "Endereço não informado"}</span>
                    </p>
                </div>
                <div class="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-x-2">
                    <button data-action="editar" data-id="${cliente.id}" class="p-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-purple-700 rounded-full transition-colors" title="Editar Cliente">
                        <svg class="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button data-action="excluir" data-id="${cliente.id}" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-700 rounded-full transition-colors" title="Excluir Cliente">
                        <svg class="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>`;
    }

    function abrirModal(titulo, cliente = null) {
        modalTitle.textContent = titulo;
        clienteForm.reset();
        
        if (cliente) { // Edição
            clienteIdInput.value = cliente.id;
            nomeInput.value = cliente.nome;
            emailInput.value = cliente.email;
            telefoneInput.value = cliente.telefone;
            enderecoInput.value = cliente.endereco;
            statusSelect.value = cliente.status;
            emojiInput.value = cliente.emoji || '';
        } else { // Adição
            clienteIdInput.value = '';
            statusSelect.value = '1'; // Padrão 'Ativo'
        }
        modal.classList.remove('hidden');
    }

    function fecharModal() {
        modal.classList.add('hidden');
    }

    async function salvarCliente(event) {
        event.preventDefault();
        const id = clienteIdInput.value;
        const isEditing = !!id;

        const dados = {
            nome: nomeInput.value,
            telefone: telefoneInput.value,
            email: emailInput.value,
            endereco: enderecoInput.value,
            status: parseInt(statusSelect.value, 10),
            emoji: emojiInput.value || '👤'
        };

        const url = isEditing ? `${API_BASE_URL}/clientes/${id}` : `${API_BASE_URL}/clientes`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(dados)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro || 'Falha ao salvar cliente.');
            
            showCustomAlert(`Cliente ${isEditing ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            fecharModal();
            carregarClientes();
        } catch (error) {
            showCustomAlert(error.message, 'error');
        }
    }

    async function excluirCliente(id) {
        if (!confirm('Tem certeza que deseja excluir este cliente? Vendas associadas a ele não serão removidas.')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.erro);

            showCustomAlert('Cliente excluído com sucesso!', 'success');
            carregarClientes();
        } catch (error) {
            showCustomAlert(error.message, 'error');
        }
    }

    // --- EVENT LISTENERS ---
    
    addClienteButton.addEventListener('click', () => abrirModal('Adicionar Novo Cliente'));
    fecharModalBtn.addEventListener('click', fecharModal);
    cancelButton.addEventListener('click', fecharModal);
    clienteForm.addEventListener('submit', salvarCliente);
    searchInput.addEventListener('input', filtrarErenderizar);

    filtrosContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            filtroStatus = e.target.dataset.status;
            // Atualiza estilo dos botões
            filtrosContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('bg-purple-600', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-300', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
            });
            e.target.classList.add('bg-purple-600', 'text-white');
            e.target.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-300');
            
            filtrarErenderizar();
        }
    });

    clientesContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const { action, id } = button.dataset;
        const cliente = todosClientes.find(c => c.id == id);

        if (action === 'editar' && cliente) {
            abrirModal('Editar Cliente', cliente);
        } else if (action === 'excluir') {
            excluirCliente(id);
        }
    });

    // --- INICIALIZAÇÃO ---
    carregarClientes();
});
