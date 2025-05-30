const db = require("../database/db");

const Usuario = {
  // Função para autenticar usuário (mantida com email e senha)
  autenticar: (email, senha, callback) => {
    const sql = "SELECT id, nome, email, cargo FROM usuarios WHERE email = ? AND senha = ?";
    db.get(sql, [email, senha], (err, row) => {
      if (err) {
        console.error("Erro ao buscar usuário:", err.message);
        return callback(err, null);
      }
      callback(null, row); // Retorna o usuário encontrado (ou undefined)
    });
  },

  // Função para cadastrar novo usuário (incluindo cargo)
  cadastrar: (usuario, callback) => {
    // Define um cargo padrão se não for fornecido
    const cargo = usuario.cargo || "Funcionário"; 
    const sql = "INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)";
    db.run(sql, [usuario.nome, usuario.email, usuario.senha, cargo], function (err) {
      if (err) {
        console.error("Erro ao cadastrar usuário:", err.message);
        return callback(err);
      }
      // Retorna o ID do usuário inserido
      callback(null, { id: this.lastID }); 
    });
  },

  // Função para buscar um usuário pelo ID
  buscarPorId: (id, callback) => {
    const sql = "SELECT id, nome, email, cargo FROM usuarios WHERE id = ?";
    db.get(sql, [id], callback);
  },

  // Função para listar todos os usuários
  listarTodos: (callback) => {
    const sql = "SELECT id, nome, email, cargo FROM usuarios";
    db.all(sql, callback);
  },

  // Função para atualizar um usuário (exemplo: atualizar nome ou cargo)
  // Poderíamos adicionar mais campos conforme necessário
  atualizar: (id, dadosUsuario, callback) => {
    // Constrói a query dinamicamente para atualizar apenas os campos fornecidos
    let fields = [];
    let params = [];
    if (dadosUsuario.nome) {
      fields.push("nome = ?");
      params.push(dadosUsuario.nome);
    }
    if (dadosUsuario.email) {
      fields.push("email = ?");
      params.push(dadosUsuario.email);
    }
    if (dadosUsuario.senha) {
      fields.push("senha = ?");
      params.push(dadosUsuario.senha);
    }
     if (dadosUsuario.cargo) {
      fields.push("cargo = ?");
      params.push(dadosUsuario.cargo);
    }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar fornecido."));
    }

    params.push(id); // Adiciona o ID ao final para a cláusula WHERE
    const sql = `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, params, function(err) {
       if (err) {
        console.error("Erro ao atualizar usuário:", err.message);
        return callback(err);
      }
      // Verifica se alguma linha foi afetada
      callback(null, { changes: this.changes }); 
    });
  },

  // Função para deletar um usuário
  deletar: (id, callback) => {
    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.run(sql, [id], function(err) {
       if (err) {
        console.error("Erro ao deletar usuário:", err.message);
        return callback(err);
      }
      // Verifica se alguma linha foi afetada
      callback(null, { changes: this.changes });
    });
  }
};

module.exports = Usuario;

