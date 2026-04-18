#!/bin/bash

# Script para iniciar o projeto completo
# Uso: ./start.sh

echo "🏥 Iniciando Sistema de Agendamento Clinica Médica"
echo "=================================================="

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório certo
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}Erro: Execute este script na pasta raiz do projeto${NC}"
    exit 1
fi

# Verificar instalações
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js não encontrado. Instale em: https://nodejs.org${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm não encontrado${NC}"
    exit 1
fi

# Backend
echo -e "${YELLOW}[1/4] Verificando dependências Backend...${NC}"
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências Backend...${NC}"
    cd backend
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Erro instalando Backend${NC}"
        exit 1
    fi
    cd ..
fi

echo -e "${GREEN}✓ Backend pronto${NC}"

# Frontend
echo -e "${YELLOW}[2/4] Verificando dependências Frontend...${NC}"
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Instalando dependências Frontend...${NC}"
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Erro instalando Frontend${NC}"
        exit 1
    fi
    cd ..
fi

echo -e "${GREEN}✓ Frontend pronto${NC}"

# Verificar .env
echo -e "${YELLOW}[3/4] Verificando configuração Backend...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Criando arquivo .env...${NC}"
    cp backend/.env.example backend/.env
fi

echo -e "${GREEN}✓ Configuração pronta${NC}"

# Iniciar
echo -e "${YELLOW}[4/4] Iniciando aplicação...${NC}"

echo -e "${GREEN}✓ Iniciando Backend na porta 5000...${NC}"
cd backend
npm start &
BACKEND_PID=$!

sleep 3

cd ../frontend
echo -e "${GREEN}✓ Iniciando Frontend na porta 3000...${NC}"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=================================================="
echo -e "${GREEN}Sistema iniciado com sucesso!${NC}"
echo "=================================================="
echo ""
echo -e "${YELLOW}Backend:${NC} http://localhost:5000"
echo -e "${YELLOW}Frontend:${NC} http://localhost:3000"
echo -e "${YELLOW}API:${NC} http://localhost:5000/api"
echo ""
echo -e "${YELLOW}Para parar, pressione Ctrl+C${NC}"
echo ""

# Aguardar encerramento
wait $BACKEND_PID $FRONTEND_PID

echo -e "${YELLOW}Aplicação encerrada${NC}"
