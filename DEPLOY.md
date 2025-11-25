# 🚀 Guia de Deploy para Produção

## 📋 Pré-requisitos

- ✅ Firebase CLI instalado globalmente
- ✅ Projeto configurado no Firebase Console
- ✅ Autenticação configurada
- ✅ Firestore configurado

## 🔥 Deploy com Firebase Hosting

### Passo 1: Verificar Configuração

Certifique-se de que o arquivo `.env` está configurado corretamente:

```env
VITE_FIREBASE_API_KEY=AIzaSyBsO6Ww3fnbp2SOqWtujmUZhmXz__Y4nXU
VITE_FIREBASE_AUTH_DOMAIN=ticket-igreja.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ticket-igreja
VITE_FIREBASE_STORAGE_BUCKET=ticket-igreja.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=905763010884
VITE_FIREBASE_APP_ID=1:905763010884:web:dfb895d6db603f46dc3f11
```

### Passo 2: Build do Projeto

Execute o comando para criar a versão de produção:

```bash
npm run build
```

Isso criará a pasta `dist` com todos os arquivos otimizados.

### Passo 3: Verificar Preview Local (Opcional)

Teste a build localmente antes de fazer deploy:

```bash
npm run preview
```

Acesse `http://localhost:4173` para verificar.

### Passo 4: Deploy para Firebase

Execute o comando de deploy:

```bash
firebase deploy --only hosting
```

ou simplesmente:

```bash
firebase deploy
```

### Passo 5: Acessar o Site

Após o deploy, você receberá URLs como:

- **Hosting URL**: `https://ticket-igreja.web.app`
- **ou**: `https://ticket-igreja.firebaseapp.com`

## 🔐 Configurar Domínio Autorizado

**IMPORTANTE:** Após o primeiro deploy, você precisa autorizar o domínio no Firebase Authentication:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Authentication** > **Settings** > **Authorized domains**
3. Clique em **Add domain**
4. Adicione: `ticket-igreja.web.app`
5. Se tiver domínio customizado, adicione também

## 📝 Comandos Úteis

### Build de Produção
```bash
npm run build
```

### Preview Local da Build
```bash
npm run preview
```

### Deploy Completo (Hosting + Firestore Rules)
```bash
firebase deploy
```

### Deploy Apenas Hosting
```bash
firebase deploy --only hosting
```

### Deploy Apenas Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Ver Sites Hospedados
```bash
firebase hosting:sites:list
```

## 🌐 Domínio Personalizado (Opcional)

### Se você tem um domínio próprio:

1. Acesse Firebase Console
2. Vá em **Hosting**
3. Clique em **Add custom domain**
4. Siga as instruções para adicionar registros DNS

Exemplo: `www.filipetas.com.br`

## 🔄 Deploy Automático com GitHub Actions

Você já tem o Firebase configurado! Para deploy automático:

### Opção 1: Via Firebase CLI

```bash
firebase init hosting:github
```

Siga os passos:
- Repository: `jp066/ticket-igreja`
- Autorize no GitHub
- Configure deploy automático

### Opção 2: Manual - Criar GitHub Action

Crie `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: ticket-igreja
```

### Configurar Secrets no GitHub:

1. Vá em **Settings** > **Secrets and variables** > **Actions**
2. Adicione os secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT` (gerado pelo Firebase CLI)

## ⚠️ Checklist Antes do Deploy

- [ ] Build funciona sem erros (`npm run build`)
- [ ] `.env` está configurado com credenciais corretas
- [ ] `.env` está no `.gitignore` (não commitar credenciais!)
- [ ] Firebase Authentication está ativado
- [ ] Google Sign-in está habilitado
- [ ] Firestore Database está criado
- [ ] Regras do Firestore estão configuradas
- [ ] Email autorizado está em `src/lib/config.ts`

## 🔍 Verificar Deploy

Após o deploy, teste:

1. ✅ Página de compra carrega
2. ✅ Pode comprar filipeta
3. ✅ Filipeta salva no Firestore
4. ✅ QR Code é gerado
5. ✅ Dashboard requer login
6. ✅ Login com Google funciona
7. ✅ Apenas email autorizado acessa
8. ✅ Pode marcar filipeta como usada

## 🐛 Troubleshooting

### Erro: "Build failed"
```bash
# Limpe e reinstale
rm -rf node_modules dist
npm install
npm run build
```

### Erro: "Firebase not initialized"
```bash
# Faça login novamente
firebase login
firebase use ticket-igreja
```

### Erro: "Domain not authorized"
- Vá em Firebase Console > Authentication > Settings
- Adicione o domínio do hosting

### Erro: "Firestore permission denied"
- Verifique as regras em `firestore.rules`
- Faça deploy das regras: `firebase deploy --only firestore:rules`

## 📊 Monitoramento

### Ver Logs
```bash
firebase hosting:channel:list
```

### Analytics (opcional)
Adicione Google Analytics no Firebase Console para monitorar:
- Número de visitantes
- Filipetas vendidas
- Taxa de conversão

## 🔒 Segurança em Produção

### Firestore Rules Recomendadas:

Atualize `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tickets/{ticketId} {
      // Qualquer pessoa pode criar e ler filipetas
      allow create: if true;
      allow read: if true;
      
      // Apenas usuário autorizado pode atualizar
      allow update: if request.auth != null 
        && request.auth.token.email == 'joaopedrooliveira030506@gmail.com';
      
      // Ninguém pode deletar
      allow delete: if false;
    }
  }
}
```

Deploy das regras:
```bash
firebase deploy --only firestore:rules
```

## 🎉 Pronto!

Seu sistema está no ar em:
- `https://ticket-igreja.web.app`
- `https://ticket-igreja.firebaseapp.com`

## 📞 Suporte

- [Firebase Docs](https://firebase.google.com/docs/hosting)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
