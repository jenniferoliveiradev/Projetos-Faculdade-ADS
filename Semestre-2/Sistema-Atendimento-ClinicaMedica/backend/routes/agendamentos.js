const express = require('express');
const router = express.Router();
const {
  agendar,
  listarMeusAgendamentos,
  listarTodos,
  atualizarStatus,
  cancelar
} = require('../controllers/agendamentoController');
const {
  verificarToken,
  verificarAdminOuSecretario
} = require('../middleware/autenticacao');

router.post('/agendar', verificarToken, agendar);
router.get('/meus-agendamentos', verificarToken, listarMeusAgendamentos);
router.get('/todos', verificarToken, verificarAdminOuSecretario, listarTodos);
router.patch('/:id/status', verificarToken, verificarAdminOuSecretario, atualizarStatus);
router.post('/:id/cancelar', verificarToken, cancelar);

module.exports = router;
