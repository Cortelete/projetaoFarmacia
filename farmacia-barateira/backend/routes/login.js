const express = require("express");
const router = express.Router();
// Certifique-se de que o caminho para o modelo atualizado está correto
const Usuario = require("../models/usuarioModel"); // <- Atualizado para usar o novo nome ou caminho

router.post("/", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  Usuario.autenticar(email, senha, (err, usuario) => {
    if (err) {
      console.error("Erro interno ao autenticar usuário:", err);
      return res.status(500).json({ erro: "Erro interno do servidor ao autenticar." });
    }
    if (!usuario) {
      // Usuário não encontrado ou senha incorreta
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    // Login bem-sucedido, retorna os dados do usuário (sem a senha)
    // O modelo atualizado já retorna id, nome, email, cargo
    res.json({ mensagem: "Login realizado com sucesso", usuario });
  });
});

module.exports = router;

