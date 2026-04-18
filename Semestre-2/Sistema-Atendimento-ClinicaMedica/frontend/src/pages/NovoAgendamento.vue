<template>
  <div class="container">
    <div class="card">
      <h2>Novo Agendamento</h2>
      <form @submit.prevent="agendar">
        <div class="form-section">
          <h3>Dados da Consulta</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Data da Consulta:</label>
              <input v-model="formulario.dataConsulta" type="date" required>
            </div>
            <div class="form-group">
              <label>Horário:</label>
              <select v-model="formulario.horario" required>
                <option value="">Selecione um horário</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Especialidade:</label>
              <select v-model="formulario.especialidade" required>
                <option value="">Selecione uma especialidade</option>
                <option value="Clínico Geral">Clínico Geral</option>
                <option value="Cardiologia">Cardiologia</option>
                <option value="Dermatologia">Dermatologia</option>
                <option value="Oftalmologia">Oftalmologia</option>
                <option value="Pediatria">Pediatria</option>
              </select>
            </div>
            <div class="form-group">
              <label>Médico:</label>
              <input v-model="formulario.medico" type="text" placeholder="Nome do médico" required>
            </div>
          </div>

          <div class="form-group full">
            <label>Motivo da Consulta:</label>
            <textarea v-model="formulario.motivo" placeholder="Descreva o motivo da consulta"></textarea>
          </div>
        </div>

        <button type="submit" class="btn-primary">Agendar Consulta</button>
      </form>

      <div v-if="erro" class="erro">{{ erro }}</div>
      <div v-if="mensagem" class="sucesso">{{ mensagem }}</div>

      <div v-if="climaPrevisao" class="clima-info">
        <h3>🌤️ Previsão do Tempo para o Exame</h3>
        <template v-if="climaPrevisao.disponivel">
          <p v-if="climaPrevisao.localidade"><strong>Localidade:</strong> {{ climaPrevisao.localidade }}</p>
          <p><strong>Temperatura:</strong> {{ climaPrevisao.temperatura }}°C</p>
          <p><strong>Umidade:</strong> {{ climaPrevisao.umidade }}%</p>
          <p><strong>Condição:</strong> {{ climaPrevisao.descricao }}</p>
          <p v-if="climaPrevisao.previsaoChuva" class="aviso">
            ⚠️ Previsão de chuva detectada
          </p>
        </template>
        <p v-else class="clima-indisponivel">
          {{ climaPrevisao.motivoIndisponibilidade }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NovoAgendamento',
  data() {
    return {
      formulario: {
        dataConsulta: '',
        horario: '',
        especialidade: '',
        medico: '',
        motivo: ''
      },
      erro: '',
      mensagem: '',
      climaPrevisao: null
    }
  },
  methods: {
    async agendar() {
      this.erro = ''
      this.mensagem = ''

      try {
        const token = localStorage.getItem('token')
        const response = await axios.post('/api/agendamentos/agendar', {
          dataConsulta: this.formulario.dataConsulta,
          horario: this.formulario.horario,
          especialidade: this.formulario.especialidade,
          medico: this.formulario.medico,
          motivo: this.formulario.motivo
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.climaPrevisao = response.data.agendamento.previsaoClima
        this.mensagem = 'Consulta agendada com sucesso!'
        
        setTimeout(() => {
          this.$router.push('/agendamentos')
        }, 2000)
      } catch (erro) {
        this.erro = erro.response?.data?.erro || 'Erro ao agendar consulta'
      }
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
  max-width: 600px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h3 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: 1 / -1;
}

label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

input, select, textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
}

textarea {
  min-height: 100px;
  resize: vertical;
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
  transition: transform 0.2s;
}

.btn-primary:hover {
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

.clima-info {
  margin-top: 30px;
  padding: 20px;
  background: #fffacd;
  border: 2px solid #ffc107;
  border-radius: 8px;
}

.clima-info h3 {
  margin-bottom: 15px;
  color: #ff9800;
}

.clima-info p {
  margin: 8px 0;
  color: #333;
}

.clima-indisponivel {
  color: #6b4f00;
  font-weight: 500;
}

.aviso {
  color: #d32f2f;
  font-weight: bold;
  margin-top: 10px;
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
