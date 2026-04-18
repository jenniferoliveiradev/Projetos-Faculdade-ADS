const Usuario = require('../models/Usuario');
const axios = require('axios');

// Obter perfil do usuário
const obterPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('-senha');

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (erro) {
    console.error('Erro ao obter perfil:', erro);
    res.status(500).json({ erro: 'Erro ao obter perfil' });
  }
};

// Atualizar perfil
const atualizarPerfil = async (req, res) => {
  try {
    const { nome, telefone, endereco } = req.body;

    const atualizacoes = {};
    if (nome) atualizacoes.nome = nome;
    if (telefone) atualizacoes.telefone = telefone;
    if (endereco) atualizacoes.endereco = endereco;

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuarioId,
      atualizacoes,
      { new: true }
    ).select('-senha');

    res.json({
      mensagem: 'Perfil atualizado com sucesso',
      usuario
    });
  } catch (erro) {
    console.error('Erro ao atualizar perfil:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
};

// Buscar endereço por CEP
const buscarEnderecoPorCEP = async (req, res) => {
  try {
    const { cep } = req.params;

    const response = await axios.get(`${process.env.CEP_API_URL}/${cep}/json/`);

    if (response.data.erro) {
      return res.status(404).json({ erro: 'CEP não encontrado' });
    }

    res.json({
      endereco: {
        rua: response.data.logradouro,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        estado: response.data.uf,
        cep: response.data.cep
      }
    });
  } catch (erro) {
    console.error('Erro ao buscar CEP:', erro.message);
    res.status(500).json({ erro: 'Erro ao buscar CEP' });
  }
};

// Listar usuários (apenas admin)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha');
    res.json(usuarios);
  } catch (erro) {
    console.error('Erro ao listar usuários:', erro);
    res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
};

// Atualizar tipo de usuario (apenas admin)
const atualizarTipoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo } = req.body;

    if (!['paciente', 'secretario'].includes(tipo)) {
      return res.status(400).json({ erro: 'Tipo de usuario invalido' });
    }

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' });
    }

    usuario.tipo = tipo;
    await usuario.save();

    res.json({
      mensagem: 'Tipo de usuario atualizado com sucesso',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (erro) {
    console.error('Erro ao atualizar tipo do usuario:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar tipo do usuario' });
  }
};

module.exports = {
  obterPerfil,
  atualizarPerfil,
  buscarEnderecoPorCEP,
  listarUsuarios,
  atualizarTipoUsuario
};
