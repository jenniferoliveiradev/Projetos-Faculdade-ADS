<template>
  <div class="container">
    <div class="card">
      <h2>Registrar Novo Usuário</h2>
      <form @submit.prevent="registrar">
        <div class="form-row">
          <div class="form-group">
            <label>Nome Completo:</label>
            <input v-model="formulario.nome" type="text" required>
          </div>
          <div class="form-group">
            <label>CPF:</label>
            <input v-model="formulario.cpf" type="text" required placeholder="000.000.000-00">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Email:</label>
            <input v-model="formulario.email" type="email" required>
          </div>
          <div class="form-group">
            <label>Telefone:</label>
            <input v-model="formulario.telefone" type="tel" required placeholder="(11) 99999-9999">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Senha:</label>
            <input v-model="formulario.senha" type="password" required>
          </div>
          <div class="form-group">
            <label>Confirmar Senha:</label>
            <input v-model="formulario.confirmarSenha" type="password" required>
          </div>
        </div>

        <div class="form-section">
          <h3>Endereço do Paciente</h3>
          <div class="form-row">
            <div class="form-group">
              <label>CEP:</label>
              <input
                v-model="formulario.endereco.cep"
                type="text"
                required
                maxlength="9"
                placeholder="00000-000"
                @blur="buscarCEP"
              >
            </div>
            <div class="form-group">
              <label>Número:</label>
              <input v-model="formulario.endereco.numero" type="text" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Rua:</label>
              <input v-model="formulario.endereco.rua" type="text" required>
            </div>
            <div class="form-group">
              <label>Complemento:</label>
              <input v-model="formulario.endereco.complemento" type="text">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Bairro:</label>
              <input v-model="formulario.endereco.bairro" type="text" required>
            </div>
            <div class="form-group">
              <label>Cidade:</label>
              <input v-model="formulario.endereco.cidade" type="text" required>
            </div>
          </div>

          <div class="form-group">
            <label>Estado:</label>
            <input v-model="formulario.endereco.estado" type="text" required maxlength="2" placeholder="SP">
          </div>
        </div>

        <button type="submit" class="btn-primary">Registrar</button>
        <p class="info-text">
          Já tem conta? <router-link to="/login">Clique aqui para fazer login</router-link>
        </p>
      </form>

      <div v-if="erro" class="erro">{{ erro }}</div>
      <div v-if="mensagem" class="sucesso">{{ mensagem }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Registro',
  data() {
    return {
      formulario: {
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        telefone: '',
        cpf: '',
        endereco: {
          cep: '',
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: ''
        }
      },
      erro: '',
      mensagem: ''
    }
  },
  methods: {
    async buscarCEP() {
      const cep = this.formulario.endereco.cep.replace(/\D/g, '')

      if (cep.length !== 8) {
        return
      }

      try {
        const response = await axios.get(`/api/usuarios/cep/${cep}`)
        this.formulario.endereco = {
          ...this.formulario.endereco,
          ...response.data.endereco,
          cep: response.data.endereco.cep,
          estado: response.data.endereco.estado?.toUpperCase() || ''
        }
      } catch (erro) {
        this.erro = erro.response?.data?.erro || 'Nao foi possivel buscar o CEP'
      }
    },
    async registrar() {
      this.erro = ''
      this.mensagem = ''

      if (this.formulario.senha !== this.formulario.confirmarSenha) {
        this.erro = 'Senhas não conferem'
        return
      }

      try {
        const response = await axios.post('/api/auth/registrar', {
          nome: this.formulario.nome,
          email: this.formulario.email,
          senha: this.formulario.senha,
          telefone: this.formulario.telefone,
          cpf: this.formulario.cpf,
          endereco: {
            ...this.formulario.endereco,
            estado: this.formulario.endereco.estado.toUpperCase()
          },
          tipo: 'paciente'
        })

        this.mensagem = 'Usuário registrado com sucesso! Redirecionando...'
        setTimeout(() => {
          this.$router.push('/login')
        }, 1500)
      } catch (erro) {
        this.erro = erro.response?.data?.erro || 'Erro ao registrar'
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.form-section {
  margin-top: 30px;
}

.form-section h3 {
  margin-bottom: 15px;
  color: #667eea;
  font-size: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

.info-text {
  text-align: center;
  margin-top: 15px;
  color: #666;
}

.info-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
}

.erro {
  margin-top: 15px;
  padding: 10px;
  background: #fee;
  border: 1px solid #f99;
  color: #c00;
  border-radius: 5px;
}

.sucesso {
  margin-top: 15px;
  padding: 10px;
  background: #efe;
  border: 1px solid #9f9;
  color: #0a0;
  border-radius: 5px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 20px;
  }
}
</style>
