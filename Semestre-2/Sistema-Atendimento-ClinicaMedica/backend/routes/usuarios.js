const express = require('express');
const router = express.Router();
const {
  obterPerfil,
  atualizarPerfil,
  buscarEnderecoPorCEP,
  listarUsuarios,
  atualizarTipoUsuario
} = require('../controllers/usuarioController');
const { verificarToken, verificarAdmin } = require('../middleware/autenticacao');

router.get('/perfil', verificarToken, obterPerfil);
router.put('/perfil', verificarToken, atualizarPerfil);
router.get('/cep/:cep', buscarEnderecoPorCEP);
router.get('/listar', verificarToken, verificarAdmin, listarUsuarios);
router.patch('/:id/tipo', verificarToken, verificarAdmin, atualizarTipoUsuario);

module.exports = router;
