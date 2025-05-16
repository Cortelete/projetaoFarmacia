const db = require('./database/db');

const medicamentos = [
  {
    nome: 'Dorflexol Extra Power',
    principioAtivo: 'Flexina Dorada',
    tipo: 'Manipulado',
    preco: 19.9,
    estoqueAtual: 42,
    fabricante: 'Farmabizarra'
  },
  {
    nome: 'Xurumelol',
    principioAtivo: 'Bizarritina',
    tipo: 'Experimental',
    preco: 7.4,
    estoqueAtual: 25,
    fabricante: 'Xurumela Labs'
  },
  {
    nome: 'Relaxaço 3000',
    principioAtivo: 'Tranquiletanol',
    tipo: 'Fitoterápico',
    preco: 14.3,
    estoqueAtual: 12,
    fabricante: 'Relaxmed'
  },
  {
    nome: 'Antidorzin Plus',
    principioAtivo: 'Dorfinax',
    tipo: 'Genérico',
    preco: 9.8,
    estoqueAtual: 33,
    fabricante: 'SofreMed'
  },
  {
    nome: 'Tossebane Forte',
    principioAtivo: 'Tossolito',
    tipo: 'Comprimido',
    preco: 6.2,
    estoqueAtual: 18,
    fabricante: 'Gargameds'
  },
  {
    nome: 'Desmaionix',
    principioAtivo: 'Caideitadox',
    tipo: 'Injetável',
    preco: 32.5,
    estoqueAtual: 7,
    fabricante: 'Lab DormeDuro'
  },
  {
    nome: 'Olhovidex',
    principioAtivo: 'Retinolizante',
    tipo: 'Colírio',
    preco: 11.1,
    estoqueAtual: 22,
    fabricante: 'Visomed'
  },
  {
    nome: 'Naridelícia',
    principioAtivo: 'Cheirenzina',
    tipo: 'Spray nasal',
    preco: 8.9,
    estoqueAtual: 15,
    fabricante: 'SinusPop'
  },
  {
    nome: 'Remedazol Turbo X',
    principioAtivo: 'Placebina Ultra',
    tipo: 'Cápsula',
    preco: 23.7,
    estoqueAtual: 40,
    fabricante: 'EfeitoPlacebo Corp'
  },
  {
    nome: 'Chorumino',
    principioAtivo: 'Emotivex',
    tipo: 'Comprimido',
    preco: 5.5,
    estoqueAtual: 60,
    fabricante: 'Dramédicos Unidos'
  },
  {
    nome: 'Febriloloco',
    principioAtivo: 'Calorazol',
    tipo: 'Xarope',
    preco: 10.6,
    estoqueAtual: 28,
    fabricante: 'Termobizarro'
  },
  {
    nome: 'Antipancadol',
    principioAtivo: 'Pancanina',
    tipo: 'Injetável',
    preco: 29.9,
    estoqueAtual: 5,
    fabricante: 'Barrigamed'
  },
  {
    nome: 'SussaVida',
    principioAtivo: 'Zenfluor',
    tipo: 'Comprimido',
    preco: 12.4,
    estoqueAtual: 20,
    fabricante: 'Calmitex Pharma'
  }
];

medicamentos.forEach(med => {
  db.run(
    `INSERT INTO medicamentos (nome, principioAtivo, tipo, preco, estoqueAtual, fabricante) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [med.nome, med.principioAtivo, med.tipo, med.preco, med.estoqueAtual, med.fabricante]
  );
});

console.log('💊 Medicamentos esquisitos adicionados com sucesso!');
