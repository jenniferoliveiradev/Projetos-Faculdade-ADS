<template>
  <div class="container">
    <div class="card login-card">
      <h2>Login</h2>
      <form @submit.prevent="fazerLogin">
        <div class="form-group">
          <label>Email:</label>
          <input 
            v-model="formulario.email" 
            type="email" 
            required
            placeholder="seu@email.com"
          >
        </div>
        <div class="form-group">
          <label>Senha:</label>
          <input 
            v-model="formulario.senha" 
            type="password" 
            required
            placeholder="Sua senha"
          >
        </div>
        <button type="submit" class="btn-primary">Entrar</button>
        <p class="info-text">
          Não tem conta? <router-link to="/registro">Clique aqui para registrar</router-link>
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
  name: 'Login',
  data() {
    return {
      formulario: {
        email: '',
        senha: ''
      },
      erro: '',
      mensagem: ''
    }
  },
  methods: {
    async fazerLogin() {
      this.erro = ''
      this.mensagem = ''

      try {
        const response = await axios.post('/api/auth/login', {
          email: this.formulario.email,
          senha: this.formulario.senha
        })

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('usuarioId', response.data.usuario.id)
        localStorage.setItem('usuarioTipo', response.data.usuario.tipo)
        localStorage.setItem('usuarioNome', response.data.usuario.nome)

        this.mensagem = 'Login realizado com sucesso!'
        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 1000)
      } catch (erro) {
        this.erro = erro.response?.data?.erro || 'Erro ao fazer login'
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
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
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.info-text {
  text-align: center;
  margin-top: 20px;
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
</style>
