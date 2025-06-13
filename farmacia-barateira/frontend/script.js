// Conteúdo CORRIGIDO para /script.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessageDiv = document.getElementById("error-message");

    const API_BASE_URL = "http://localhost:3000/api";

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorMessageDiv.style.display = "none";
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
                
                // Armazena o token e os dados do usuário no localStorage do navegador
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
                
                // Redireciona para o dashboard
                window.location.href = "dashboard.html"; 

            } else {
                errorMessageDiv.textContent = data.erro || `Erro: Tente novamente.`;
                errorMessageDiv.style.display = "block";
            }
        } catch (error) {
            console.error("Erro na requisição de login:", error);
            errorMessageDiv.textContent = "Não foi possível conectar ao servidor.";
            errorMessageDiv.style.display = "block";
        }
    });
});