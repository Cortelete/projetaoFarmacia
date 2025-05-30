document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessageDiv = document.getElementById("error-message");

    // Define a URL base da sua API backend
    // Certifique-se de que o backend esteja rodando e acessível nesta URL
    const API_BASE_URL = "http://localhost:3000/api"; // Ajuste a porta se necessário

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        errorMessageDiv.style.display = "none"; // Esconde mensagens de erro anteriores
        errorMessageDiv.textContent = "";

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (response.ok) { // Status 200-299
                console.log("Login bem-sucedido:", data);
                // Armazenar informações do usuário (ex: token ou dados básicos) se necessário
                // Exemplo: localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
                
                // Redirecionar para a página principal (dashboard/painel)
                // Criaremos esta página a seguir
                window.location.href = "dashboard.html"; 
            } else {
                // Exibir mensagem de erro vinda da API ou uma genérica
                errorMessageDiv.textContent = data.erro || `Erro ${response.status}: Ocorreu um problema ao tentar fazer login.`;
                errorMessageDiv.style.display = "block";
            }
        } catch (error) {
            console.error("Erro na requisição de login:", error);
            errorMessageDiv.textContent = "Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.";
            errorMessageDiv.style.display = "block";
        }
    });
});

