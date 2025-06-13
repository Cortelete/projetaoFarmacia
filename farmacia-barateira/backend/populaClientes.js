// Conteúdo de populaClientes.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "farmacia.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados para popular clientes:", err.message);
    } else {
        console.log("Conectado ao banco de dados para popular clientes.");
    }
});

const clientes = [
    { nome: "Dona Florinda", telefone: "(11) 98765-4321", endereco: "Rua dos Girassóis, 10 - SP/SP", status: 1, emoji: "👵🌷" },
    { nome: "Seu Madruga", telefone: "(21) 99876-1234", endereco: "Beco da Vila, 71 - RJ/RJ", status: 1, emoji: "👴🎩" },
    { nome: "Chaves da Silva", telefone: "(31) 97654-9876", endereco: "Barril Sem Fundo, 8 - BH/MG", status: 1, emoji: "👦👕" },
    { nome: "Doutor Estranho", telefone: "(41) 91234-5678", endereco: "Sanctum Sanctorum, 1 - CTBA/PR", status: 1, emoji: "🧙‍♂️✨" },
    { nome: "Capitão Planeta", telefone: "(51) 92345-8765", endereco: "Natureza Viva, 5 - POA/RS", status: 1, emoji: "🌎🦸‍♂️" },
    { nome: "Mona Lisa", telefone: "(61) 93456-7890", endereco: "Museu do Louvre, 1 - BSB/DF", status: 1, emoji: "👩‍🎨🖼️" },
    { nome: "Professor Girafales", telefone: "(81) 94567-0123", endereco: "Rua do Beijo, 20 - REC/PE", status: 1, emoji: "👨‍🏫🌹" },
    { nome: "Chapolin Colorado", telefone: "(92) 95678-1234", endereco: "Grilo Escondido, 3 - MANAUS/AM", status: 1, emoji: "🦗🔴" },
    { nome: "Bruxa do 71", telefone: "(71) 96789-2345", endereco: "Casa da Assombração, 71 - SALV/BA", status: 0, emoji: "🧙‍♀️👻" }, // Inativa
    { nome: "Super-Homem", telefone: "(85) 97890-3456", endereco: "Fortaleza da Solidão, 99 - FORT/CE", status: 1, emoji: "🦸‍♂️🔵" },
    { nome: "Mulher Maravilha", telefone: "(91) 98901-4567", endereco: "Ilha Paraíso, 10 - BEL/PA", status: 1, emoji: "👸🛡️" },
    { nome: "Batman das Trevas", telefone: "(19) 99012-5678", endereco: "Caverna Morcego, 1 - CAMP/SP", status: 1, emoji: "🦇🌃" },
    { nome: "Flash Velocista", telefone: "(17) 90123-6789", endereco: "Rua Relâmpago, 1 - SJP/SP", status: 1, emoji: "⚡🏃‍♂️" },
    { nome: "Aquaman Submarino", telefone: "(13) 91234-7890", endereco: "Reino da Atlântida, 7 - SANTOS/SP", status: 1, emoji: "🔱🌊" },
    { nome: "Coringa Risonho", telefone: "(16) 92345-8901", endereco: "Asilo Arkham, 13 - RPR/SP", status: 0, emoji: "🤡🃏" }, // Inativo
    { nome: "Pequena Sereia", telefone: "(14) 93456-9012", endereco: "Fundo do Mar, 20 - BAURU/SP", status: 1, emoji: "🧜‍♀️🐠" },
    { nome: "Mickey Mouse", telefone: "(18) 94567-0123", endereco: "Disney World, 1 - PP/SP", status: 1, emoji: "🐭⭐" },
    { nome: "Pato Donald", telefone: "(11) 95678-1234", endereco: "Cidade de Patópolis, 5 - SP/SP", status: 1, emoji: "🦆😠" },
    { nome: "Bob Esponja", telefone: "(21) 96789-2345", endereco: "Abacaxi no Fundo do Mar, 1 - RJ/RJ", status: 1, emoji: "🍍🧽" },
    { nome: "Lula Molusco", telefone: "(31) 97890-3456", endereco: "Ilha da Páscoa, 1 - BH/MG", status: 0, emoji: "🦑🎶" } // Inativo
];

db.serialize(() => {
    const stmt = db.prepare(
        `INSERT OR IGNORE INTO clientes (nome, telefone, endereco, status, emoji, dataCadastro) 
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    );

    clientes.forEach(cli => {
        stmt.run(
            cli.nome,
            cli.telefone,
            cli.endereco,
            cli.status,
            cli.emoji,
            (err) => {
                if(err) {
                    console.error(`Erro ao inserir cliente ${cli.nome}:`, err.message);
                }
            }
        );
    });

    stmt.finalize((err) => {
        if(err) {
            console.error("Erro ao finalizar statement de clientes:", err.message);
        } else {
            console.log("👥 Clientes verificados/adicionados com sucesso!");
        }
        db.close((closeErr) => { 
            if(closeErr) console.error("Erro ao fechar DB de clientes:", closeErr.message); 
        }); 
    });
});