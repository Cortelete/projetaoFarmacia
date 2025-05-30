const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Import db para transações

// Importar os modelos necessários
const Venda = require("../models/vendaModel");
const VendaItens = require("../models/vendaItensModel");
const Medicamento = require("../models/medicamentoModel");

// Rota para LISTAR todas as vendas (GET /api/vendas)
router.get("/", (req, res) => {
  Venda.listarTodas((err, vendas) => {
    if (err) {
      console.error("Erro ao listar vendas:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar vendas." });
    }
    res.json(vendas);
  });
});

// Rota para BUSCAR uma venda por ID e seus itens (GET /api/vendas/:id)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Venda.buscarPorId(id, (err, venda) => {
    if (err) {
      console.error(`Erro ao buscar venda ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar venda." });
    }
    if (!venda) {
      return res.status(404).json({ erro: "Venda não encontrada." });
    }
    // Após encontrar a venda, buscar os itens dela
    VendaItens.listarPorVendaId(id, (errItens, itens) => {
      if (errItens) {
        console.error(`Erro ao buscar itens da venda ${id}:`, errItens);
        // Retorna a venda mesmo se houver erro nos itens, mas avisa
        return res.status(500).json({ erro: "Erro ao buscar itens da venda.", venda });
      }
      // Adiciona os itens ao objeto da venda
      venda.itens = itens;
      res.json(venda);
    });
  });
});

// Rota para CADASTRAR uma nova venda (POST /api/vendas)
// Esta rota é transacional: registra a venda, os itens e atualiza o estoque.
router.post("/", async (req, res) => {
  const { cliente_id, usuario_id, itens } = req.body; // Espera um array de itens: [{medicamento_id, quantidade, precoUnitario}, ...]

  // Validações básicas
  if (!usuario_id || !itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: "Dados da venda inválidos. Usuário e lista de itens são obrigatórios." });
  }

  let valorTotalVenda = 0;
  try {
    // 1. Validar itens e calcular valor total preliminar
    for (const item of itens) {
      if (!item.medicamento_id || !item.quantidade || item.quantidade <= 0 || item.precoUnitario === undefined || item.precoUnitario < 0) {
        throw new Error("Item inválido na lista: verifique medicamento_id, quantidade e precoUnitario.");
      }
      valorTotalVenda += item.quantidade * item.precoUnitario;
    }

    // Formatando valor total para duas casas decimais
    valorTotalVenda = parseFloat(valorTotalVenda.toFixed(2));

    // 2. Iniciar transação no banco de dados
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // 3. Cadastrar a venda principal
      Venda.cadastrar({ cliente_id, usuario_id, valorTotal: valorTotalVenda }, (errVenda, resultVenda) => {
        if (errVenda) {
          console.error("Erro ao cadastrar venda (transação):", errVenda);
          db.run("ROLLBACK");
          return res.status(500).json({ erro: "Erro ao iniciar o registro da venda.", detalhe: errVenda.message });
        }

        const vendaId = resultVenda.id;
        let itensProcessados = 0;
        let erroItem = null;

        // 4. Cadastrar cada item da venda e atualizar estoque
        itens.forEach(item => {
          // Cadastra o item na tabela venda_itens
          VendaItens.cadastrar({ ...item, venda_id: vendaId }, (errItem) => {
            if (errItem) {
              erroItem = errItem;
              console.error("Erro ao cadastrar item da venda (transação):", errItem);
              return; // Sai do callback do item, mas não interrompe o forEach diretamente
            }

            // Atualiza (diminui) o estoque do medicamento
            Medicamento.atualizarEstoque(item.medicamento_id, -item.quantidade, (errEstoque) => {
              if (errEstoque) {
                erroItem = errEstoque;
                console.error("Erro ao atualizar estoque (transação):", errEstoque);
                return; // Sai do callback do estoque
              }

              itensProcessados++;

              // 5. Finalizar transação após processar todos os itens
              if (itensProcessados === itens.length) {
                if (erroItem) {
                  // Se houve erro em algum item/estoque, faz rollback
                  db.run("ROLLBACK");
                  console.error("Rollback devido a erro no item/estoque:", erroItem);
                  // Tenta dar uma mensagem mais específica
                  const msgErro = erroItem.message.includes("estoque") ? "Erro ao atualizar estoque (possivelmente insuficiente)." : "Erro ao registrar item da venda.";
                  return res.status(500).json({ erro: msgErro, detalhe: erroItem.message });
                } else {
                  // Se tudo deu certo, faz commit
                  db.run("COMMIT");
                  return res.status(201).json({ mensagem: "Venda registrada com sucesso!", vendaId: vendaId });
                }
              }
            }); // Fim callback atualizarEstoque
          }); // Fim callback cadastrar VendaItens
           // Se houve erro no VendaItens.cadastrar, interrompe o loop (idealmente)
           if (erroItem) {
               // Em um cenário real, seria melhor usar Promises/async/await para controlar o fluxo
               // Aqui, apenas paramos de processar mais itens se um erro já ocorreu.
               return;
           }
        }); // Fim forEach itens

        // Se o loop terminou e houve erro em algum item (detectado fora do callback)
        if (erroItem && itensProcessados < itens.length) {
             db.run("ROLLBACK");
             console.error("Rollback final devido a erro não capturado no loop:", erroItem);
             const msgErro = erroItem.message.includes("estoque") ? "Erro ao atualizar estoque (possivelmente insuficiente)." : "Erro ao registrar item da venda.";
             return res.status(500).json({ erro: msgErro, detalhe: erroItem.message });
        }

      }); // Fim callback cadastrar Venda
    }); // Fim db.serialize

  } catch (error) {
    // Captura erros de validação síncrona (antes da transação)
    console.error("Erro de validação pré-transação:", error);
    return res.status(400).json({ erro: error.message });
  }
});

// Rota para DELETAR uma venda por ID (DELETE /api/vendas/:id)
// ATENÇÃO: Deletar a venda também deletará os itens (ON DELETE CASCADE).
// A lógica de RESTAURAR o estoque NÃO está implementada aqui.
// Implementar a restauração de estoque exigiria buscar os itens ANTES de deletar.
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // TODO: Implementar lógica de restauração de estoque se necessário.
  // 1. Buscar itens da venda (VendaItens.listarPorVendaId)
  // 2. Iniciar transação
  // 3. Para cada item, atualizar estoque (Medicamento.atualizarEstoque com quantidade positiva)
  // 4. Deletar a venda (Venda.deletar)
  // 5. Commit ou Rollback

  // Implementação simples (sem restauração de estoque):
  Venda.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar venda ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao deletar venda." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Venda não encontrada para deleção." });
    }
    res.json({ mensagem: "Venda deletada com sucesso! (Estoque não foi restaurado automaticamente)" });
  });
});

// Rota PUT para atualizar venda geralmente não é necessária ou é muito restrita.
// Se precisar, adicionar aqui.

module.exports = router;

