# 🔐 Configuração da Autenticação Firebase

## 🔒 RESTRIÇÃO DE ACESSO

**⚠️ IMPORTANTE:** Apenas o email `joaopedrooliveira030506@gmail.com` pode acessar o dashboard!

Qualquer outra conta Google será bloqueada automaticamente, mesmo que tente fazer login.

### Como Adicionar Mais Administradores:

Edite o arquivo `src/lib/config.ts` e altere o email autorizado:

```typescript
export const AUTHORIZED_EMAIL = "seu-novo-email@gmail.com";
```

## ⚠️ IMPORTANTE: Ativar Authentication no Firebase Console

Para que o login funcione, você precisa ativar a autenticação do Google no Firebase Console.

### Passo 1: Ativar Authentication

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto `ticket-igreja`
3. No menu lateral, clique em **"Authentication"** (Autenticação)
4. Clique em **"Get Started"** (Começar)

### Passo 2: Adicionar Provedor Google

1. Vá para a aba **"Sign-in method"** (Método de login)
2. Clique em **"Add new provider"** (Adicionar novo provedor)
3. Selecione **"Google"**
4. **Ative o provedor** (toggle para enabled)
5. Configure:
   - **Project support email**: Selecione seu email
   - **Project public-facing name**: "Sistema de Filipetas" (ou o nome que preferir)
6. Clique em **"Save"** (Salvar)

### Passo 3: Domínios Autorizados (para produção)

Quando fizer deploy, você precisa adicionar seu domínio:

1. Na aba **"Settings"** > **"Authorized domains"**
2. Adicione seu domínio de produção
3. Por padrão, `localhost` já está autorizado para desenvolvimento

## 🎯 Como Funciona

### Fluxo de Autenticação:

1. **Usuário clica em "Dashboard"** → Redireciona para `/login`
2. **Usuário clica em "Continuar com Google"** → Popup de login do Google
3. **Após login bem-sucedido** → Redireciona para `/dashboard`
4. **Usuário não autenticado tenta acessar `/dashboard`** → Redireciona para `/login`

### Páginas Protegidas:

- ✅ `/dashboard` - Requer autenticação + email autorizado
- ❌ `/` (Compra) - Pública
- ❌ `/ticket/:id` (Detalhes) - Pública

## 🔧 Arquivos Criados/Modificados:

### Novos Arquivos:

1. **`src/contexts/AuthContext.tsx`** - Contexto de autenticação
2. **`src/components/ProtectedRoute.tsx`** - Componente de rota protegida com verificação de email
3. **`src/pages/Login.tsx`** - Página de login com verificação de email autorizado
4. **`src/lib/config.ts`** - Configuração centralizada do email autorizado

### Arquivos Modificados:

1. **`src/lib/firebase.ts`** - Adicionado Auth e GoogleProvider
2. **`src/App.tsx`** - Adicionado AuthProvider e rota protegida
3. **`src/pages/Dashboard.tsx`** - Adicionado botão de logout e info do usuário

## 🎨 Funcionalidades Implementadas:

- ✅ Login com Google (popup)
- ✅ **Verificação de email autorizado** - Apenas `joaopedrooliveira030506@gmail.com`
- ✅ **Logout automático** - Se email não autorizado tentar acessar
- ✅ Logout manual
- ✅ Proteção de rotas
- ✅ Redirecionamento automático
- ✅ Verificação de autenticação
- ✅ Exibição do email do usuário logado
- ✅ Estado de loading durante verificação

## 🚀 Testando Localmente:

1. **Configure o Firebase Authentication** (passos acima)
2. **Execute o projeto:**
   ```bash
   npm run dev
   ```
3. **Acesse:** `http://localhost:8080`
4. **Clique em "Dashboard"** no canto superior esquerdo
5. **Faça login com sua conta Google**
6. **Você será redirecionado para o dashboard**

## 🔒 Segurança:

### Regras de Firestore (Atualize!):

Para maior segurança, atualize as regras do Firestore para permitir apenas usuários autenticados:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tickets/{ticketId} {
      // Qualquer pessoa pode criar e ler filipetas
      allow create: if true;
      allow read: if true;

      // Apenas usuários autenticados podem marcar como usado
      allow update: if request.auth != null;

      // Ninguém pode deletar
      allow delete: if false;
    }
  }
}
```

### Para Produção (Opcional - Restrição Total):

Se quiser restringir tudo apenas para admins autenticados:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tickets/{ticketId} {
      // Qualquer pessoa pode criar filipetas (público)
      allow create: if true;
      allow read: if true;

      // Apenas usuários específicos podem modificar
      allow update, delete: if request.auth != null
        && request.auth.token.email in [
          'seu-email@gmail.com',
          'outro-admin@gmail.com'
        ];
    }
  }
}
```

## 📝 Notas Importantes:

1. **Ambiente de Desenvolvimento:** `localhost` já está autorizado por padrão
2. **Deploy em Produção:** Adicione seu domínio nos "Authorized domains"
3. **Múltiplos Admins:** Adicione emails na lista de regras do Firestore
4. **Primeiro Login:** Pode levar alguns segundos para processar

## 🐛 Troubleshooting:

**Erro: "This domain is not authorized"**

- Solução: Adicione o domínio em Authentication > Settings > Authorized domains

**Popup de login não abre**

- Solução: Verifique se popups não estão bloqueados no navegador

**Erro: "Configuration object is invalid"**

- Solução: Verifique se todas as credenciais no `.env` estão corretas

**Logout não funciona**

- Solução: Limpe o cache do navegador e tente novamente

## 💡 Próximos Passos:

1. ✅ Configure o Google Authentication no Firebase Console
2. ✅ Teste o login localmente
3. ✅ Atualize as regras de segurança do Firestore
4. ✅ Adicione outros admins (opcional)
5. ✅ Faça deploy e configure domínios autorizados

## 🔗 Links Úteis:

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google Sign-In Guide](https://firebase.google.com/docs/auth/web/google-signin)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
