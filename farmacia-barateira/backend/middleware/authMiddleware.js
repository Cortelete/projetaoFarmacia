// Versão temporária para testes (NÃO USE EM PRODUÇÃO)
const verifyToken = (req, res, next) => {
  // Bypass de autenticação para testes
  req.user = { id: 1, cargo: 'Administrador' }; // Simula um usuário administrador
  next();
};

const checkRole = (roles) => {
  return (req, res, next) => {
    // Bypass de verificação de cargo para testes
    next();
  };
};

module.exports = { verifyToken, checkRole };
