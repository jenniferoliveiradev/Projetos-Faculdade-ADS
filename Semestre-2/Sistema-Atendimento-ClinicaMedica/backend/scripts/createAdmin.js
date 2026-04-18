require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      args[key] = 'true';
    } else {
      args[key] = value;
      i += 1;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const email = (args.email || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const senha = args.senha || process.env.ADMIN_SENHA || '';
  const nome = args.nome || process.env.ADMIN_NOME || 'Administrador';
  const telefone = args.telefone || process.env.ADMIN_TELEFONE || '';
  const cpf = args.cpf || process.env.ADMIN_CPF || '';

  if (!email) {
    console.error('Informe o email: --email admin@clinica.com');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const usuarioExistente = await Usuario.findOne({ email });

  if (usuarioExistente) {
    usuarioExistente.tipo = 'admin';
    usuarioExistente.ativo = true;

    if (senha) {
      usuarioExistente.senha = senha;
    }

    await usuarioExistente.save();
    console.log(`Usuario ${email} atualizado para admin com sucesso.`);
    await mongoose.connection.close();
    return;
  }

  if (!senha || !telefone || !cpf) {
    console.error(
      'Para criar novo admin, informe: --senha, --telefone e --cpf (alem do --email).'
    );
    process.exit(1);
  }

  const novoAdmin = new Usuario({
    nome,
    email,
    senha,
    telefone,
    cpf,
    tipo: 'admin',
    ativo: true,
  });

  await novoAdmin.save();
  console.log(`Admin ${email} criado com sucesso.`);
  await mongoose.connection.close();
}

main().catch(async (erro) => {
  console.error('Erro ao criar/atualizar admin:', erro.message);
  try {
    await mongoose.connection.close();
  } catch (_) {}
  process.exit(1);
});
