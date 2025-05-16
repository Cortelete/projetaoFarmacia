const db = require('../database/db');

const Usuario = {
  listar: (callback) => {
    db.all("SELECT id, nome, email, tipo FROM usuarios", [], callback); // sem senha
  },

  inserir: ({ nome, email, senha, tipo }, callback) => {
    db.run(
      `INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)`,
      [nome, email, senha, tipo || 'comum'],
      callback
    );
  },

  autenticar: (email, senha, callback) => {
    db.get(
      `SELECT id, nome, email, tipo FROM usuarios WHERE email = ? AND senha = ?`,
      [email, senha],
      callback
    );
  }
};

module.exports = Usuario;
