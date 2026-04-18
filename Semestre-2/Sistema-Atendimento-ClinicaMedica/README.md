# Sistema de Atendimento - Clinica Medica

Projeto web para agendamento de consultas, com cadastro/login de usuarios, area do paciente e area administrativa.

## Objetivo do trabalho

Este trabalho foi desenvolvido como projeto de ADS para praticar:
- API REST com Node.js e Express
- autenticacao com JWT
- persistencia com MongoDB
- frontend com Vue 3
- integracao com APIs externas (ViaCEP e Open-Meteo)

## Tecnologias usadas

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- Axios

### Frontend
- Vue 3
- Vue Router
- Vite
- Axios

## Funcionalidades implementadas

- cadastro de usuario (perfil inicial: `paciente`)
- promocao de usuario para `secretario` pelo painel admin ou script
- login com token JWT
- atualizacao de perfil
- agendamento de consulta
- listagem dos proprios agendamentos
- cancelamento de agendamento pelo paciente
- consulta de endereco por CEP (ViaCEP)
- previsao do tempo por data no agendamento, usando endereco do paciente (Open-Meteo)
- painel administrativo:
  - listar todos os agendamentos
  - atualizar status de agendamento
  - listar usuarios (apenas admin)
  - promover paciente para secretario (apenas admin)

## Estrutura do projeto

```text
Sistema-Atendimento-ClinicaMedica/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    server.js
  frontend/
    src/
      pages/
      router/
      App.vue
      main.js
    vite.config.js
  docker-compose.yml
  start.bat
  start.sh
```

## Requisitos

- Node.js (recomendado: 20 LTS)
- npm
- MongoDB local ou MongoDB Atlas

## Configuracao e execucao

### 1 Backend

```bat
cd backend
npm install
copy .env.example .env
```

Edite o arquivo `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clinica_medica
JWT_SECRET=defina_uma_chave_forte
WEATHER_FORECAST_API_URL=https://api.open-meteo.com/v1/forecast
WEATHER_GEOCODING_API_URL=https://geocoding-api.open-meteo.com/v1/search
CEP_API_URL=https://viacep.com.br/ws
NODE_ENV=development
```

Inicie o backend:

```bat
npm start
```

### 2 Frontend

```bat
cd ..\frontend
npm install
```

Opcional: se seu backend nao estiver em `http://localhost:5000`, crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
```

Inicie o frontend:

```bat
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:5000`

## Rodar com script

Na raiz do projeto, no Windows:

```bat
start.bat
```

## Usuario admin

O cadastro pela tela sempre cria usuario `paciente`.

Para promover um usuario existente para `admin`:

```bat
cd backend
npm run create-admin -- --email admin@clinica.com
```

Para criar um admin novo:

```bat
npm run create-admin -- --email admin@clinica.com --senha 123456 --telefone 11999999999 --cpf 12345678901 --nome "Administrador"
```

Depois, faça logout e login novamente para atualizar as permissoes no frontend.

## Usuario secretario

O secretario pode ser criado de duas formas:

1. Pelo painel admin, alterando o tipo de um usuario de `paciente` para `secretario`.
2. Pelo script abaixo:

```bat
cd backend
npm run create-secretario -- --email secretario@clinica.com
```

Para criar um secretario novo:

```bat
npm run create-secretario -- --email secretario@clinica.com --senha 123456 --telefone 11999999999 --cpf 12345678901 --nome "Secretaria"
```

## Endpoints principais

### Autenticacao
- `POST /api/auth/registrar`
- `POST /api/auth/login`

### Agendamentos
- `POST /api/agendamentos/agendar` (autenticado)
- `GET /api/agendamentos/meus-agendamentos` (autenticado)
- `GET /api/agendamentos/todos` (admin/secretario)
- `PATCH /api/agendamentos/:id/status` (admin/secretario)
- `POST /api/agendamentos/:id/cancelar` (autenticado)

### Usuarios
- `GET /api/usuarios/perfil` (autenticado)
- `PUT /api/usuarios/perfil` (autenticado)
- `GET /api/usuarios/cep/:cep`
- `GET /api/usuarios/listar` (admin)
- `PATCH /api/usuarios/:id/tipo` (admin)

### Teste rapido
- `GET /api/teste`


## Autor
Jennifer Oliveira Lucas 
