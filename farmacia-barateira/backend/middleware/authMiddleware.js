// Middleware de autenticação FAKE (apenas para desenvolvimento/teste sem autenticação real)

// Função fake para verificar token (sempre permite passar)
const verifyToken = (req, res, next) => {
  // console.log("AuthMiddleware FAKE: verifyToken chamado, permitindo acesso.");
  next(); // Simplesmente chama o próximo middleware/rota
};

// Função fake para verificar roles (sempre permite passar)
const checkRole = (rolesPermitidas) => {
  return (req, res, next) => {
    // console.log(`AuthMiddleware FAKE: checkRole chamado para roles [${rolesPermitidas.join(', ')}], permitindo acesso.`);
    next(); // Simplesmente chama o próximo middleware/rota
  };
};

module.exports = {
  verifyToken,
  checkRole,
};

