// Conteúdo de populaUsuarios.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "farmacia.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados para popular usuários:", err.message);
    } else {
        console.log("Conectado ao banco de dados para popular usuários.");
    }
});

const usuarios = [
    // Usuários Funcionários
    { nome: "Joaquim Farmácia", email: "joaquim.farma@test.com", senha: "senha123", cargo: "Funcionário" },
    { nome: "Maria Atendente", email: "maria.atend@test.com", senha: "senha123", cargo: "Funcionário" },
    { nome: "Pedro Balconista", email: "pedro.balcao@test.com", senha: "senha123", cargo: "Funcionário" },
    { nome: "Ana Estagiária", email: "ana.estagio@test.com", senha: "senha123", cargo: "Estagiário" },
    { nome: "Carlos Estoquista", email: "carlos.estoque@test.com", senha: "senha123", cargo: "Funcionário" },
    { nome: "Sofia Vendedora", email: "sofia.vendas@test.com", senha: "senha123", cargo: "Funcionário" },
    { nome: "Lucas Caixa", email: "lucas.caixa@test.com", senha: "senha123", cargo: "Funcionário" },
    { nome: "Beatriz Limpeza", email: "bia.limpa@test.com", senha: "senha123", cargo: "Manutenção" },
    { nome: "Fernando Gestor", email: "fernando.gestor@test.com", senha: "senha123", cargo: "Gerente" },
    { nome: "Gabriela Farmacêutica", email: "gabi.farma@test.com", senha: "senha123", cargo: "Farmacêutico" },
    { nome: "Hugo Vigiador", email: "hugo.seg@test.com", senha: "senha123", cargo: "Segurança" },
    { nome: "Isabela Analista", email: "isa.analise@test.com", senha: "senha123", cargo: "Analista" },
    { nome: "Juliana Logística", email: "ju.log@test.com", senha: "senha123", cargo: "Logística" },
    { nome: "Kevin Entregador", email: "kevin.entrega@test.com", senha: "senha123", cargo: "Entregador" },
    { nome: "Larissa Digital", email: "lari.digital@test.com", senha: "senha123", cargo: "Marketing" },
    { nome: "Marcelo Compras", email: "marcelo.compras@test.com", senha: "senha123", cargo: "Compras" },
    { nome: "Natalia RH", email: "nati.rh@test.com", senha: "senha123", cargo: "Recursos Humanos" },
    { nome: "Otavio TI", email: "otavio.ti@test.com", senha: "senha123", cargo: "TI" },
    { nome: "Patricia Suporte", email: "paty.suporte@test.com", senha: "senha123", cargo: "Suporte" },
    { nome: "Ricardo Inovação", email: "rick.inovacao@test.com", senha: "senha123", cargo: "Desenvolvimento" }
];

db.serialize(() => {
    const stmt = db.prepare(
        `INSERT OR IGNORE INTO usuarios (nome, email, senha, cargo) 
         VALUES (?, ?, ?, ?)`
    );

    usuarios.forEach(user => {
        stmt.run(
            user.nome,
            user.email,
            user.senha,
            user.cargo,
            (err) => {
                if(err) {
                    console.error(`Erro ao inserir usuário ${user.nome}:`, err.message);
                }
            }
        );
    });

    stmt.finalize((err) => {
        if(err) {
            console.error("Erro ao finalizar statement de usuários:", err.message);
        } else {
            console.log("👥 Usuários verificados/adicionados com sucesso!");
        }
        db.close((closeErr) => { 
            if(closeErr) console.error("Erro ao fechar DB de usuários:", closeErr.message); 
        }); 
    });
});