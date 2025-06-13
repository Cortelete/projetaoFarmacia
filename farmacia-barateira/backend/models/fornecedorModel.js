// Conteúdo de fornecedorModel.js
const db = require("../database/db");

const Fornecedor = {
    // Função para listar todos os fornecedores (AGORA COM TODOS OS NOVOS CAMPOS)
    listarTodos: (callback) => {
        const sql = "SELECT id, nome, nomeFantasia, razaoSocial, cnpj, email, telefone, endereco, categorias FROM fornecedores";
        db.all(sql, callback);
    },

    // Função para buscar um fornecedor por ID (AGORA COM TODOS OS NOVOS CAMPOS)
    buscarPorId: (id, callback) => {
        const sql = "SELECT id, nome, nomeFantasia, razaoSocial, cnpj, email, telefone, endereco, categorias FROM fornecedores WHERE id = ?";
        db.get(sql, [id], callback);
    },

    // Função para cadastrar um novo fornecedor (AGORA COM TODOS OS NOVOS CAMPOS)
    cadastrar: (fornecedor, callback) => {
        const sql = `INSERT INTO fornecedores 
            (nome, nomeFantasia, razaoSocial, cnpj, email, telefone, endereco, categorias) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            fornecedor.nome, 
            fornecedor.nomeFantasia, 
            fornecedor.razaoSocial, 
            fornecedor.cnpj, 
            fornecedor.email, 
            fornecedor.telefone, 
            fornecedor.endereco, 
            fornecedor.categorias // Espera que já seja um JSON string
        ];
        db.run(sql, params, function (err) {
            if (err) {
                console.error("Erro ao cadastrar fornecedor:", err.message);
                if (err.message.includes("UNIQUE constraint failed: fornecedores.cnpj")) {
                    return callback(new Error("CNPJ já cadastrado."));
                }
                return callback(err);
            }
            callback(null, { id: this.lastID });
        });
    },

    // Função para atualizar um fornecedor (AGORA COM TODOS OS NOVOS CAMPOS)
    atualizar: (id, dadosFornecedor, callback) => {
        let fields = [];
        let params = [];

        if (dadosFornecedor.nome) { fields.push("nome = ?"); params.push(dadosFornecedor.nome); }
        if (dadosFornecedor.nomeFantasia !== undefined) { fields.push("nomeFantasia = ?"); params.push(dadosFornecedor.nomeFantasia); }
        if (dadosFornecedor.razaoSocial !== undefined) { fields.push("razaoSocial = ?"); params.push(dadosFornecedor.razaoSocial); }
        if (dadosFornecedor.cnpj) { fields.push("cnpj = ?"); params.push(dadosFornecedor.cnpj); }
        if (dadosFornecedor.email !== undefined) { fields.push("email = ?"); params.push(dadosFornecedor.email); }
        if (dadosFornecedor.telefone !== undefined) { fields.push("telefone = ?"); params.push(dadosFornecedor.telefone); }
        if (dadosFornecedor.endereco !== undefined) { fields.push("endereco = ?"); params.push(dadosFornecedor.endereco); }
        if (dadosFornecedor.categorias !== undefined) { fields.push("categorias = ?"); params.push(dadosFornecedor.categorias); } // Espera JSON string

        if (fields.length === 0) {
            return callback(new Error("Nenhum campo para atualizar fornecido."));
        }

        params.push(id);
        const sql = `UPDATE fornecedores SET ${fields.join(", ")} WHERE id = ?`;

        db.run(sql, params, function(err) {
            if (err) {
                console.error("Erro ao atualizar fornecedor:", err.message);
                if (err.message.includes("UNIQUE constraint failed: fornecedores.cnpj")) {
                    return callback(new Error("CNPJ já cadastrado para outro fornecedor."));
                }
                return callback(err);
            }
            callback(null, { changes: this.changes });
        });
    },

    // Função para deletar um fornecedor (sem alterações)
    deletar: (id, callback) => {
        const sql = "DELETE FROM fornecedores WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                console.error("Erro ao deletar fornecedor:", err.message);
                if (err.message.includes("FOREIGN KEY constraint failed")) {
                    return callback(new Error("Não é possível deletar o fornecedor pois ele possui compras ou medicamentos associados."));
                }
                return callback(err);
            }
            callback(null, { changes: this.changes });
        });
    }
};

module.exports = Fornecedor;