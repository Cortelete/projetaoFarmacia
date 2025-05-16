const db = require('../database/db');

const Usuario = {
  autenticar: (email, senha, callback) => {
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    db.get(sql, [email, senha], callback);
  },
  cadastrar: (usuario, callback) => {
    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.run(sql, [usuario.nome, usuario.email, usuario.senha], callback);
  }
};

module.exports = Usuario;
