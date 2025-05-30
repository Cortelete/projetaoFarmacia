const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Import db para transações

// Importar os modelos necessários
const Compra = require("../models/compraModel");
const CompraItens = require("../models/compraItensModel");
const Medicamento = require("../models/medicamentoModel");

// Rota para LISTAR todas as compras (GET /api/compras)
router.get("/", (req, res) => {
  Compra.listarTodas((err, compras) => {
    if (err) {
      console.error("Erro ao listar compras:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar compras." });
    }
    res.json(compras);
  });
});

// Rota para BUSCAR uma compra por ID e seus itens (GET /api/compras/:id)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Compra.buscarPorId(id, (err, compra) => {
    if (err) {
      console.error(`Erro ao buscar compra ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar compra." });
    }
    if (!compra) {
      return res.status(404).json({ erro: "Compra não encontrada." });
    }
    // Após encontrar a compra, buscar os itens dela
    CompraItens.listarPorCompraId(id, (errItens, itens) => {
      if (errItens) {
        console.error(`Erro ao buscar itens da compra ${id}:`, errItens);
        return res.status(500).json({ erro: "Erro ao buscar itens da compra.", compra });
      }
      compra.itens = itens;
      res.json(compra);
    });
  });
});

// Rota para CADASTRAR uma nova compra (POST /api/compras)
// Transacional: registra compra, itens e atualiza (aumenta) estoque.
router.post("/", async (req, res) => {
  const { fornecedor_id, itens } = req.body; // Espera [{medicamento_id, quantidade, precoUnitario}, ...]

  // Validações básicas
  if (!fornecedor_id || !itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: "Dados da compra inválidos. Fornecedor e lista de itens são obrigatórios." });
  }

  let valorTotalCompra = 0;
  try {
    // 1. Validar itens e calcular valor total preliminar
    for (const item of itens) {
      if (!item.medicamento_id || !item.quantidade || item.quantidade <= 0 || item.precoUnitario === undefined || item.precoUnitario < 0) {
        throw new Error("Item inválido na lista: verifique medicamento_id, quantidade e precoUnitario.");
      }
      valorTotalCompra += item.quantidade * item.precoUnitario;
    }
    valorTotalCompra = parseFloat(valorTotalCompra.toFixed(2));

    // 2. Iniciar transação
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // 3. Cadastrar a compra principal
      Compra.cadastrar({ fornecedor_id, valorTotal: valorTotalCompra }, (errCompra, resultCompra) => {
        if (errCompra) {
          console.error("Erro ao cadastrar compra (transação):", errCompra);
          db.run("ROLLBACK");
          // Verifica erro de FK do fornecedor
          const msgErro = errCompra.message.includes("Fornecedor não encontrado") ? errCompra.message : "Erro ao iniciar o registro da compra.";
          return res.status(500).json({ erro: msgErro, detalhe: errCompra.message });
        }

        const compraId = resultCompra.id;
        let itensProcessados = 0;
        let erroItem = null;

        // 4. Cadastrar cada item da compra e atualizar estoque
        itens.forEach(item => {
          CompraItens.cadastrar({ ...item, compra_id: compraId }, (errItem) => {
            if (errItem) {
              erroItem = errItem;
              console.error("Erro ao cadastrar item da compra (transação):", errItem);
              return;
            }

            // Atualiza (aumenta) o estoque do medicamento
            Medicamento.atualizarEstoque(item.medicamento_id, item.quantidade, (errEstoque) => {
              if (errEstoque) {
                // O erro aqui pode ser medicamento_id inválido, pois não há restrição de estoque máximo
                erroItem = errEstoque;
                console.error("Erro ao atualizar estoque (compra - transação):", errEstoque);
                return;
              }

              itensProcessados++;

              // 5. Finalizar transação
              if (itensProcessados === itens.length) {
                if (erroItem) {
                  db.run("ROLLBACK");
                  console.error("Rollback devido a erro no item/estoque (compra):", erroItem);
                  const msgErro = erroItem.message.includes("Medicamento não encontrado") ? "Erro ao registrar item (medicamento não encontrado)." : "Erro ao registrar item da compra ou atualizar estoque.";
                  return res.status(500).json({ erro: msgErro, detalhe: erroItem.message });
                } else {
                  db.run("COMMIT");
                  return res.status(201).json({ mensagem: "Compra registrada com sucesso!", compraId: compraId });
                }
              }
            }); // Fim callback atualizarEstoque
          }); // Fim callback cadastrar CompraItens
          if (erroItem) return; // Para o forEach se erro
        }); // Fim forEach itens

        // Tratamento de erro fora do forEach (backup)
        if (erroItem && itensProcessados < itens.length) {
             db.run("ROLLBACK");
             console.error("Rollback final (compra) devido a erro não capturado no loop:", erroItem);
             const msgErro = erroItem.message.includes("Medicamento não encontrado") ? "Erro ao registrar item (medicamento não encontrado)." : "Erro ao registrar item da compra ou atualizar estoque.";
             return res.status(500).json({ erro: msgErro, detalhe: erroItem.message });
        }

      }); // Fim callback cadastrar Compra
    }); // Fim db.serialize

  } catch (error) {
    console.error("Erro de validação pré-transação (compra):", error);
    return res.status(400).json({ erro: error.message });
  }
});

// Rota para DELETAR uma compra por ID (DELETE /api/compras/:id)
// ATENÇÃO: Deleta a compra e seus itens (ON DELETE CASCADE).
// A lógica de REVERTER o estoque NÃO está implementada aqui.
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // TODO: Implementar lógica de reversão de estoque se necessário.

  Compra.deletar(id, (err, result) => {
    if (err) {
      console.error(`Erro ao deletar compra ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao deletar compra." });
    }
    if (result.changes === 0) {
      return res.status(404).json({ erro: "Compra não encontrada para deleção." });
    }
    res.json({ mensagem: "Compra deletada com sucesso! (Estoque não foi revertido automaticamente)" });
  });
});

// Rota PUT para atualizar compra geralmente não é necessária.

module.exports = router;

