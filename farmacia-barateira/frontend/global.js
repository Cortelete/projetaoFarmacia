// Conteúdo COMPLETO e ATUALIZADO para /global.js

// Função para formatar números com dois dígitos (ex: 09, 08)
function pad(num) {
    return num < 10 ? '0' + num : num;
}

// Função para atualizar o relógio em tempo real
function updateLiveClock() {
    const clockElement = document.getElementById("live-clock");
    if (clockElement) {
        const agora = new Date();
        const dia = pad(agora.getDate());
        const mes = pad(agora.getMonth() + 1); // Meses começam do 0
        const ano = agora.getFullYear();
        const hora = pad(agora.getHours());
        const minuto = pad(agora.getMinutes());
        const segundo = pad(agora.getSeconds());

        const diasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const diaSemanaNome = diasDaSemana[agora.getDay()];

        clockElement.textContent = `${diaSemanaNome}, ${dia}/${mes}/${ano} - ${hora}:${minuto}:${segundo}`;
    }
}

// Função para renderizar o cabeçalho no topo da página
function renderHeader() {
    const headerHtml = `
        <header id="live-header" class="bg-gray-800 text-white text-sm text-center py-1 fixed top-0 w-full z-50 shadow-md">
            <span id="live-clock">Carregando relógio...</span>
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHtml);

    const mainLayout = document.getElementById("main-layout");
    if (mainLayout) {
        mainLayout.style.paddingTop = "26px";
    } else {
        document.body.style.paddingTop = "26px";
    }
}

// Função para renderizar o rodapé, agora de forma inteligente
function renderFooter() {
    const currentPage = window.location.pathname.split('/').pop();
    const isAuthPage = (currentPage === 'index.html' || currentPage === 'registro.html' || currentPage === '');

    let linksRapidosHtml = `
        <div>
            <h4 class="text-md font-semibold text-white mb-4">Acesso Rápido</h4>
            <ul class="space-y-2 text-sm">
                <li><a href="dashboard.html" class="hover:text-cyan-400 transition-colors">Início</a></li>
                <li><a href="vendas.html" class="hover:text-cyan-400 transition-colors">Vendas</a></li>
                <li><a href="estoque.html" class="hover:text-cyan-400 transition-colors">Estoque</a></li>
                <li><a href="clientes.html" class="hover:text-cyan-400 transition-colors">Clientes</a></li>
            </ul>
        </div>
    `;

    // Se estiver na página de login/registro, a coluna de links rápidos fica vazia.
    if (isAuthPage) {
        linksRapidosHtml = '<div></div>'; // Deixa a coluna vazia para manter o layout
    }

    const footerHtml = `
        <button id="back-to-top" class="hidden fixed bottom-5 right-5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold w-12 h-12 rounded-full shadow-lg transition-opacity duration-300 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
        </button>

        <footer class="bg-gray-800 text-gray-300 pt-12 pb-8 px-6 md:px-10 mt-auto">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                
                <div class="md:col-span-1">
                    <h3 class="text-lg font-bold text-white mb-4">Farmácia A Barateira</h3>
                    <p class="text-sm">Cuidando da sua saúde com os melhores preços e atendimento de qualidade desde 2024.</p>
                </div>

                ${linksRapidosHtml}

                <div>
                    <h4 class="text-md font-semibold text-white mb-4">Contato</h4>
                    <ul class="space-y-3 text-sm">
                        <li class="flex items-start">
                            <svg class="h-5 w-5 mr-3 mt-0.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span>Rua Principal, 123<br>Centro, Ponta Grossa - PR</span>
                        </li>
                        <li class="flex items-center">
                            <svg class="h-5 w-5 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <a href="tel:+554233334444" class="hover:text-cyan-400 transition-colors">(42) 3333-4444</a>
                        </li>
                        <li class="flex items-center">
                            <svg class="h-5 w-5 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <a href="mailto:contato@abarateira.com" class="hover:text-cyan-400 transition-colors">contato@abarateira.com</a>
                        </li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-md font-semibold text-white mb-4">Siga-nos</h4>
                    <div class="flex space-x-4">
                        <a href="#" aria-label="WhatsApp" class="text-gray-300 hover:text-green-400 transition-colors">
                            <svg class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.161l.217.324-1.241 4.515 4.639-1.219.356.21a8.37 8.37 0 005.52 1.593h.001z"/></svg>
                        </a>
                        <a href="#" aria-label="Instagram" class="text-gray-300 hover:text-pink-500 transition-colors">
                            <svg class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 3.808s-.012 2.741-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-3.808.06s-2.741-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-3.808s.012-2.741.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zm0 1.623c-2.403 0-2.741.01-3.72.058-.943.044-1.522.2-2.016.375a3.27 3.27 0 00-1.18 1.18c-.174.494-.33 1.073-.375 2.016-.048.979-.058 1.316-.058 3.72s.01 2.741.058 3.72c.044.943.2 1.522.375 2.016a3.27 3.27 0 001.18 1.18c.494.174 1.073.33 2.016.375.979.048 1.316.058 3.72.058 2.403 0 2.741-.01 3.72-.058.943-.044 1.522-.2 2.016-.375a3.27 3.27 0 001.18-1.18c.174-.494.33-1.073.375-2.016.048-.979.058-1.316.058-3.72s-.01-2.741-.058-3.72c-.044-.943-.2-1.522-.375-2.016a3.27 3.27 0 00-1.18-1.18c-.494-.174-1.073-.33-2.016-.375C15.056 3.633 14.718 3.623 12.315 3.623zM12 8.118a4.102 4.102 0 100 8.204 4.102 4.102 0 000-8.204zm0 6.577a2.475 2.475 0 110-4.95 2.475 2.475 0 010 4.95zM16.965 6.577a.96.96 0 100 1.92.96.96 0 000-1.92z" clip-rule="evenodd" /></svg>
                        </a>
                    </div>
                </div>

            </div>
            <div class="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
                <p>&copy; ${new Date().getFullYear()} Farmácia A Barateira. Todos os direitos reservados.</p>
                <p class="mt-1">Desenvolvido para o projeto do Prof. Marcos - Unicesumar.</p>
            </div>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHtml);
}


// Evento que executa quando o HTML da página está totalmente carregado
document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    
    // Inicia o relógio e o atualiza a cada segundo
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // --- LÓGICA PARA O BOTÃO "VOLTAR AO TOPO" ---
    const backToTopButton = document.getElementById("back-to-top");

    if(backToTopButton) {
        // Mostra o botão quando o usuário rolar 300px para baixo
        window.onscroll = () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopButton.classList.remove('hidden');
            } else {
                backToTopButton.classList.add('hidden');
            }
        };

        // Faz a página rolar suavemente para o topo quando o botão é clicado
        backToTopButton.onclick = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }
});