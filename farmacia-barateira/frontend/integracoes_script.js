// Conteúdo para /integracoes_script.js

document.addEventListener('DOMContentLoaded', () => {
    // Selecionando todos os botões de integração
    const btnsIntegracao = document.querySelectorAll('[id^="conectar-integracao-"]'); 
    const mensagem = "Esta funcionalidade ainda está em desenvolvimento. 🚧";

    // Adiciona o listener para cada botão
    btnsIntegracao.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof showCustomAlert === 'function') {
                showCustomAlert(mensagem, 'error');
            } else {
                alert(mensagem);
            }
        });
    });
});