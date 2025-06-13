// Conteúdo CORRIGIDO E SEGURO para /routes/login.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarioModel");

// Defina uma chave secreta. Em um projeto real, isso viria de uma variável de ambiente.
const JWT_SECRET = "seu_segredo_super_secreto_e_dificil_de_adivinhar";

router.post("/", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    Usuario.autenticar(email, senha, (err, usuario) => {
        if (err) {
            return res.status(500).json({ erro: "Erro interno no servidor." });
        }
        if (!usuario) {
            return res.status(401).json({ erro: "Credenciais inválidas." });
        }

        // Se o usuário for autenticado, crie o token JWT
        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, cargo: usuario.cargo }, // Carga útil do token
            JWT_SECRET, // Chave secreta
            { expiresIn: '8h' } // Opções, como o tempo de expiração
        );

        // Envia o token e os dados do usuário (sem a senha) como resposta
        res.json({ 
            mensagem: "Login realizado com sucesso", 
            token: token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo
            }
        });
    });
});

module.exports = router;