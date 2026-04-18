<template>
  <div class="container">
    <div class="card">
      <h2>Dashboard</h2>
      <p>Bem-vindo, <strong>{{ usuarioNome }}</strong>!</p>

      <div class="welcome-message">
        <p>Você tem as seguintes funcionalidades disponíveis:</p>
      </div>

      <div class="actions-grid">
        <div class="action-card">
          <h3>📋 Novo Agendamento</h3>
          <p>Agende uma consulta com um de nossos médicos</p>
          <router-link to="/novo-agendamento" class="btn-action">Agendar Consulta</router-link>
        </div>

        <div class="action-card">
          <h3>📅 Meus Agendamentos</h3>
          <p>Visualize e gerencie seus agendamentos</p>
          <router-link to="/agendamentos" class="btn-action">Ver Agendamentos</router-link>
        </div>

        <div class="action-card" v-if="usuarioTipo === 'admin' || usuarioTipo === 'secretario'">
          <h3>⚙️ Administração</h3>
          <p>Gerencie pacientes e agendamentos</p>
          <router-link to="/admin" class="btn-action">Ir para Admin</router-link>
        </div>
      </div>

      <div class="proximas-consultas">
        <h3>📍 Próximas Consultas</h3>
        <div v-if="proximasConsultas.length > 0" class="lista-consultas">
          <div v-for="consulta in proximasConsultas" :key="consulta._id" class="consulta-item">
            <strong>{{ consulta.medico }}</strong> - {{ consulta.especialidade }}<br>
            <small>{{ formatarData(consulta.dataConsulta) }} às {{ consulta.horario }}</small>
            <span v-if="consulta.previsaoClima?.disponivel && consulta.previsaoClima.previsaoChuva" class="aviso-chuva">
              ⚠️ Previsão de chuva
            </span>
          </div>
        </div>
        <p v-else class="info">Nenhuma consulta agendada</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      usuarioNome: '',
      usuarioTipo: '',
      proximasConsultas: [],
      erro: ''
    }
  },
  mounted() {
    this.usuarioNome = localStorage.getItem('usuarioNome')
    this.usuarioTipo = localStorage.getItem('usuarioTipo')
    this.carregarProximasConsultas()
  },
  methods: {
    async carregarProximasConsultas() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/agendamentos/meus-agendamentos', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const agora = new Date()
        this.proximasConsultas = response.data
          .filter(c => new Date(c.dataConsulta) > agora && c.status !== 'cancelado')
          .sort((a, b) => new Date(a.dataConsulta) - new Date(b.dataConsulta))
          .slice(0, 3)
      } catch (erro) {
        console.error('Erro ao carregar consultas:', erro)
      }
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-BR')
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

.welcome-message {
  background: #f0f4ff;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  color: #555;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.action-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
}

.action-card h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.action-card p {
  margin-bottom: 15px;
  font-size: 14px;
  opacity: 0.9;
}

.btn-action {
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-action:hover {
  background: #f0f0f0;
}

.proximas-consultas {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #ddd;
}

.lista-consultas {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.consulta-item {
  background: #f9f9f9;
  padding: 15px;
  border-left: 4px solid #667eea;
  border-radius: 4px;
}

.aviso-chuva {
  display: inline-block;
  margin-top: 10px;
  background: #ffc107;
  color: #333;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
}

.info {
  color: #999;
  font-style: italic;
}
</style>
