// Conteúdo de populaFornecedores.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "farmacia.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados para popular fornecedores:", err.message);
    } else {
        console.log("Conectado ao banco de dados para popular fornecedores.");
    }
});

const fornecedores = [
    { nome: "Pharma Distribuidora", nomeFantasia: "Pharma Dist.", razaoSocial: "Pharma Distribuidora Ltda.", cnpj: "12.345.678/0001-90", email: "contato@pharmadistribuidora.com", telefone: "(11) 3456-7890", endereco: "Av. Industrial, 1000 - São Paulo/SP", categorias: JSON.stringify(["Medicamentos", "Cosméticos"]) },
    { nome: "MediTech Equipamentos", nomeFantasia: "MediTech", razaoSocial: "MediTech Equipamentos S.A.", cnpj: "98.765.432/0001-10", email: "vendas@meditech.com.br", telefone: "(11) 2345-6789", endereco: "Rua Tecnológica, 500 - Campinas/SP", categorias: JSON.stringify(["Equipamentos", "Instrumentos"]) },
    { nome: "NaturaPharma", nomeFantasia: "NaturaPharma", razaoSocial: "NaturaPharma Ltda.", cnpj: "45.678.901/0001-23", email: "comercial@naturapharma.com.br", telefone: "(11) 4567-8901", endereco: "Estrada Rural, 789 - Ribeirão Preto/SP", categorias: JSON.stringify(["Fitoterápicos", "Naturais"]) },
    { nome: "Global Farma", nomeFantasia: "Global Pharma", razaoSocial: "Global Pharma S.A.", cnpj: "55.555.555/0001-55", email: "contato@globalpharma.com", telefone: "(21) 9876-5432", endereco: "Rua Principal, 789 - Rio de Janeiro/RJ", categorias: JSON.stringify(["Medicamentos Genéricos", "Higiene Pessoal"]) },
    { nome: "Vita Suprimentos", nomeFantasia: "VitaSupps", razaoSocial: "Vita Suprimentos Ltda.", cnpj: "11.222.333/0001-44", email: "vendas@vitasupps.com.br", telefone: "(31) 5678-1234", endereco: "Av. do Contorno, 100 - Belo Horizonte/MG", categorias: JSON.stringify(["Suplementos", "Vitaminas"]) },
    { nome: "Cosmetic Prime", nomeFantasia: "CosmeticPrime", razaoSocial: "Cosmetic Prime Ind. e Com.", cnpj: "99.888.777/0001-66", email: "sac@cosmeticprime.com", telefone: "(47) 1234-5678", endereco: "Rua Bela, 456 - Florianópolis/SC", categorias: JSON.stringify(["Cosméticos", "Cuidados com a Pele"]) },
    { nome: "Drogas Express", nomeFantasia: "DrogasX", razaoSocial: "Drogas Express Comércio", cnpj: "10.203.040/0001-01", email: "vendas@drogasx.com", telefone: "(81) 1234-0000", endereco: "Av. do Sol, 123 - Recife/PE", categorias: JSON.stringify(["Medicamentos", "Acessórios"]) },
    { nome: "Bioquímica Avançada", nomeFantasia: "BioAv", razaoSocial: "Bioquímica Avançada Ltda.", cnpj: "20.304.050/0001-02", email: "contato@bioav.com.br", telefone: "(61) 9876-5432", endereco: "Rua da Ciência, 789 - Brasília/DF", categorias: JSON.stringify(["Pesquisa", "Insumos"]) },
    { nome: "Equipa Hospitalar", nomeFantasia: "EquipaHosp", razaoSocial: "Equipamentos Hospitalares S.A.", cnpj: "30.405.060/0001-03", email: "info@equipahosp.com", telefone: "(71) 3333-4444", endereco: "Praça da Saúde, 10 - Salvador/BA", categorias: JSON.stringify(["Equipamentos", "Hospitalar"]) },
    { nome: "Saúde Plena", nomeFantasia: "SaúdePlena", razaoSocial: "Saúde Plena Distribuidora", cnpj: "40.506.070/0001-04", email: "pedidos@saudeplena.net", telefone: "(85) 5555-1111", endereco: "Travessa da Paz, 55 - Fortaleza/CE", categorias: JSON.stringify(["Medicamentos", "Saúde Geral"]) },
    { nome: "Verde Vida Orgânicos", nomeFantasia: "VerdeVida", razaoSocial: "Verde Vida Produtos Naturais", cnpj: "50.607.080/0001-05", email: "vendas@verdevida.eco.br", telefone: "(92) 2222-3333", endereco: "Alameda da Floresta, 1 - Manaus/AM", categorias: JSON.stringify(["Naturais", "Orgânicos", "Fitoterápicos"]) },
    { nome: "Fast Pharma Solutions", nomeFantasia: "FastPharma", razaoSocial: "Fast Pharma Solutions Ltda.", cnpj: "60.708.090/0001-06", email: "comercial@fastpharma.com", telefone: "(91) 4444-5555", endereco: "Rodovia da Agilidade, 20 - Belém/PA", categorias: JSON.stringify(["Medicamentos", "Logística"]) },
    { nome: "Aroma Essencial", nomeFantasia: "AromaEssencial", razaoSocial: "Aroma Essencial Cosméticos", cnpj: "70.809.010/0001-07", email: "contato@aromaessencial.com", telefone: "(48) 6666-7777", endereco: "Rua do Cheiro Bom, 77 - Florianópolis/SC", categorias: JSON.stringify(["Cosméticos", "Perfumaria"]) },
    { nome: "Medicina do Futuro", nomeFantasia: "MedFuturo", razaoSocial: "Medicina do Futuro Tech", cnpj: "80.901.020/0001-08", email: "suporte@medfuturo.com", telefone: "(19) 8888-9999", endereco: "Av. da Inovação, 300 - Campinas/SP", categorias: JSON.stringify(["Tecnologia Médica", "Software"]) },
    { nome: "Saudável Já!", nomeFantasia: "SaudavelJa", razaoSocial: "Saudável Já Suplementos", cnpj: "90.102.030/0001-09", email: "info@saudavelja.com", telefone: "(17) 1212-3434", endereco: "Rua da Vida, 1 - São José do Rio Preto/SP", categorias: JSON.stringify(["Suplementos", "Alimentos Saudáveis"]) },
    { nome: "Química Essencial", nomeFantasia: "QuimicEss", razaoSocial: "Química Essencial Indústria", cnpj: "01.020.304/0001-10", email: "vendas@quimicess.com", telefone: "(15) 5656-7878", endereco: "Estrada Industrial, 50 - Sorocaba/SP", categorias: JSON.stringify(["Insumos Farmacêuticos", "Matéria Prima"]) },
    { nome: "Limpeza Total Saúde", nomeFantasia: "LimpezaTotal", razaoSocial: "Limpeza Total Higiene", cnpj: "02.030.405/0001-11", email: "atendimento@limpezatotal.com", telefone: "(13) 9090-1010", endereco: "Rua da Limpeza, 10 - Santos/SP", categorias: JSON.stringify(["Higiene Pessoal", "Limpeza Geral"]) },
    { nome: "Dermocosméticos Alpha", nomeFantasia: "DermoAlpha", razaoSocial: "Dermocosméticos Alpha Labs", cnpj: "03.040.506/0001-12", email: "contato@dermoalpha.com", telefone: "(16) 2323-4545", endereco: "Av. da Beleza, 80 - Ribeirão Preto/SP", categorias: JSON.stringify(["Dermocosméticos", "Skincare"]) },
    { nome: "Veterinária Pharma", nomeFantasia: "VetPharma", razaoSocial: "Veterinária Pharma Ltda.", cnpj: "04.050.607/0001-13", email: "pedidos@vetpharma.com", telefone: "(14) 7878-9090", endereco: "Rua dos Bichos, 1 - Bauru/SP", categorias: JSON.stringify(["Medicamentos Veterinários", "Petshop"]) },
    { nome: "Gesso e Cia", nomeFantasia: "GessoCia", razaoSocial: "Gesso e Cia Materiais Ortopédicos", cnpj: "05.060.708/0001-14", email: "vendas@gessocia.com", telefone: "(18) 3434-5656", endereco: "Av. da Imobilização, 10 - Presidente Prudente/SP", categorias: JSON.stringify(["Ortopédicos", "Materiais Cirúrgicos"]) }
];

db.serialize(() => {
    const stmt = db.prepare(
        `INSERT OR IGNORE INTO fornecedores (nome, nomeFantasia, razaoSocial, cnpj, email, telefone, endereco, categorias) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    fornecedores.forEach(forn => {
        stmt.run(
            forn.nome,
            forn.nomeFantasia,
            forn.razaoSocial,
            forn.cnpj,
            forn.email,
            forn.telefone,
            forn.endereco,
            forn.categorias,
            (err) => {
                if(err) {
                    console.error(`Erro ao inserir fornecedor ${forn.nome}:`, err.message);
                }
            }
        );
    });

    stmt.finalize((err) => {
        if(err) {
            console.error("Erro ao finalizar statement de fornecedores:", err.message);
        } else {
            console.log("🏢 Fornecedores verificados/adicionados com sucesso!");
        }
        db.close((closeErr) => { 
            if(closeErr) console.error("Erro ao fechar DB de fornecedores:", closeErr.message); 
        }); 
    });
});