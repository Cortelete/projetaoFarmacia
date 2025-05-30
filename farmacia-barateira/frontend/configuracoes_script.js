document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os links das abas não funcionais
    const abasNaoFuncionais = document.querySelectorAll('nav[aria-label="Tabs"] a:not([aria-current="page"])');

    // Seleciona botões dentro das seções não funcionais (exemplo)
    const btnGerenciarUsuarios = document.querySelector('.config-card button:contains("Gerenciar Usuários")'); // Ajustar seletor se necessário
    const btnSalvarPreferencias = document.querySelector('.config-card button:contains("Salvar Preferências")'); // Ajustar seletor
    const btnConectarIntegracao = document.querySelectorAll('.config-card button:contains("Conectar")'); // Ajustar seletor

    const mensagemPadrao = "Esta funcionalidade ainda está em desenvolvimento. 🚧";

    // Adiciona listener para as abas
    abasNaoFuncionais.forEach(aba => {
        aba.addEventListener('click', (event) => {
            event.preventDefault(); // Impede a navegação padrão do link
            alert(mensagemPadrao);
        });
    });

    // Adiciona listener para botões específicos (se existirem e forem identificáveis)
    // Nota: Os seletores :contains não são padrão CSS, pode ser necessário usar IDs ou classes específicas.
    // Vamos adicionar IDs aos botões no HTML para facilitar.

    // Exemplo com IDs (precisa adicionar os IDs no HTML)
    const btnUsuarios = document.getElementById('gerenciar-usuarios-btn');
    const btnPrefs = document.getElementById('salvar-preferencias-btn');
    const btnsIntegracao = document.querySelectorAll('[id^="conectar-integracao-"]'); // Assumindo IDs como conectar-integracao-1, etc.

    if (btnUsuarios) {
        btnUsuarios.addEventListener('click', (event) => {
            event.preventDefault();
            alert(mensagemPadrao);
        });
    }

    if (btnPrefs) {
        btnPrefs.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir envio de formulário se for type=submit
            alert(mensagemPadrao);
        });
    }

    btnsIntegracao.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            alert(mensagemPadrao);
        });
    });

    // Adiciona listener genérico para links dentro das seções não implementadas (se necessário)
    // Ex: document.querySelectorAll('#secao-usuarios a, #secao-preferencias a, #secao-integracoes a').forEach(...)

});

// Adiciona a função contains para jQuery-like selector (simplificado)
// Isso pode não ser robusto, idealmente usar IDs ou classes.
// Considerar remover se for usar IDs.
/*
document.querySelectorAll = (function (original) {
    return function (selector) {
        if (selector.includes(':contains')) {
            const parts = selector.split(':contains(');
            const baseSelector = parts[0];
            const text = parts[1].replace(/['")]/g, '');
            const elements = document.querySelectorAll(baseSelector);
            return Array.from(elements).filter(el => el.textContent.includes(text));
        }
        return original.call(document, selector);
    };
})(document.querySelectorAll);
*/

