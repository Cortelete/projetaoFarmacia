// Conteúdo de routes/fornecedores.js
const express = require("express");
const router = express.Router();
const Fornecedor = require("../models/fornecedorModel");
const { verifyToken, checkRole } = require("../middleware/authMiddleware"); // Adicionado para segurança, se você usa

// --- Permissões (ajuste conforme seu sistema de autenticação) ---
// Normalmente, a lista de fornecedores pode ser acessível a todos os funcionários.
// Adicionar/Editar/Deletar geralmente é para Gerente/Administrador.

// LISTAR todos os fornecedores (GET /api/fornecedores)
router.get("/", verifyToken, checkRole(["Funcionário", "Gerente", "Administrador"]), (req, res) => { // Exemplo de proteção
    Fornecedor.listarTodos((err, fornecedores) => {
        if (err) {
            console.error("Erro ao listar fornecedores:", err);
            return res.status(500).json({ erro: "Erro interno ao buscar fornecedores." });
        }
        res.json(fornecedores);
    });
});

// BUSCAR um fornecedor por ID (GET /api/fornecedores/:id)
router.get("/:id", verifyToken, checkRole(["Funcionário", "Gerente", "Administrador"]), (req, res) => { // Exemplo de proteção
    const { id } = req.params;
    Fornecedor.buscarPorId(id, (err, fornecedor) => {
        if (err) {
            console.error(`Erro ao buscar fornecedor ${id}:`, err);
            return res.status(500).json({ erro: "Erro interno ao buscar fornecedor." });
        }
        if (!fornecedor) {
            return res.status(404).json({ erro: "Fornecedor não encontrado." });
        }
        res.json(fornecedor);
    });
});

// CADASTRAR um novo fornecedor (POST /api/fornecedores)
router.post("/", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => { // Exemplo de proteção
    const dadosFornecedor = req.body;

    // Validações básicas (ajuste conforme a necessidade do seu negócio)
    if (!dadosFornecedor.nome || !dadosFornecedor.cnpj) {
        return res.status(400).json({ erro: "Nome e CNPJ do fornecedor são obrigatórios." });
    }
    // Adicionar validação para CNPJ formatado se necessário

    // Converta categorias de array para JSON string antes de salvar, se o frontend enviar como array
    if (Array.isArray(dadosFornecedor.categorias)) {
        dadosFornecedor.categorias = JSON.stringify(dadosFornecedor.categorias);
    } else if (typeof dadosFornecedor.categorias !== 'string') {
        dadosFornecedor.categorias = "[]"; // Garante que seja um JSON string vazio se não for array ou string
    }

    Fornecedor.cadastrar(dadosFornecedor, (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar fornecedor:", err);
            if (err.message && err.message.includes("CNPJ já cadastrado")) {
                return res.status(409).json({ erro: err.message });
            }
            return res.status(500).json({ erro: "Erro interno ao cadastrar fornecedor." });
        }
        res.status(201).json({ mensagem: "Fornecedor cadastrado com sucesso!", fornecedorId: result.id });
    });
});

// ATUALIZAR um fornecedor por ID (PUT /api/fornecedores/:id)
router.put("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => { // Exemplo de proteção
    const { id } = req.params;
    const dadosFornecedor = req.body;

    // Validações básicas (ajuste conforme a necessidade do seu negócio)
    if (dadosFornecedor.nome === "") { // Nome não pode ser vazio se for fornecido
        return res.status(400).json({ erro: "Nome do fornecedor não pode ser vazio." });
    }
    // Se o CNPJ for atualizado, adicione validação de formato e unicidade aqui
    
    // Converta categorias de array para JSON string antes de salvar, se o frontend enviar como array
    if (Array.isArray(dadosFornecedor.categorias)) {
        dadosFornecedor.categorias = JSON.stringify(dadosFornecedor.categorias);
    } // Se já for string, não precisa converter novamente

    Fornecedor.atualizar(id, dadosFornecedor, (err, result) => {
        if (err) {
            console.error(`Erro ao atualizar fornecedor ${id}:`, err);
            if (err.message && err.message.includes("CNPJ já cadastrado")) {
                return res.status(409).json({ erro: err.message });
            }
            if (err.message && err.message.includes("Nenhum campo para atualizar")) {
                return res.status(400).json({ erro: err.message });
            }
            return res.status(500).json({ erro: "Erro interno ao atualizar fornecedor." });
        }
        if (result.changes === 0) {
            return res.status(404).json({ erro: "Fornecedor não encontrado ou nenhum dado alterado." });
        }
        res.json({ mensagem: "Fornecedor atualizado com sucesso!" });
    });
});

// DELETAR um fornecedor por ID (DELETE /api/fornecedores/:id)
router.delete("/:id", verifyToken, checkRole(["Gerente", "Administrador"]), (req, res) => { // Exemplo de proteção
    const { id } = req.params;

    Fornecedor.deletar(id, (err, result) => {
        if (err) {
            console.error(`Erro ao deletar fornecedor ${id}:`, err);
            if (err.message && err.message.includes("compras ou medicamentos associados")) { // Mensagem do model atualizada
                return res.status(409).json({ erro: err.message });
            }
            return res.status(500).json({ erro: "Erro interno ao deletar fornecedor." });
        }
        if (result.changes === 0) {
            return res.status(404).json({ erro: "Fornecedor não encontrado para deleção." });
        }
        res.json({ mensagem: "Fornecedor deletado com sucesso!" });
    });
});

module.exports = router;