// Conteúdo FINAL e LIMPO para /configuracoes_script.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script de configurações carregado.");

    const mensagem = "Esta funcionalidade ainda está em desenvolvimento. 🚧";

    // Função auxiliar para adicionar alertas
    function adicionarAlerta(selector) {
        const elemento = document.querySelector(selector);
        if (elemento) {
            elemento.addEventListener('click', (event) => {
                event.preventDefault(); // Impede a ação padrão do elemento
                if (typeof showCustomAlert === 'function') {
                    showCustomAlert(mensagem, 'error');
                } else {
                    alert(mensagem);
                }
            });
        }
    }
    
    // Adiciona o alerta aos botões de ação que ainda não foram implementados
    adicionarAlerta('#btn-alterar-logo');
    adicionarAlerta('#btn-salvar-info');
    adicionarAlerta('#salvar-preferencias-btn');
    adicionarAlerta('#conectar-integracao-1');
    adicionarAlerta('#conectar-integracao-2');
    
    // Links de navegação (abas e botão de gerenciar) já funcionam via HTML, não precisam de JS.
});