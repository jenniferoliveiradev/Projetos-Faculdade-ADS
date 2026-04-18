<template>
  <div class="app">
    <div class="container">
      <h1>Matrículas de Cursos Online</h1>
      
      <div class="intro">
        <p>Escolha um curso e complete o formulário para se matricular</p>
      </div>

      <div class="content">
        <div class="cursos-section">
          <h2>Cursos Disponíveis</h2>
          <div class="lista-cursos">
            <div
              v-for="curso in cursos"
              :key="curso.id"
              class="card-curso"
              :class="{ selecionado: cursoSelecionado?.id === curso.id }"
              @click="selecionarCurso(curso)"
            >
              <h3>{{ curso.titulo }}</h3>
              <p>{{ curso.descricao }}</p>
              <small>Inst: {{ curso.instructor }} | {{ curso.duracao }}</small>
            </div>
          </div>
        </div>

        <div class="formulario-section" v-if="cursoSelecionado">
          <h2>Dados para Matrícula</h2>
          <form @submit.prevent="enviarMatricula">
            <div class="form-group">
              <label for="nome">Nome:</label>
              <input
                id="nome"
                v-model="formulario.nome"
                type="text"
                placeholder="Digite seu nome"
              />
              <span v-if="erros.nome" class="erro">{{ erros.nome }}</span>
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input
                id="email"
                v-model="formulario.email"
                type="email"
                placeholder="seu@email.com"
              />
              <span v-if="erros.email" class="erro">{{ erros.email }}</span>
            </div>

            <div class="form-group">
              <label>Curso Selecionado:</label>
              <p class="curso-nome">{{ cursoSelecionado.titulo }}</p>
            </div>

            <button type="submit" class="btn-enviar">Confirmar Matrícula</button>
          </form>
        </div>
      </div>

      <div v-if="confirmacao" class="confirmacao">
        <div class="confirmacao-content">
          <h2>Matrícula Realizada!</h2>
          <p>ID: {{ confirmacao.id }}</p>
          <p>Nome: {{ confirmacao.nome }}</p>
          <p>Email: {{ confirmacao.email }}</p>
          <p>Curso: {{ cursoSelecionado.titulo }}</p>
          <p>Status: {{ confirmacao.status }}</p>
          <button @click="novaMatricula" class="btn-novo">Nova Matrícula</button>
        </div>
      </div>

      <div v-if="mensagemErro" class="msg-erro">
        {{ mensagemErro }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const cursos = ref([])
const cursoSelecionado = ref(null)
const formulario = ref({ nome: '', email: '' })
const erros = ref({})
const confirmacao = ref(null)
const mensagemErro = ref('')

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/cursos`)
    cursos.value = response.data.data
  } catch (erro) {
    mensagemErro.value = 'Erro ao carregar cursos'
    console.error(erro)
  }
})

function selecionarCurso(curso) {
  cursoSelecionado.value = curso
  erros.value = {}
  confirmacao.value = null
}

async function enviarMatricula() {
  erros.value = {}

  if (!formulario.value.nome || formulario.value.nome.length < 3) {
    erros.value.nome = 'Nome deve ter ao menos 3 caracteres'
  }
  if (!formulario.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.value.email)) {
    erros.value.email = 'Email inválido'
  }

  if (Object.keys(erros.value).length > 0) return

  try {
    const response = await axios.post(`${API_URL}/matricula`, {
      nome: formulario.value.nome,
      email: formulario.value.email,
      cursoId: cursoSelecionado.value.id
    })
    confirmacao.value = response.data.data
    mensagemErro.value = ''
  } catch (erro) {
    mensagemErro.value = erro.response?.data?.error || 'Erro ao enviar matrícula'
  }
}

function novaMatricula() {
  formulario.value = { nome: '', email: '' }
  cursoSelecionado.value = null
  confirmacao.value = null
  erros.value = {}
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.app {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.intro {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.cursos-section h2,
.formulario-section h2 {
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.lista-cursos {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card-curso {
  border: 2px solid #ddd;
  padding: 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.card-curso:hover {
  border-color: #007bff;
  background-color: #f9f9f9;
}

.card-curso.selecionado {
  border-color: #007bff;
  background-color: #e7f3ff;
}

.card-curso h3 {
  color: #333;
  margin-bottom: 8px;
  font-size: 16px;
}

.card-curso p {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.card-curso small {
  color: #999;
  font-size: 12px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

.curso-nome {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  color: #333;
}

.erro {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.btn-enviar {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.btn-enviar:hover {
  background-color: #0056b3;
}

.confirmacao {
  background-color: #d4edda;
  border: 2px solid #28a745;
  border-radius: 4px;
  padding: 20px;
  margin-top: 30px;
}

.confirmacao-content {
  max-width: 600px;
  margin: 0 auto;
}

.confirmacao-content h2 {
  color: #155724;
  margin-bottom: 15px;
}

.confirmacao-content p {
  color: #155724;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.btn-novo {
  margin-top: 15px;
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.btn-novo:hover {
  background-color: #1e7e34;
}

.msg-erro {
  background-color: #f8d7da;
  border: 2px solid #dc3545;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 15px;
  }
}
</style>
