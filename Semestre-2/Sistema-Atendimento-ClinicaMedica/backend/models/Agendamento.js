const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  dataConsulta: {
    type: Date,
    required: true
  },
  horario: {
    type: String,
    required: true
  },
  medico: {
    type: String,
    required: true
  },
  especialidade: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['agendado', 'confirmado', 'cancelado', 'realizado'],
    default: 'agendado'
  },
  motivo: {
    type: String
  },
  previsaoClima: {
    disponivel: {
      type: Boolean,
      default: false
    },
    descricao: String,
    temperatura: Number,
    umidade: Number,
    previsaoChuva: Boolean,
    icone: String,
    dataPrevisao: Date,
    localidade: String,
    motivoIndisponibilidade: String
  },
  observacoes: String,
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Agendamento', agendamentoSchema);
