# 🎟️ Sistema de Filipetas - Igreja

Sistema completo de venda e gerenciamento de filipetas (ingressos) para eventos da igreja, com integração Firebase Firestore.

## � Deploy Rápido

```bash
# Build e deploy para produção
npm run build
firebase deploy --only hosting
```

📖 **Guia completo:** [DEPLOY.md](./DEPLOY.md)

## �🔥 IMPORTANTE: Configuração do Firebase

Antes de usar o sistema, você precisa configurar o Firebase. **Leia o arquivo [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** para instruções detalhadas.

### Configuração Rápida:

1. **Instalar Firebase:**

```bash
npm install firebase
```

2. **Configurar credenciais:**

   - Crie um arquivo `.env` na raiz do projeto
   - Copie o conteúdo de `.env.example`
   - Substitua com suas credenciais do Firebase Console

3. **Ou edite diretamente:**
   - Abra `src/lib/firebase.ts`
   - Substitua as credenciais do Firebase

## 🔐 Autenticação

O sistema possui autenticação com Google. **Leia:** [AUTH_SETUP.md](./AUTH_SETUP.md)

- ✅ Apenas o email autorizado pode acessar o dashboard
- ✅ Login com Google
- ✅ Proteção de rotas

---

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e59d4c25-5784-4a70-831b-8efdde661916

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e59d4c25-5784-4a70-831b-8efdde661916) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e59d4c25-5784-4a70-831b-8efdde661916) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
