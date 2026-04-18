require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/database');

// Initializar express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar banco de dados
conectarDB();

// Rotas
app.use('/api/auth', require('./routes/autenticacao'));
app.use('/api/agendamentos', require('./routes/agendamentos'));
app.use('/api/usuarios', require('./routes/usuarios'));

// Rota de teste
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'API funcionando!' });
});

// Erro 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
