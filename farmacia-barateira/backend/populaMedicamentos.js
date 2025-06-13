// Conteúdo de populaMedicamentos.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define o caminho absoluto para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, "farmacia.db"); // Certifique-se que o caminho está correto
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados para popular medicamentos:", err.message);
    } else {
        console.log("Conectado ao banco de dados para popular medicamentos.");
    }
});

// IDs dos fornecedores de teste (Estes IDs correspondem aos fornecedores do populaFornecedores.js)
// Se você mudar a ordem ou a lista no populaFornecedores.js, ESTES IDs PODEM MUDAR.
// Verifique no seu DB se precisar de certeza.
const FORNECEDOR_PHARMA_DISTRIBUIDORA = 1;
const FORNECEDOR_MEDITECH_EQUIPAMENTOS = 2;
const FORNECEDOR_NATURAPHARMA = 3;
const FORNECEDOR_GLOBAL_PHARMA = 4;
const FORNECEDOR_VITA_SUPRIMENTOS = 5;
const FORNECEDOR_COSMETIC_PRIME = 6;
const FORNECEDOR_DROGAS_EXPRESS = 7;
const FORNECEDOR_BIOQUIMICA_AVANCADA = 8;
const FORNECEDOR_EQUIPA_HOSPITALAR = 9;
const FORNECEDOR_SAUDE_PLENA = 10;
const FORNECEDOR_VERDE_VIDA = 11;
const FORNECEDOR_FAST_PHARMA = 12;
const FORNECEDOR_AROMA_ESSENCIAL = 13;
const FORNECEDOR_MEDICINA_FUTURO = 14;
const FORNECEDOR_SAUDAVEL_JA = 15;
const FORNECEDOR_QUIMICA_ESSENCIAL = 16;
const FORNECEDOR_LIMPEZA_TOTAL = 17;
const FORNECEDOR_DERMOCOSMETICOS_ALPHA = 18;
const FORNECEDOR_VETERINARIA_PHARMA = 19;
const FORNECEDOR_GESSO_E_CIA = 20;


