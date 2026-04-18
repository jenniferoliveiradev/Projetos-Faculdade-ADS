<template>
  <div class="container">
    <div class="card">
      <h2>Meus Agendamentos</h2>

      <div class="filtros">
        <button 
          @click="filtroAtivo = 'todos'"
          :class="['btn-filtro', { ativo: filtroAtivo === 'todos' }]"
        >
          Todos
        </button>
        <button 
          @click="filtroAtivo = 'agendado'"
          :class="['btn-filtro', { ativo: filtroAtivo === 'agendado' }]"
        >
          Agendados
        </button>
        <button 
          @click="filtroAtivo = 'confirmado'"
          :class="['btn-filtro', { ativo: filtroAtivo === 'confirmado' }]"
        >
          Confirmados
        </button>
        <button 
          @click="filtroAtivo = 'cancelado'"
          :class="['btn-filtro', { ativo: filtroAtivo === 'cancelado' }]"
        >
          Cancelados
        </button>
      </div>

      <div class="lista-agendamentos">
        <div v-if="agendamentosFiltrados.length > 0">
          <div v-for="agendamento in agendamentosFiltrados" :key="agendamento._id" class="agendamento-card">
            <div class="header">
              <h3>{{ agendamento.medico }} - {{ agendamento.especialidade }}</h3>
              <span :class="['badge', agendamento.status]">{{ agendamento.status }}</span>
            </div>
            <div class="detalhes">
              <p><strong>📅 Data:</strong> {{ formatarData(agendamento.dataConsulta) }}</p>
              <p><strong>⏰ Horário:</strong> {{ agendamento.horario }}</p>
              <p v-if="agendamento.motivo"><strong>📝 Motivo:</strong> {{ agendamento.motivo }}</p>
              <p v-if="agendamento.previsaoClima?.disponivel">
                <strong>🌤️ Clima:</strong> {{ agendamento.previsaoClima.descricao }} ({{ agendamento.previsaoClima.temperatura }}°C)
                <span v-if="agendamento.previsaoClima.previsaoChuva" class="aviso">⚠️ Chuva</span>
              </p>
              <p v-else-if="agendamento.previsaoClima?.motivoIndisponibilidade" class="clima-pendente">
                <strong>🌤️ Clima:</strong> {{ agendamento.previsaoClima.motivoIndisponibilidade }}
              </p>
            </div>
            <div class="acoes">
              <button 
                v-if="agendamento.status !== 'cancelado'"
                @click="cancelarAgendamento(agendamento._id)"
                class="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
        <p v-else class="info">Nenhum agendamento encontrado</p>
      </div>

      <div v-if="erro" class="erro">{{ erro }}</div>
      <div v-if="mensagem" class="sucesso">{{ mensagem }}</div>

      <router-link to="/novo-agendamento" class="btn-novo">+ Novo Agendamento</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Agendamentos',
  data() {
    return {
      agendamentos: [],
      filtroAtivo: 'todos',
      erro: '',
      mensagem: ''
    }
  },
  computed: {
    agendamentosFiltrados() {
      if (this.filtroAtivo === 'todos') {
        return this.agendamentos
      }
      return this.agendamentos.filter(a => a.status === this.filtroAtivo)
    }
  },
  mounted() {
    this.carregarAgendamentos()
  },
  methods: {
    async carregarAgendamentos() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/agendamentos/meus-agendamentos', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.agendamentos = response.data.sort((a, b) => 
          new Date(b.dataConsulta) - new Date(a.dataConsulta)
        )
      } catch (erro) {
        this.erro = 'Erro ao carregar agendamentos'
        console.error(erro)
      }
    },
    async cancelarAgendamento(id) {
      if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        try {
          const token = localStorage.getItem('token')
          await axios.post(`/api/agendamentos/${id}/cancelar`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          })
          this.mensagem = 'Agendamento cancelado com sucesso'
          this.carregarAgendamentos()
        } catch (erro) {
          this.erro = erro.response?.data?.erro || 'Erro ao cancelar'
        }
      }
    },
    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
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
  margin-bottom: 30px;
}

.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn-filtro {
  padding: 8px 15px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-filtro:hover {
  border-color: #667eea;
}

.btn-filtro.ativo {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.lista-agendamentos {
  margin-bottom: 30px;
}

.agendamento-card {
  background: #f9f9f9;
  border-left: 5px solid #667eea;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 5px;
  transition: all 0.3s;
}

.agendamento-card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.header h3 {
  color: #333;
  margin: 0;
}

.badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.badge.agendado {
  background: #e3f2fd;
  color: #1976d2;
}

.badge.confirmado {
  background: #e8f5e9;
  color: #388e3c;
}

.badge.cancelado {
  background: #ffebee;
  color: #d32f2f;
}

.badge.realizado {
  background: #f3e5f5;
  color: #7b1fa2;
}

.detalhes {
  margin-bottom: 15px;
}

.detalhes p {
  margin: 8px 0;
  color: #666;
}

.aviso {
  background: #ffc107;
  color: #000;
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: bold;
}

.clima-pendente {
  color: #8a6d3b;
}

.acoes {
  display: flex;
  gap: 10px;
}

.btn-cancelar {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancelar:hover {
  background: #da190b;
}

.btn-novo {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.2s;
}

.btn-novo:hover {
  transform: translateY(-2px);
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

.info {
  text-align: center;
  color: #999;
  padding: 30px;
}

@media (max-width: 600px) {
  .card {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .badge {
    margin-top: 10px;
  }
}
</style>
