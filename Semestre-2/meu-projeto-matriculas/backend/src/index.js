import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const cursos = [
  { id: 1, titulo: 'JavaScript Básico', descricao: 'Aprenda JavaScript', instructor: 'Carlos', duracao: '40h', nivel: 'Iniciante' },
  { id: 2, titulo: 'React', descricao: 'Frameworks moderno', instructor: 'Ana', duracao: '60h', nivel: 'Intermediário' },
  { id: 3, titulo: 'Node.js', descricao: 'Backend com Node', instructor: 'Pedro', duracao: '50h', nivel: 'Intermediário' },
  { id: 4, titulo: 'SQL', descricao: 'Banco de dados', instructor: 'Maria', duracao: '45h', nivel: 'Iniciante' },
  { id: 5, titulo: 'Vue.js', descricao: 'Framework Vue', instructor: 'João', duracao: '55h', nivel: 'Intermediário' }
];

const matriculas = [];

app.get('/api/cursos', (req, res) => {
  res.json({ success: true, data: cursos });
});

app.get('/api/cursos/:id', (req, res) => {
  const curso = cursos.find(c => c.id === parseInt(req.params.id));
  if (!curso) return res.status(404).json({ success: false, error: 'Curso não encontrado' });
  res.json({ success: true, data: curso });
});

app.post('/api/matricula', (req, res) => {
  const { nome, email, cursoId } = req.body;

  const erros = [];
  if (!nome || nome.trim().length < 3) erros.push('Nome deve ter 3+ caracteres');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.push('Email inválido');
  if (!cursoId || !cursos.find(c => c.id === cursoId)) erros.push('Curso inválido');

  if (erros.length > 0) return res.status(400).json({ success: false, error: erros.join('; ') });

  const matricula = {
    id: `MAT-${Date.now()}`,
    nome,
    email,
    cursoId,
    dataMatricula: new Date().toISOString(),
    status: 'Ativa'
  };

  matriculas.push(matricula);
  res.status(201).json({ success: true, data: matricula });
});

app.get('/api/matriculas', (req, res) => {
  res.json({ success: true, data: matriculas });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
