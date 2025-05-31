document.addEventListener("DOMContentLoaded", () => {
    // Seleciona os links das abas não funcionais (Usuários, Preferências, Integrações)
    const abasNaoFuncionais = document.querySelectorAll('nav[aria-label="Tabs"] a:not([aria-current="page"])');

    // Seleciona botões específicos por ID
    const btnUsuarios = document.getElementById('gerenciar-usuarios-btn');
    const btnPrefs = document.getElementById('salvar-preferencias-btn');
    // Seleciona todos os botões que começam com 'conectar-integracao-'
    const btnsIntegracao = document.querySelectorAll('[id^="conectar-integracao-"]'); 

    const mensagemPadrao = "Esta funcionalidade ainda está em desenvolvimento. 🚧";

    // Adiciona listener para as abas não funcionais
    abasNaoFuncionais.forEach(aba => {
        aba.addEventListener('click', (event) => {
            event.preventDefault(); // Impede a navegação padrão do link (href="#")
            alert(mensagemPadrao);
        });
    });

    // Adiciona listener para o botão "Gerenciar Usuários"
    if (btnUsuarios) {
        btnUsuarios.addEventListener('click', async (event) => {
            event.preventDefault(); // Previne qualquer ação padrão do botão
            alert(mensagemPadrao);

            // Exemplo de envio de dados via fetch (atualize com os dados reais)
            try {
                const response = await fetch('/api/atualizar-usuarios', {  // Atualize a URL da API
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: 1, nome: 'Novo Nome' }),  // Dados fictícios
                });

                if (!response.ok) {
                    throw new Error('Erro ao atualizar usuário');
                }

                const data = await response.json();
                console.log('Dados atualizados:', data);
            } catch (error) {
                console.error('Erro:', error);
            }
        });
    }

    // Adiciona listener para o botão "Salvar Preferências"
    if (btnPrefs) {
        btnPrefs.addEventListener('click', async (event) => {
            event.preventDefault(); // Previne envio de formulário se for type=submit
            alert(mensagemPadrao);

            // Exemplo de envio de dados via fetch (atualize com os dados reais)
            try {
                const response = await fetch('/api/salvar-preferencias', {  // Atualize a URL da API
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ preferencia: 'nova-preferencia' }),  // Dados fictícios
                });

                if (!response.ok) {
                    throw new Error('Erro ao salvar preferências');
                }

                const data = await response.json();
                console.log('Preferências salvas:', data);
            } catch (error) {
                console.error('Erro:', error);
            }
        });
    }

    // Adiciona listener para os botões de "Conectar/Desconectar" das integrações
    btnsIntegracao.forEach(btn => {
        btn.addEventListener('click', async (event) => {
            event.preventDefault(); // Previne qualquer ação padrão do botão
            alert(mensagemPadrao);

            // Exemplo de envio de dados via fetch (atualize com os dados reais)
            try {
                const response = await fetch('/api/gerenciar-integracao', {  // Atualize a URL da API
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ integracaoId: btn.id, status: 'ativo' }),  // Dados fictícios
                });

                if (!response.ok) {
                    throw new Error('Erro ao conectar/desconectar integração');
                }

                const data = await response.json();
                console.log('Integração atualizada:', data);
            } catch (error) {
                console.error('Erro:', error);
            }
        });
    });

    // Nota: O botão "Alterar Logo" e "Salvar Informações" na seção Geral
    // não foram incluídos aqui, pois pertencem à parte funcional (Geral).
    // Se eles também não estiverem implementados, adicione IDs e listeners para eles.

});
