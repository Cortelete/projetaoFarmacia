// Conteúdo para o novo arquivo: /theme-loader.js
(function() {
    // 1. Verifica se o usuário já salvou uma preferência no site ('dark' ou 'light')
    // 2. Se não, verifica se o sistema operacional do usuário prefere o modo escuro
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        // Se uma das condições for verdadeira, adiciona a classe 'dark' ao elemento <html>
        document.documentElement.classList.add('dark');
    } else {
        // Caso contrário, garante que a classe 'dark' seja removida
        document.documentElement.classList.remove('dark');
    }
})();