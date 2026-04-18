<template>
  <div class="container">
    <div class="card">
      <h2>Painel de Administração</h2>

      <div class="tabs">
        <button 
          @click="abaAtiva = 'agendamentos'"
          :class="['tab-btn', { ativo: abaAtiva === 'agendamentos' }]"
        >
          Agendamentos
        </button>
        <button 
          v-if="usuarioTipo === 'admin'"
          @click="abaAtiva = 'usuarios'"
          :class="['tab-btn', { ativo: abaAtiva === 'usuarios' }]"
        >
          Usuários
        </button>
      </div>

      <!-- ABA AGENDAMENTOS -->
      <div v-if="abaAtiva === 'agendamentos'" class="tab-content">
        <h3>Todos os Agendamentos</h3>
        <table class="tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Especialidade</th>
              <th>Data/Hora</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="agendamento in agendamentos" :key="agendamento._id">
              <td>{{ agendamento.paciente.nome }}</td>
              <td>{{ agendamento.medico }}</td>
              <td>{{ agendamento.especialidade }}</td>
              <td>
                {{ formatarData(agendamento.dataConsulta) }}<br>
                <small>{{ agendamento.horario }}</small>
              </td>
              <td>
                <select 
                  :value="agendamento.status"
                  @change="atualizarStatus(agendamento._id, $event.target.value)"
                  :class="['status-select', agendamento.status]"
                >
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </td>
              <td>
                <button @click="verDetalhes(agendamento)" class="btn-ver">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ABA USUÁRIOS -->
      <div v-if="abaAtiva === 'usuarios'" class="tab-content">
        <h3>Usuários do Sistema</h3>
        <table class="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Tipo</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario._id">
              <td>{{ usuario.nome }}</td>
              <td>{{ usuario.email }}</td>
              <td>{{ usuario.cpf }}</td>
              <td><span :class="['tipo-badge', usuario.tipo]">{{ usuario.tipo }}</span></td>
              <td>{{ usuario.telefone }}</td>
              <td>
                <span v-if="usuario.ativo" class="ativo-badge">Ativo</span>
                <span v-else class="inativo-badge">Inativo</span>
              </td>
              <td>
                <select
                  v-if="usuario.tipo !== 'admin'"
                  :value="usuario.tipo"
                  class="status-select"
                  @change="atualizarTipoUsuario(usuario._id, $event.target.value)"
                >
                  <option value="paciente">Paciente</option>
                  <option value="secretario">Secretário</option>
                </select>
                <span v-else class="tipo-fixo">Administrador</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="erro" class="erro">{{ erro }}</div>
      <div v-if="mensagem" class="sucesso">{{ mensagem }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Admin',
  data() {
    return {
      usuarioTipo: '',
      abaAtiva: 'agendamentos',
      agendamentos: [],
      usuarios: [],
      erro: '',
      mensagem: ''
    }
  },
  mounted() {
    this.usuarioTipo = localStorage.getItem('usuarioTipo') || ''
    this.carregarAgendamentos()
    if (this.usuarioTipo === 'admin') {
      this.carregarUsuarios()
    }
  },
  methods: {
    async carregarAgendamentos() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/agendamentos/todos', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.agendamentos = response.data
      } catch (erro) {
        this.erro = 'Erro ao carregar agendamentos'
        console.error(erro)
      }
    },
    async carregarUsuarios() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/usuarios/listar', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.usuarios = response.data
      } catch (erro) {
        this.erro = 'Erro ao carregar usuários'
        console.error(erro)
      }
    },
    async atualizarStatus(id, novoStatus) {
      try {
        const token = localStorage.getItem('token')
        await axios.patch(`/api/agendamentos/${id}/status`, 
          { status: novoStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        this.mensagem = 'Status atualizado com sucesso'
        this.carregarAgendamentos()
      } catch (erro) {
        this.erro = 'Erro ao atualizar status'
        console.error(erro)
      }
    },
    async atualizarTipoUsuario(id, novoTipo) {
      try {
        const token = localStorage.getItem('token')
        await axios.patch(`/api/usuarios/${id}/tipo`,
          { tipo: novoTipo },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        this.mensagem = 'Tipo de usuario atualizado com sucesso'
        this.carregarUsuarios()
      } catch (erro) {
        this.erro = erro.response?.data?.erro || 'Erro ao atualizar tipo de usuario'
        console.error(erro)
      }
    },
    verDetalhes(agendamento) {
      alert(`Paciente: ${agendamento.paciente.nome}\nTelefone: ${agendamento.paciente.telefone}\nMotivo: ${agendamento.motivo || 'Não informado'}`)
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
  max-width: 1000px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #ddd;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #999;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-btn.ativo {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  margin-bottom: 30px;
}

.tab-content h3 {
  margin-bottom: 20px;
  color: #333;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  overflow: auto;
}

.tabela thead {
  background: #f5f5f5;
}

.tabela th, .tabela td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.tabela th {
  font-weight: bold;
  color: #333;
}

.tabela tbody tr:hover {
  background: #f9f9f9;
}

.status-select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
}

.status-select.agendado {
  background: #e3f2fd;
  color: #1976d2;
}

.status-select.confirmado {
  background: #e8f5e9;
  color: #388e3c;
}

.status-select.realizado {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-select.cancelado {
  background: #ffebee;
  color: #d32f2f;
}

.btn-ver {
  background: #2196f3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-ver:hover {
  background: #1976d2;
}

.tipo-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.tipo-badge.paciente {
  background: #e3f2fd;
  color: #1976d2;
}

.tipo-badge.secretario {
  background: #fff3e0;
  color: #f57c00;
}

.tipo-badge.admin {
  background: #f3e5f5;
  color: #7b1fa2;
}

.ativo-badge {
  background: #e8f5e9;
  color: #388e3c;
  padding: 5px 10px;
  border-radius: 3px;
  font-weight: bold;
}

.inativo-badge {
  background: #ffebee;
  color: #d32f2f;
  padding: 5px 10px;
  border-radius: 3px;
  font-weight: bold;
}

.tipo-fixo {
  color: #666;
  font-weight: 600;
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

@media (max-width: 900px) {
  .tabela {
    font-size: 12px;
  }

  .tabela th, .tabela td {
    padding: 8px;
  }
}

@media (max-width: 600px) {
  .card {
    padding: 20px;
  }

  .tabela {
    display: block;
    overflow-x: auto;
  }
}
</style>
