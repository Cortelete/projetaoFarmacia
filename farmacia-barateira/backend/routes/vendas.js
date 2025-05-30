const express = require("express");
const router = express.Router();
const db = require("../database/db"); // Import db para transações
const { verifyToken, checkRole } = require("../middleware/authMiddleware"); // Importar middleware

// Importar os modelos necessários
const Venda = require("../models/vendaModel");
const VendaItens = require("../models/vendaItensModel");
const Medicamento = require("../models/medicamentoModel");

// --- Permissões Definidas ---
// Listar/Buscar: Gerente, Administrador (Acesso a dados financeiros)
// Cadastrar: Funcionário, Gerente, Administrador (Operação de venda)
// Deletar: Administrador (Operação sensível, sem restauração de estoque)

// Rota para LISTAR todas as vendas (GET /api/vendas)
router.get("/", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  Venda.listarTodas((err, vendas) => {
    if (err) {
      console.error("Erro ao listar vendas:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar vendas." });
    }
    res.json(vendas);
  });
});

// Rota para BUSCAR uma venda por ID e seus itens (GET /api/vendas/:id)
router.get("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => {
  const { id } = req.params;
  Venda.buscarPorId(id, (err, venda) => {
    if (err) {
      console.error(`Erro ao buscar venda ${id}:`, err);
      return res.status(500).json({ erro: "Erro interno ao buscar venda." });
    }
    if (!venda) {
      return res.status(404).json({ erro: "Venda não encontrada." });
    }
    VendaItens.listarPorVendaId(id, (errItens, itens) => {
      if (errItens) {
        console.error(`Erro ao buscar itens da venda ${id}:`, errItens);
        return res.status(500).json({ erro: "Erro ao buscar itens da venda.", venda });
      }
      venda.itens = itens;
      res.json(venda);
    });
  });
});

// Rota para CADASTRAR uma nova venda (POST /api/vendas)
router.post("/", verifyToken, checkRole(["Funcionario", "Gerente", "Administrador"]), async (req, res) => {
  // Adiciona o usuario_id do token se não for fornecido (ou valida se é o mesmo)
  const usuario_id_token = req.user.id; // ID do usuário logado vindo do token
  let { cliente_id, usuario_id, itens } = req.body;

  // Se usuario_id não veio no body, usa o do token. Se veio, idealmente deveria ser o mesmo.
  // Por simplicidade, vamos usar o do token como o responsável pela venda.
  usuario_id = usuario_id_token;

  if (!usuario_id || !itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: "Dados da venda inválidos. Usuário (implícito) e lista de itens são obrigatórios." });
  }

  let valorTotalVenda = 0;
  try {
    for (const item of itens) {
      if (!item.medicamento_id || !item.quantidade || item.quantidade <= 0 || item.precoUnitario === undefined || item.precoUnitario < 0) {
        throw new Error("Item inválido na lista: verifique medicamento_id, quantidade e precoUnitario.");
      }
      valorTotalVenda += item.quantidade * item.precoUnitario;
    }
    valorTotalVenda = parseFloat(valorTotalVenda.toFixed(2));

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      Venda.cadastrar({ cliente_id, usuario_id, valorTotal: valorTotalVenda }, (errVenda, resultVenda) => {
        if (errVenda) {
          console.error("Erro ao cadastrar venda (transação):", errVenda);
          db.run("ROLLBACK");
          return res.status(500).json({ erro: "Erro ao iniciar o registro da venda.", detalhe: errVenda.message });
        }

        const vendaId = resultVenda.id;
        let itensProcessados = 0;
        let erroItem = null;

        itens.forEach(item => {
          if (erroItem) return; // Otimização: não processa mais se já deu erro

          VendaItens.cadastrar({ ...item, venda_id: vendaId }, (errItem) => {
            if (erroItem) return; // Evita processamento concorrente após erro
            if (errItem) {
              erroItem = errItem;
              console.error("Erro ao cadastrar item da venda (transação):", errItem);
              db.run("ROLLBACK"); // Rollback imediato ao detectar erro
              return res.status(500).json({ erro: "Erro ao registrar item da venda.", detalhe: erroItem.message });
            }

            Medicamento.atualizarEstoque(item.medicamento_id, -item.quantidade, (errEstoque) => {
              if (erroItem) return; // Evita processamento concorrente após erro
              if (errEstoque) {
                erroItem = errEstoque;
                console.error("Erro ao atualizar estoque (transação):", errEstoque);
                db.run("ROLLBACK"); // Rollback imediato ao detectar erro
                const msgErro = errEstoque.message.includes("insufficient stock") || errEstoque.message.includes("CHECK constraint failed")
                                ? "Erro ao atualizar estoque (quantidade insuficiente)."
                                : "Erro ao atualizar estoque.";
                return res.status(409).json({ erro: msgErro, detalhe: errEstoque.message }); // 409 Conflict para estoque
              }

              itensProcessados++;
              if (itensProcessados === itens.length && !erroItem) {
                db.run("COMMIT");
                return res.status(201).json({ mensagem: "Venda registrada com sucesso!", vendaId: vendaId });
              }
            });
          });
        });
      });
    });

  } catch (error) {
    console.error("Erro de validação pré-transação:", error);
    return res.status(400).json({ erro: error.message });
  }
});

// Rota para DELETAR uma venda por ID (DELETE /api/vendas/:id)
router.delete("/:id", verifyToken, checkRole(["Administrador"]), (req, res) => {
  const { id } = req.params;

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

module.exports = router;

