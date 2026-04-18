const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Registrar novo usuário
const registrar = async (req, res) => {
  try {
    const { nome, email, senha, telefone, cpf, endereco } = req.body;

    // Validações básicas
    if (!nome || !email || !senha || !telefone || !cpf) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    // Verificar se usuário já existe
    let usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    usuarioExistente = await Usuario.findOne({ cpf });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'CPF já cadastrado' });
    }

    // Criar novo usuário
    const novoUsuario = new Usuario({
      nome,
      email,
      senha,
      telefone,
      cpf,
      endereco,
      tipo: 'paciente'
    });

    await novoUsuario.save();

    res.status(201).json({
      mensagem: 'Usuário registrado com sucesso',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo: novoUsuario.tipo
      }
    });
  } catch (erro) {
    console.error('Erro ao registrar:', erro);
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
};

// Login de usuário
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    // Procurar usuário
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Usuário inativo. Contate o administrador.' });
    }

    // Comparar senhas
    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario._id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};

module.exports = { registrar, login };
