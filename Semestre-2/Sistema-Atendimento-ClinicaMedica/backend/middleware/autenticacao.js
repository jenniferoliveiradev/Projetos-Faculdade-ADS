const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decodificado.id;
    req.usuarioTipo = decodificado.tipo;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

const verificarAdminOuSecretario = (req, res, next) => {
  if (req.usuarioTipo !== 'admin' && req.usuarioTipo !== 'secretario') {
    return res.status(403).json({ erro: 'Acesso negado. Privilégios insuficientes.' });
  }
  next();
};

const verificarAdmin = (req, res, next) => {
  if (req.usuarioTipo !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

module.exports = { verificarToken, verificarAdmin, verificarAdminOuSecretario };
