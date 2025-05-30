const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuarioModel");

router.post("/", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  Usuario.autenticar(email, senha, (err, usuario) => {
    if (err) {
      console.error("Erro ao autenticar usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao autenticar." });
    }
    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    res.json({ mensagem: "Login realizado com sucesso", usuario });
  });
});

module.exports = router;
