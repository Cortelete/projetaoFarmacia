// Conteúdo de /home/ubuntu/populaMedicamentos_atualizado.js
const db = require("./database/db");

const medicamentos = [
  {
    nome: "Dorflexol Extra Power",
    principioAtivo: "Flexina Dorada",
    tipo: "Manipulado",
    preco: 19.9,
    estoqueAtual: 42,
    fabricante: "Farmabizarra",
    promocaoAtiva: 0 // Adicionado
  },
  {
    nome: "Xurumelol",
    principioAtivo: "Bizarritina",
    tipo: "Experimental",
    preco: 7.4,
    estoqueAtual: 25,
    fabricante: "Xurumela Labs",
    promocaoAtiva: 1 // Adicionado (exemplo)
  },
  {
    nome: "Relaxaço 3000",
    principioAtivo: "Tranquiletanol",
    tipo: "Fitoterápico",
    preco: 14.3,
    estoqueAtual: 12,
    fabricante: "Relaxmed",
    promocaoAtiva: 0
  },
  {
    nome: "Antidorzin Plus",
    principioAtivo: "Dorfinax",
    tipo: "Genérico",
    preco: 9.8,
    estoqueAtual: 33,
    fabricante: "SofreMed",
    promocaoAtiva: 0
  },
  {
    nome: "Tossebane Forte",
    principioAtivo: "Tossolito",
    tipo: "Comprimido",
    preco: 6.2,
    estoqueAtual: 18,
    fabricante: "Gargameds",
    promocaoAtiva: 0
  },
  {
    nome: "Desmaionix",
    principioAtivo: "Caideitadox",
    tipo: "Injetável",
    preco: 32.5,
    estoqueAtual: 7,
    fabricante: "Lab DormeDuro",
    promocaoAtiva: 0
  },
  {
    nome: "Olhovidex",
    principioAtivo: "Retinolizante",
    tipo: "Colírio",
    preco: 11.1,
    estoqueAtual: 22,
    fabricante: "Visomed",
    promocaoAtiva: 0
  },
  {
    nome: "Naridelícia",
    principioAtivo: "Cheirenzina",
    tipo: "Spray nasal",
    preco: 8.9,
    estoqueAtual: 15,
    fabricante: "SinusPop",
    promocaoAtiva: 1 // Adicionado (exemplo)
  },
  {
    nome: "Remedazol Turbo X",
    principioAtivo: "Placebina Ultra",
    tipo: "Cápsula",
    preco: 23.7,
    estoqueAtual: 40,
    fabricante: "EfeitoPlacebo Corp",
    promocaoAtiva: 0
  },
  {
    nome: "Chorumino",
    principioAtivo: "Emotivex",
    tipo: "Comprimido",
    preco: 5.5,
    estoqueAtual: 60,
    fabricante: "Dramédicos Unidos",
    promocaoAtiva: 0
  },
  {
    nome: "Febriloloco",
    principioAtivo: "Calorazol",
    tipo: "Xarope",
    preco: 10.6,
    estoqueAtual: 28,
    fabricante: "Termobizarro",
    promocaoAtiva: 0
  },
  {
    nome: "Antipancadol",
    principioAtivo: "Pancanina",
    tipo: "Injetável",
    preco: 29.9,
    estoqueAtual: 5,
    fabricante: "Barrigamed",
    promocaoAtiva: 0
  },
  {
    nome: "SussaVida",
    principioAtivo: "Zenfluor",
    tipo: "Comprimido",
    preco: 12.4,
    estoqueAtual: 20,
    fabricante: "Calmitex Pharma",
    promocaoAtiva: 0
  }
];

// Usar db.serialize para garantir a ordem
db.serialize(() => {
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO medicamentos (nome, principioAtivo, tipo, preco, estoqueAtual, fabricante, promocaoAtiva) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  medicamentos.forEach(med => {
    stmt.run(
      med.nome,
      med.principioAtivo,
      med.tipo,
      med.preco,
      med.estoqueAtual,
      med.fabricante,
      med.promocaoAtiva // Incluído
    , (err) => {
        if(err) {
            console.error(`Erro ao inserir ${med.nome}:`, err.message);
        }
    });
  });

  stmt.finalize((err) => {
      if(err) {
          console.error("Erro ao finalizar statement:", err.message);
      } else {
          console.log("💊 Medicamentos esquisitos (ou nem tanto) verificados/adicionados com sucesso!");
      }
      // Fechar o banco aqui se este script for executado separadamente
      // db.close((closeErr) => { if(closeErr) console.error("Erro ao fechar DB:", closeErr.message); }); 
  });
});