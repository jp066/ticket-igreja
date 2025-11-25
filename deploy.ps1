# Script de Deploy - Sistema de Filipetas

Write-Host "🚀 Iniciando processo de deploy..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta correta
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto!" -ForegroundColor Red
    exit 1
}

# Passo 1: Verificar .env
Write-Host "📋 Verificando arquivo .env..." -ForegroundColor Yellow
if (-Not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "Crie o arquivo .env com as credenciais do Firebase" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
Write-Host ""

# Passo 2: Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependências instaladas" -ForegroundColor Green
Write-Host ""

# Passo 3: Build do projeto
Write-Host "🔨 Fazendo build do projeto..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build concluído com sucesso" -ForegroundColor Green
Write-Host ""

# Passo 4: Deploy
Write-Host "🚀 Fazendo deploy para Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no deploy!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Seu site está disponível em:" -ForegroundColor Cyan
Write-Host "   https://ticket-igreja.web.app" -ForegroundColor White
Write-Host "   https://ticket-igreja.firebaseapp.com" -ForegroundColor White
Write-Host ""
Write-Host "📝 Não esqueça de:" -ForegroundColor Yellow
Write-Host "   1. Autorizar o domínio no Firebase Authentication" -ForegroundColor White
Write-Host "   2. Atualizar as regras do Firestore se necessário" -ForegroundColor White
Write-Host ""
