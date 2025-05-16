const db = require('./database/db');

const medicamentosExemplo = [
  {
    principio_ativo: "Dipirona",
    nome_fantasia: "Novalgina",
    fabricante: "Bayer",
    preco_compra: 1.0,
    preco_venda: 1.5,
    estoque: 100,
    estoque_minimo: 10
  },
  {
    principio_ativo: "Paracetamol",
    nome_fantasia: "Tylenol",
    fabricante: "Johnson & Johnson",
    preco_compra: 0.8,
    preco_venda: 1.2,
    estoque: 200,
    estoque_minimo: 20
  },
  {
    principio_ativo: "Amoxicilina",
    nome_fantasia: "Amoxil",
    fabricante: "GlaxoSmithKline",
    preco_compra: 2.0,
    preco_venda: 2.8,
    estoque: 150,
    estoque_minimo: 15
  },
  { principio_ativo: "Dipirona", nome_fantasia: "Novalgina", fabricante: "Bayer", preco_compra: 1.0, preco_venda: 1.5, estoque: 100, estoque_minimo: 10 },
  { principio_ativo: "Paracetamol", nome_fantasia: "Tylenol", fabricante: "Johnson & Johnson", preco_compra: 0.8, preco_venda: 1.2, estoque: 200, estoque_minimo: 20 },
  { principio_ativo: "Amoxicilina", nome_fantasia: "Amoxil", fabricante: "GlaxoSmithKline", preco_compra: 2.0, preco_venda: 2.8, estoque: 150, estoque_minimo: 15 },
  { principio_ativo: "Ibuprofeno", nome_fantasia: "Advil", fabricante: "Pfizer", preco_compra: 1.5, preco_venda: 2.3, estoque: 120, estoque_minimo: 12 },
  { principio_ativo: "Cloridrato de sertralina", nome_fantasia: "Zoloft", fabricante: "Pfizer", preco_compra: 5.0, preco_venda: 6.5, estoque: 80, estoque_minimo: 8 },
  { principio_ativo: "Losartana", nome_fantasia: "Cozaar", fabricante: "Merck", preco_compra: 3.2, preco_venda: 4.5, estoque: 90, estoque_minimo: 9 },
  { principio_ativo: "Omeprazol", nome_fantasia: "Losec", fabricante: "AstraZeneca", preco_compra: 2.5, preco_venda: 3.5, estoque: 110, estoque_minimo: 11 },
  { principio_ativo: "Metformina", nome_fantasia: "Glifage", fabricante: "Merck", preco_compra: 1.8, preco_venda: 2.6, estoque: 130, estoque_minimo: 13 },
  { principio_ativo: "Ranitidina", nome_fantasia: "Zantac", fabricante: "Sanofi", preco_compra: 2.0, preco_venda: 2.8, estoque: 95, estoque_minimo: 9 },
  { principio_ativo: "Diclofenaco", nome_fantasia: "Voltaren", fabricante: "Novartis", preco_compra: 2.3, preco_venda: 3.4, estoque: 105, estoque_minimo: 10 },
  { principio_ativo: "Cetirizina", nome_fantasia: "Zyrtec", fabricante: "UCB Pharma", preco_compra: 1.4, preco_venda: 2.0, estoque: 140, estoque_minimo: 14 },
  { principio_ativo: "Fluoxetina", nome_fantasia: "Prozac", fabricante: "Eli Lilly", preco_compra: 4.5, preco_venda: 5.8, estoque: 70, estoque_minimo: 7 },
  { principio_ativo: "Clonazepam", nome_fantasia: "Rivotril", fabricante: "Roche", preco_compra: 6.0, preco_venda: 7.5, estoque: 60, estoque_minimo: 6 },
  { principio_ativo: "Salbutamol", nome_fantasia: "Ventolin", fabricante: "GlaxoSmithKline", preco_compra: 3.0, preco_venda: 4.2, estoque: 100, estoque_minimo: 10 },
  { principio_ativo: "Furosemida", nome_fantasia: "Lasix", fabricante: "Sanofi", preco_compra: 1.7, preco_venda: 2.4, estoque: 125, estoque_minimo: 12 }
  // Adicione mais remédios aqui seguindo o mesmo formato
];

// Função para inserir um medicamento
function inserirMedicamento(med, callback) {
  const { principio_ativo, nome_fantasia, fabricante, preco_compra, preco_venda, estoque, estoque_minimo } = med;
  db.run(`INSERT INTO medicamentos (principio_ativo, nome_fantasia, fabricante, preco_compra, preco_venda, estoque, estoque_minimo) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [principio_ativo, nome_fantasia, fabricante, preco_compra, preco_venda, estoque, estoque_minimo],
    callback);
}

// Inserir todos os medicamentos de exemplo sequencialmente
function popularBanco(lista, i = 0) {
  if (i >= lista.length) {
    console.log('Banco populado com sucesso!');
    db.close();
    return;
  }
  inserirMedicamento(lista[i], (err) => {
    if (err) {
      console.error('Erro ao inserir:', err);
    } else {
      console.log('Inserido:', lista[i].nome_fantasia);
    }
    popularBanco(lista, i + 1);
  });
}

popularBanco(medicamentosExemplo);
