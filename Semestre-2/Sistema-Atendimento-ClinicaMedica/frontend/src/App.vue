<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <h1>🏥 Clínica Médica</h1>
        </div>
        <ul class="nav-links" v-if="usuarioAutenticado">
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/agendamentos">Meus Agendamentos</router-link></li>
          <li v-if="usuarioAdmin"><router-link to="/admin">Administração</router-link></li>
          <li><a href="#" @click="sair">Sair</a></li>
        </ul>
        <ul class="nav-links" v-else>
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/registro">Registro</router-link></li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>&copy; 2026 Sistema de Agendamento - Clínica Médica. Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      usuarioAutenticado: false,
      usuarioAdmin: false
    }
  },
  mounted() {
    this.verificarAutenticacao()
  },
  methods: {
    verificarAutenticacao() {
      const token = localStorage.getItem('token')
      const tipo = localStorage.getItem('usuarioTipo')
      this.usuarioAutenticado = !!token
      this.usuarioAdmin = tipo === 'admin' || tipo === 'secretario'
    },
    sair() {
      localStorage.removeItem('token')
      localStorage.removeItem('usuarioId')
      localStorage.removeItem('usuarioTipo')
      localStorage.removeItem('usuarioNome')
      this.$router.push('/login')
      this.verificarAutenticacao()
    }
  },
  watch: {
    '$route'() {
      this.verificarAutenticacao()
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.logo h1 {
  font-size: 24px;
  margin: 15px 0;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 30px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
  font-weight: 500;
}

.nav-links a:hover {
  opacity: 0.8;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 30px auto;
  width: 100%;
  padding: 0 20px;
}

.footer {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: 50px;
}
</style>
