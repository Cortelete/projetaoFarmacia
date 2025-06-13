// Conteúdo CORRIGIDO E SEGURO para /models/usuarioModel.js

const db = require("../database/db");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Fator de custo para a criptografia

const Usuario = {
    // Função para autenticar usuário com senha criptografada
    autenticar: (email, senha, callback) => {
        const sql = "SELECT * FROM usuarios WHERE email = ?";
        db.get(sql, [email], (err, usuario) => {
            if (err) {
                return callback(err);
            }
            if (!usuario) {
                // Usuário não encontrado, retorna null para o controller tratar como "Credenciais inválidas"
                return callback(null, null);
            }

            // Compara a senha fornecida com o hash salvo no banco
            bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
                if (err) {
                    return callback(err);
                }
                if (isMatch) {
                    // Senha correta, retorna os dados do usuário (sem a senha)
                    const { senha, ...usuarioSemSenha } = usuario;
                    callback(null, usuarioSemSenha);
                } else {
                    // Senha incorreta
                    callback(null, null);
                }
            });
        });
    },

    // Função para cadastrar novo usuário com senha criptografada
    cadastrar: (usuario, callback) => {
        const { nome, email, senha, cargo = "Funcionário" } = usuario;

        // Gera o hash da senha antes de salvar
        bcrypt.hash(senha, saltRounds, (err, hash) => {
            if (err) {
                return callback(err);
            }
            const sql = "INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)";
            db.run(sql, [nome, email, hash, cargo], function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null, { id: this.lastID });
            });
        });
    },

    // Demais funções (buscarPorId, listarTodos, etc.) permanecem as mesmas,
    // mas garantimos que elas não retornem a senha.
    buscarPorId: (id, callback) => {
        const sql = "SELECT id, nome, email, cargo FROM usuarios WHERE id = ?";
        db.get(sql, [id], callback);
    },

    listarTodos: (callback) => {
        const sql = "SELECT id, nome, email, cargo FROM usuarios";
        db.all(sql, callback);
    },

    atualizar: (id, dadosUsuario, callback) => {
        let fields = [];
        let params = [];
        if (dadosUsuario.nome) { fields.push("nome = ?"); params.push(dadosUsuario.nome); }
        if (dadosUsuario.email) { fields.push("email = ?"); params.push(dadosUsuario.email); }
        if (dadosUsuario.cargo) { fields.push("cargo = ?"); params.push(dadosUsuario.cargo); }

        // Lógica para atualizar senha (deve ser tratada com cuidado)
        if (dadosUsuario.senha) {
            bcrypt.hash(dadosUsuario.senha, saltRounds, (err, hash) => {
                if (err) return callback(err);
                
                fields.push("senha = ?");
                params.push(hash);
                
                // Continua a execução após hashear a senha
                runUpdate(); 
            });
        } else {
            runUpdate();
        }

        function runUpdate() {
            if (fields.length === 0) {
                return callback(new Error("Nenhum campo para atualizar fornecido."));
            }
            params.push(id);
            const sql = `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`;
            db.run(sql, params, function (err) {
                if (err) return callback(err);
                callback(null, { changes: this.changes });
            });
        }
    },

    deletar: (id, callback) => {
        const sql = "DELETE FROM usuarios WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) return callback(err);
            callback(null, { changes: this.changes });
        });
    }
};

module.exports = Usuario;