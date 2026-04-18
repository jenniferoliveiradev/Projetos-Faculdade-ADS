@echo off
REM Script para iniciar o projeto completo no Windows
REM Uso: Duplo clique neste arquivo

echo.
echo ======================================================
echo 7H Sistema de Agendamento - Clinica Medica
echo ======================================================
echo.

REM Verificar se está no diretório certo
if not exist "backend" (
    echo [ERRO] Pasta 'backend' nao encontrada!
    echo Execute este arquivo na raiz do projeto
    pause
    exit /b 1
)

if not exist "frontend" (
    echo [ERRO] Pasta 'frontend' nao encontrada!
    echo Execute este arquivo na raiz do projeto
    pause
    exit /b 1
)

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Instale em: https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] Verificando dependencias Backend...
if not exist "backend\node_modules" (
    echo [INFO] Instalando dependencias Backend...
    cd backend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Erro ao instalar Backend
        pause
        exit /b 1
    )
    cd ..
)

echo [OK] Backend pronto

echo [INFO] Verificando dependencias Frontend...
if not exist "frontend\node_modules" (
    echo [INFO] Instalando dependencias Frontend...
    cd frontend
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Erro ao instalar Frontend
        pause
        exit /b 1
    )
    cd ..
)

echo [OK] Frontend pronto

REM Verificar .env
if not exist "backend\.env" (
    echo [INFO] Criando arquivo .env...
    copy backend\.env.example backend\.env
)

echo [OK] Configuracao pronta

echo.
echo ======================================================
echo Iniciando aplicacao...
echo ======================================================
echo.

REM Iniciar Backend em nova janela
echo [INFO] Iniciando Backend na porta 5000...
start "Backend - Clinica" cmd /k "cd backend && npm start"

REM Aguardar 3 segundos
timeout /t 3

REM Iniciar Frontend em nova janela
echo [INFO] Iniciando Frontend na porta 3000...
start "Frontend - Clinica" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================================
echo Sistema iniciado com sucesso!
echo ======================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo API:      http://localhost:5000/api/teste
echo.
echo Janelas de terminal foram abertas
echo Feche as janelas quando quiser parar
echo.
pause
