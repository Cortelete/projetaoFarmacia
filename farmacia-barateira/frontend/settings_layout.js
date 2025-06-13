// Conteúdo completo para /settings_layout.js

document.addEventListener("DOMContentLoaded", () => {
    // Pega o nome do arquivo da URL atual (ex: "usuarios.html")
    const currentPage = window.location.pathname.split('/').pop();

    // Define qual texto corresponde a qual arquivo
    const pages = {
        'configuracoes.html': 'Geral',
        'usuarios.html': 'Usuários',
        'preferencias.html': 'Preferências',
        'integracoes.html': 'Integrações'
    };

    // Gera o HTML de cada link da aba, aplicando a classe de "ativo" na página atual
    let navLinksHtml = '';
    for (const file in pages) {
        const text = pages[file];
        const isActive = (currentPage === file);
        
        // Classes de estilo para a aba ativa e inativa
        const activeClasses = 'border-cyan-500 text-cyan-600';
        const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
        
        const linkClasses = isActive ? activeClasses : inactiveClasses;

        navLinksHtml += `
            <a href="${file}" class="${linkClasses} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                ${text}
            </a>
        `;
    }

    // Cria o container da navegação
    const navHtml = `
        <div class="mb-6 border-b border-gray-200">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                ${navLinksHtml}
            </nav>
        </div>
    `;

    // Encontra o elemento placeholder no HTML da página e insere o menu
    const placeholder = document.getElementById('settings-nav-placeholder');
    if (placeholder) {
        placeholder.innerHTML = navHtml;
    }
});