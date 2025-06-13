// Conteúdo completo para /preferencias_script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO SELETOR DE TEMA ---
    const themeSelect = document.getElementById('tema');

    // Função para aplicar o tema e salvar a preferência
    function aplicarTema(tema) {
        if (tema === 'system') {
            localStorage.removeItem('theme'); // Limpa a preferência para usar a do OS
            // Aplica o tema do sistema operacional imediatamente
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } else if (tema === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    // Define o valor inicial do seletor com base no que está salvo
    const temaSalvo = localStorage.getItem('theme');
    if (temaSalvo) {
        themeSelect.value = temaSalvo;
    } else {
        themeSelect.value = 'system';
    }

    // Adiciona o listener para salvar a mudança quando o usuário escolher
    themeSelect.addEventListener('change', (e) => {
        aplicarTema(e.target.value);
    });


    // --- LÓGICA PARA OUTRAS PREFERÊNCIAS (EM DESENVOLVIMENTO) ---
    const outrosControles = document.querySelectorAll('#densidade, .toggle-checkbox');
    outrosControles.forEach(controle => {
        controle.addEventListener('click', (e) => {
            // Previne a ação para os checkboxes
            if(controle.type === 'checkbox') e.preventDefault();
            
            if (typeof showCustomAlert === 'function') {
                showCustomAlert("Funcionalidade em desenvolvimento.", "error");
            } else {
                alert("Funcionalidade em desenvolvimento. 🚧");
            }
        });
    });

});