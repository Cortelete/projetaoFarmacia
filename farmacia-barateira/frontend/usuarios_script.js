// Conteúdo completo para /usuarios_script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTES E VARIÁVEIS GLOBAIS ---
    const API_BASE_URL = 'http://localhost:3000/api';
    const token = localStorage.getItem('authToken');
    
    // Elementos do DOM
    const usuariosContainer = document.getElementById('usuarios-container');
    const searchInput = document.getElementById('search-input');
    const addUsuarioButton = document.getElementById('add-usuario-button');
    const filtrosContainer = document.getElementById('filtros-cargo');

    // Elementos do Modal
    const modal = document.getElementById('usuario-modal');
    const modalTitle = document.getElementById('modal-title');
    const fecharModalBtn = document.getElementById('fechar-modal-btn');
    const cancelarModalBtn = document.getElementById('cancelar-modal-btn');
    const usuarioForm = document.getElementById('usuario-form');
    const usuarioIdInput = document.getElementById('usuario-id');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const cargoSelect = document.getElementById('cargo');

    let todosUsuarios = []; // Armazena todos os usuários para filtrar no frontend
    let filtroCargoAtual = 'todos'; // Filtro de cargo ativo

    // --- FUNÇÕES PRINCIPAIS ---

    /**
     * Busca todos os usuários da API e inicia a renderização.
     */
    async function carregarUsuarios() {
        usuariosContainer.innerHTML = '<p class="text-gray-500">Carregando usuários...</p>';

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar usuários. Verifique se está logado.');
            }

            todosUsuarios = await response.json();
            filtrarErenderizarUsuarios(); // Renderiza os usuários com base nos filtros atuais

        } catch (error) {
            usuariosContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        }
    }

    /**
     * Filtra a lista de usuários (com base no cargo e na busca) e os renderiza.
     */
    function filtrarErenderizarUsuarios() {
        const termoBusca = searchInput.value.toLowerCase();
        
        const usuariosFiltrados = todosUsuarios.filter(usuario => {
            const correspondeCargo = (filtroCargoAtual === 'todos' || usuario.cargo === filtroCargoAtual);
            const correspondeBusca = (usuario.nome.toLowerCase().includes(termoBusca) || usuario.email.toLowerCase().includes(termoBusca));
            return correspondeCargo && correspondeBusca;
        });

        renderizarUsuarios(usuariosFiltrados);
    }

    /**
     * Renderiza os cards de usuário no container.
     * @param {Array} usuarios - A lista de usuários a ser renderizada.
     */
    function renderizarUsuarios(usuarios) {
        usuariosContainer.innerHTML = ''; // Limpa o container

        if (usuarios.length === 0) {
            usuariosContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">Nenhum usuário encontrado com os filtros aplicados.</p>';
            return;
        }

        usuarios.forEach(usuario => {
            const cardHtml = criarCardUsuario(usuario);
            usuariosContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
    }

    /**
     * Cria o HTML para um único card de usuário.
     * @param {Object} usuario - O objeto do usuário.
     * @returns {string} - O HTML do card.
     */
    function criarCardUsuario(usuario) {
        let corCargo, iconeCargo;
        switch (usuario.cargo) {
            case 'Administrador':
                corCargo = 'bg-red-100 text-red-800';
                iconeCargo = '👑';
                break;
            case 'Gerente':
                corCargo = 'bg-yellow-100 text-yellow-800';
                iconeCargo = '👔';
                break;
            default:
                corCargo = 'bg-blue-100 text-blue-800';
                iconeCargo = '🧑‍🔧';
        }

        return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden usuario-card transition-all duration-300">
                <div class="p-5 border-b border-gray-200">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 truncate">${usuario.nome}</h3>
                            <p class="text-sm text-gray-500 truncate">${usuario.email}</p>
                        </div>
                        <div class="text-3xl">${iconeCargo}</div>
                    </div>
                    <div class="mt-2">
                        <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${corCargo}">
                            ${usuario.cargo}
                        </span>
                    </div>
                </div>
                <div class="p-4 bg-gray-50 flex justify-end space-x-2">
                    <button data-action="editar" data-id="${usuario.id}" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Editar</button>
                    <button data-action="excluir" data-id="${usuario.id}" class="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Excluir</button>
                </div>
            </div>
        `;
    }

    // --- LÓGICA DO MODAL ---

    function abrirModal(titulo, usuario = null) {
        modalTitle.textContent = titulo;
        usuarioForm.reset();
        senhaInput.placeholder = "Deixe em branco para não alterar";
        
        if (usuario) { // Modo Edição
            usuarioIdInput.value = usuario.id;
            nomeInput.value = usuario.nome;
            emailInput.value = usuario.email;
            cargoSelect.value = usuario.cargo;
            senhaInput.required = false; // Senha não é obrigatória na edição
        } else { // Modo Adição
            usuarioIdInput.value = '';
            senhaInput.placeholder = "Mínimo de 6 caracteres";
            senhaInput.required = true; // Senha é obrigatória para novos usuários
        }
        modal.classList.remove('hidden');
    }

    function fecharModal() {
        modal.classList.add('hidden');
    }

    async function salvarUsuario(event) {
        event.preventDefault();
        const id = usuarioIdInput.value;
        const isEditing = !!id;

        const dados = {
            nome: nomeInput.value,
            email: emailInput.value,
            cargo: cargoSelect.value,
        };
        // Só adiciona a senha ao objeto se ela foi digitada
        if (senhaInput.value) {
            dados.senha = senhaInput.value;
        }

        // Validação
        if (!isEditing && !dados.senha) {
            showCustomAlert("A senha é obrigatória para novos usuários.", "error");
            return;
        }

        const url = isEditing ? `${API_BASE_URL}/usuarios/${id}` : `${API_BASE_URL}/usuarios`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.erro || 'Falha ao salvar usuário');
            }
            showCustomAlert(`Usuário ${isEditing ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            fecharModal();
            carregarUsuarios(); // Recarrega a lista
        } catch (error) {
            showCustomAlert(error.message, 'error');
        }
    }

    async function excluirUsuario(id) {
        if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.erro || 'Falha ao excluir usuário');
            }
            showCustomAlert('Usuário excluído com sucesso!', 'success');
            carregarUsuarios(); // Recarrega a lista
        } catch (error) {
            showCustomAlert(error.message, 'error');
        }
    }

    // --- EVENT LISTENERS ---

    // Filtros de cargo
    filtrosContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            // Remove a classe de ativo de todos os botões
            filtrosContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('bg-cyan-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');
            });
            // Adiciona a classe de ativo ao botão clicado
            event.target.classList.add('bg-cyan-600', 'text-white');
            event.target.classList.remove('bg-gray-200', 'text-gray-800', 'hover:bg-gray-300');

            filtroCargoAtual = event.target.dataset.cargo;
            filtrarErenderizarUsuarios();
        }
    });

    // Barra de busca
    searchInput.addEventListener('input', filtrarErenderizarUsuarios);

    // Botões do Modal
    addUsuarioButton.addEventListener('click', () => abrirModal('Adicionar Novo Usuário'));
    fecharModalBtn.addEventListener('click', fecharModal);
    cancelarModalBtn.addEventListener('click', fecharModal);
    usuarioForm.addEventListener('submit', salvarUsuario);

    // Delegação de eventos para botões de editar e excluir nos cards
    usuariosContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.dataset.action === 'editar') {
            const id = target.dataset.id;
            const usuario = todosUsuarios.find(u => u.id == id);
            if(usuario) abrirModal('Editar Usuário', usuario);
        }
        if (target.dataset.action === 'excluir') {
            excluirUsuario(target.dataset.id);
        }
    });

    // --- INICIALIZAÇÃO ---
    carregarUsuarios();
});