const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  senha: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['paciente', 'secretario', 'admin'],
    default: 'paciente'
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  dataNascimento: {
    type: Date
  },
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  },
  ativo: {
    type: Boolean,
    default: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.senha = await bcryptjs.hash(this.senha, salt);
    next();
  } catch (erro) {
    next(erro);
  }
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function(senhaDigitada) {
  return await bcryptjs.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
