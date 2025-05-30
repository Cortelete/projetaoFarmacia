document.addEventListener('DOMContentLoaded', function() {
  console.log("Corrigindo links do menu - versão melhorada");
  
  // Mapeamento correto de links
  const linkCorreto = {
    "Início": "dashboard.html",
    "Vendas": "vendas.html",
    "Estoque": "estoque.html",
    "Clientes": "clientes.html",
    "Fornecedores": "fornecedores.html",
    "Relatórios": "relatorios.html",
    "Configurações": "configuracoes.html"
  };
  
  // Encontrar todos os links do menu
  const menuLinks = document.querySelectorAll('aside a');
  console.log("Links do menu encontrados: " + menuLinks.length);
  
  // Corrigir cada link
  menuLinks.forEach(link => {
    // Obter o texto do link, ignorando espaços e conteúdo SVG
    let textoLink = link.textContent.trim();
    
    // Verificar cada palavra-chave no texto do link
    for (const [chave, valor] of Object.entries(linkCorreto)) {
      if (textoLink.includes(chave)) {
        link.href = valor;
        console.log("Corrigido link contendo '" + chave + "' para: " + link.href);
        break;
      }
    }
  });
});