const medicamentos = [
    // 20 Medicamentos com referências a diferentes fornecedores
    { nome: "Dorflexol Extra Power", principioAtivo: "Flexina Dorada", tipo: "Comprimido", preco: 19.90, estoqueAtual: 42, fabricante: "Farmabizarra", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_PHARMA_DISTRIBUIDORA },
    { nome: "Xurumelol Ultra", principioAtivo: "Bizarritina Avançada", tipo: "Xarope", preco: 7.40, estoqueAtual: 25, fabricante: "Xurumela Labs", promocaoAtiva: 1, fornecedor_id: FORNECEDOR_PHARMA_DISTRIBUIDORA },
    { nome: "Relaxaço Zen Forte", principioAtivo: "Tranquiletanol Max", tipo: "Gotas", preco: 14.30, estoqueAtual: 12, fabricante: "Relaxmed", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_NATURAPHARMA },
    { nome: "Antidorzin Plus Action", principioAtivo: "Dorfinax Ativo", tipo: "Cápsula", preco: 9.80, estoqueAtual: 33, fabricante: "SofreMed", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_MEDITECH_EQUIPAMENTOS },
    { nome: "Tossebane Kids Formula", principioAtivo: "Tossolito Suave", tipo: "Xarope Infantil", preco: 6.20, estoqueAtual: 18, fabricante: "Gargameds", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_PHARMA_DISTRIBUIDORA },
    { nome: "Desmaionix Turbo", principioAtivo: "Caideitadox Ultra", tipo: "Injetável", preco: 32.50, estoqueAtual: 7, fabricante: "Lab DormeDuro", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_MEDITECH_EQUIPAMENTOS },
    { nome: "Olhovidex Visão Clara", principioAtivo: "Retinolizante Premium", tipo: "Colírio", preco: 11.10, estoqueAtual: 22, fabricante: "Visomed", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_PHARMA_DISTRIBUIDORA },
    { nome: "Naridelícia Respira Bem", principioAtivo: "Cheirenzina Alívio", tipo: "Spray nasal", preco: 8.90, estoqueAtual: 15, fabricante: "SinusPop", promocaoAtiva: 1, fornecedor_id: FORNECEDOR_NATURAPHARMA },
    { nome: "Remedazol Power", principioAtivo: "Placebina Explosiva", tipo: "Comprimido", preco: 23.70, estoqueAtual: 40, fabricante: "EfeitoPlacebo Corp", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_MEDITECH_EQUIPAMENTOS },
    { nome: "Chorumino Feliz", principioAtivo: "Emotivex Paz", tipo: "Gotas", preco: 5.50, estoqueAtual: 60, fabricante: "Dramédicos Unidos", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_PHARMA_DISTRIBUIDORA },
    { nome: "Febriloloco Zero", principioAtivo: "Calorazol Free", tipo: "Cápsula", preco: 10.60, estoqueAtual: 28, fabricante: "Termobizarro", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_NATURAPHARMA },
    { nome: "Antipancadol Alívio", principioAtivo: "Pancanina Suave", tipo: "Comprimido", preco: 29.90, estoqueAtual: 5, fabricante: "Barrigamed", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_MEDITECH_EQUIPAMENTOS },
    { nome: "SussaVida Leve", principioAtivo: "Zenfluor Essencial", tipo: "Chá Medicinal", preco: 12.40, estoqueAtual: 20, fabricante: "Calmitex Pharma", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_PHARMA_DISTRIBUIDORA },
    { nome: "Vitamina Solar D3", principioAtivo: "Colecalciferol", tipo: "Cápsula", preco: 30.00, estoqueAtual: 75, fabricante: "Luz do Sol Vitaminas", promocaoAtiva: 1, fornecedor_id: FORNECEDOR_VITA_SUPRIMENTOS },
    { nome: "Probiótico Equilíbrio", principioAtivo: "Lactobacillus Complex", tipo: "Sachê", preco: 40.00, estoqueAtual: 50, fabricante: "Flora Viva", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_VITA_SUPRIMENTOS },
    { nome: "Sérum Facial Radiante", principioAtivo: "Ácido Hialurônico", tipo: "Sérum", preco: 85.00, estoqueAtual: 30, fabricante: "Beleza Pura", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_COSMETIC_PRIME },
    { nome: "Escova Dental Ativada", principioAtivo: "N/A", tipo: "Higiene Oral", preco: 12.00, estoqueAtual: 100, fabricante: "Sorriso Limpo", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_LIMPEZA_TOTAL },
    { nome: "Luvas Cirúrgicas Conforto", principioAtivo: "Látex Premium", tipo: "Equipamento", preco: 25.00, estoqueAtual: 40, fabricante: "Mãos Seguras", promocaoAtiva: 1, fornecedor_id: FORNECEDOR_EQUIPA_HOSPITALAR },
    { nome: "Algodão Hidrófilo Puro", principioAtivo: "Algodão", tipo: "Material Hospitalar", preco: 5.00, estoqueAtual: 200, fabricante: "Pura Maciez", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_QUIMICA_ESSENCIAL },
    { nome: "Termômetro Infravermelho", principioAtivo: "N/A", tipo: "Diagnóstico", preco: 95.00, estoqueAtual: 15, fabricante: "Precisão Saúde", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_MEDITECH_EQUIPAMENTOS },
    { nome: "Relaxante Muscular Noite Feliz", principioAtivo: "Miosrelaxin", tipo: "Comprimido", preco: 28.00, estoqueAtual: 35, fabricante: "Dormir Bem Labs", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_PHARMA_DISTRIBUIDORA },
    { nome: "Gel Pós-Sol Refrescante", principioAtivo: "Aloe Vera", tipo: "Gel", preco: 22.50, estoqueAtual: 50, fabricante: "Bronzeado Saudável", promocaoAtiva: 1, fornecedor_id: FORNECEDOR_COSMETIC_PRIME },
    { nome: "Adoçante Natural Zero", principioAtivo: "Stevia Pura", tipo: "Alimento Funcional", preco: 17.00, estoqueAtual: 60, fabricante: "Doce Vida", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_SAUDAVEL_JA },
    { nome: "Bandagem Elástica Ultra", principioAtivo: "Elastano", tipo: "Material Ortopédico", preco: 14.00, estoqueAtual: 45, fabricante: "Recupera Rápido", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_GESSO_E_CIA },
    { nome: "Xampu Terapêutico Antialérgico", principioAtivo: "Avena Sativa", tipo: "Dermocosmético", preco: 35.00, estoqueAtual: 28, fabricante: "Pele Sensível", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_DERMOCOSMETICOS_ALPHA },
    { nome: "Kit Primeiros Socorros Viagem", principioAtivo: "Variados", tipo: "Kit", preco: 75.00, estoqueAtual: 10, fabricante: "Aventureiro Seguro", promocaoAtiva: 1, fornecedor_id: FORNECEDOR_EQUIPA_HOSPITALAR },
    { nome: "Suplemento Pré-Treino Foco", principioAtivo: "Cafeína + Beta-Alanina", tipo: "Pó", preco: 80.00, estoqueAtual: 20, fabricante: "Força Máxima", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_VITA_SUPRIMENTOS },
    { nome: "Máscara de Hidratação Profunda", principioAtivo: "Óleo de Argan", tipo: "Máscara Capilar", preco: 42.00, estoqueAtual: 35, fabricante: "Cabelos de Diva", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_AROMA_ESSENCIAL },
    { nome: "Anti-Ácido Menta Fresca", principioAtivo: "Hidróxido de Alumínio", tipo: "Comprimido Mastigável", preco: 9.50, estoqueAtual: 90, fabricante: "Estômago Feliz", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_GLOBAL_PHARMA },
    { nome: "Medicamento para Ronco Silencioso", principioAtivo: "Silenciol", tipo: "Spray Nasal", preco: 55.00, estoqueAtual: 15, fabricante: "Noites Tranquilas", promocaoAtiva: 0, fornecedor_id: FORNECEDOR_PHARMA_DISTRIBUIDORA }
];

db.serialize(() => {
    // Adicionado fornecedor_id ao INSERT
    const stmt = db.prepare(
        `INSERT OR IGNORE INTO medicamentos (nome, principioAtivo, tipo, preco, estoqueAtual, fabricante, promocaoAtiva, fornecedor_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    medicamentos.forEach(med => {
        stmt.run(
            med.nome,
            med.principioAtivo,
            med.tipo,
            med.preco,
            med.estoqueAtual,
            med.fabricante,
            med.promocaoAtiva,
            med.fornecedor_id, // Incluído aqui
            (err) => {
                if(err) {
                    console.error(`Erro ao inserir ${med.nome}:`, err.message);
                }
            }
        );
    });

    stmt.finalize((err) => {
        if(err) {
            console.error("Erro ao finalizar statement:", err.message);
        } else {
            console.log("💊 Medicamentos verificados/adicionados com sucesso!");
        }
        db.close((closeErr) => { if(closeErr) console.error("Erro ao fechar DB:", closeErr.message); }); 
    });
});