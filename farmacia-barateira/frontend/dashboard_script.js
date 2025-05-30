document.addEventListener("DOMContentLoaded", () => {
    // Lógica de Logout (pode ser colocada em um arquivo JS comum se preferir)
    const logoutButton = document.getElementById("logout-button");
    if(logoutButton) {
        logoutButton.addEventListener("click", () => {
            // Limpar dados de sessão/local storage se houver
            // localStorage.removeItem("usuarioLogado"); // Exemplo se você salvou dados do usuário
            alert("Você foi desconectado.");
            window.location.href = "index.html"; // Redireciona para a tela de login
        });
    }

    // Aqui você pode adicionar lógica para carregar dados nos cards do dashboard
    // Exemplo: buscar totais de vendas, contagem de estoque baixo, etc., da API
    // fetch(`${API_BASE_URL}/vendas/resumo`) // Exemplo de rota (precisaria criar no backend)
    //    .then(response => response.json())
    //    .then(data => {
    //        // Atualizar os cards com os dados recebidos
    //    })
    //    .catch(error => console.error("Erro ao carregar resumo do dashboard:", error));

    console.log("Dashboard carregado.");
});

