# 🔧 Solução de Problemas - Login Google

## ❌ Erro: `net::ERR_BLOCKED_BY_CLIENT`

Este erro ocorre quando **extensões do navegador ou configurações de segurança** bloqueiam a requisição de autenticação do Google.

### ✅ Soluções Rápidas

#### 1. **Desabilitar Extensões de Bloqueio**

Extensões que podem causar o problema:

- ✖️ AdBlock / AdBlock Plus
- ✖️ uBlock Origin
- ✖️ Privacy Badger
- ✖️ Ghostery
- ✖️ NoScript
- ✖️ HTTPS Everywhere (em alguns casos)

**Como desabilitar:**

1. Clique no ícone da extensão na barra de ferramentas
2. Desabilite para `localhost:8080`
3. **OU** desabilite temporariamente todas as extensões:
   - Chrome: `chrome://extensions/` - Toggle OFF
   - Edge: `edge://extensions/` - Toggle OFF
   - Firefox: `about:addons` - Desabilitar

#### 2. **Desabilitar Bloqueador de Popups**

1. Chrome: Configurações → Privacidade e segurança → Configurações de site → Pop-ups e redirecionamentos → Permitir
2. Edge: Configurações → Cookies e permissões de site → Pop-ups e redirecionamentos → Permitir
3. Firefox: Configurações → Privacidade e segurança → Permissões → Bloquear janelas pop-up → Desmarcar

#### 3. **Usar Modo Anônimo/Privado**

O modo anônimo geralmente tem menos extensões ativas:

- Chrome: `Ctrl + Shift + N`
- Edge: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`

Acesse: http://localhost:8080/login

#### 4. **Testar em Outro Navegador**

Se estiver usando Firefox ou Edge, tente no **Google Chrome**.

#### 5. **Verificar Antivírus/Firewall**

Alguns antivírus bloqueiam requisições ao Google:

- Kaspersky
- Avast
- AVG
- Windows Defender (raramente)

**Solução:** Adicione `localhost:8080` às exceções do antivírus.

#### 6. **Limpar Cache e Cookies**

1. Pressione `Ctrl + Shift + Delete`
2. Marque "Cookies" e "Cache"
3. Período: "Última hora" ou "Todo período"
4. Clique em "Limpar dados"

---

## 🔍 Diagnóstico Completo

### Verificar Console do Navegador

1. Pressione `F12` para abrir DevTools
2. Vá para a aba **Console**
3. Clique no botão de login
4. Veja os erros exibidos:

#### Erro A: `net::ERR_BLOCKED_BY_CLIENT`

**Causa:** Extensão de bloqueio ou antivírus
**Solução:** Siga passos 1-5 acima

#### Erro B: `auth/popup-blocked`

**Causa:** Bloqueador de popup do navegador
**Solução:** Passo 2 acima

#### Erro C: `auth/popup-closed-by-user`

**Causa:** Usuário fechou o popup antes de completar login
**Solução:** Tente novamente e complete o login

#### Erro D: Avisos do React Router

**Causa:** Avisos normais de desenvolvimento (não afetam login)
**Solução:** Pode ignorar (serão removidos em produção)

---

## 🚀 Teste com Firebase Hosting (Produção)

Se o problema persistir **apenas em desenvolvimento**, faça deploy para Firebase Hosting:

```bash
# Build do projeto
npm run build

# Deploy para Firebase
firebase deploy
```

Acesse a URL de produção fornecida (ex: `https://seu-projeto.web.app/login`)

**O Firebase Hosting tem configurações otimizadas** que geralmente resolvem problemas de COOP e bloqueios.

---

## 📧 Email Autorizado

⚠️ **Apenas o seguinte email pode acessar o dashboard:**

- `joaopedrooliveira030506@gmail.com`

Se logar com outro email, você verá:

> "Acesso negado. Apenas o administrador autorizado pode acessar este painel."

---

## 🆘 Última Solução

Se **nada funcionar**, entre em contato e forneça:

1. Navegador e versão (ex: Chrome 120)
2. Sistema operacional (ex: Windows 11)
3. Print do console (F12 → Console)
4. Extensões instaladas

---

## ✅ Checklist de Verificação

- [ ] Extensões de bloqueio desabilitadas
- [ ] Bloqueador de popups desabilitado
- [ ] Testado em modo anônimo
- [ ] Testado em outro navegador
- [ ] Cache limpo
- [ ] Antivírus com exceção para localhost
- [ ] Console do navegador verificado (F12)
- [ ] Email correto (joaopedrooliveira030506@gmail.com)

---

**Após seguir esses passos, o login deve funcionar! 🎉**
