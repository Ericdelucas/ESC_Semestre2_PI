# Guia Completo de Deploy Frontend - Lideranças Empáticas

Deploy da aplicação React/Vite no Vercel com integração ao backend Railway.

## 🚀 Deploy no Vercel (Recomendado)

### Pré-requisitos
1. **Conta GitHub** com o repositório do projeto
2. **Conta Vercel** (gratuita)
3. **Backend já deployado** no Railway com URL pública

### Passo 1: Preparar o Projeto

#### 1.1 Configurar Variáveis de Ambiente
Crie um arquivo `.env` baseado no `.env.example`:

```env
# URL da API de produção (substitua pela URL do seu backend Railway)
VITE_API_URL=https://sua-api-production.up.railway.app/api

# Configurações da aplicação
VITE_APP_NAME=Lideranças Empáticas
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

#### 1.2 Testar Build Local
```bash
# Instalar dependências
npm install

# Testar build
npm run build

# Testar preview local
npm run preview
```

### Passo 2: Deploy no Vercel

#### Opção A: Via Interface Web (Recomendado)

1. **Acesse o Vercel**:
   - Vá para [vercel.com](https://vercel.com)
   - Faça login com GitHub

2. **Importe o Projeto**:
   - Clique em "New Project"
   - Selecione "Import Git Repository"
   - Escolha o repositório do projeto
   - Selecione a pasta `/muu` (frontend)

3. **Configure o Deploy**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Adicione Variáveis de Ambiente**:
   - Na seção "Environment Variables", adicione:
     ```
     VITE_API_URL = https://sua-api-production.up.railway.app/api
     VITE_APP_NAME = Lideranças Empáticas
     VITE_APP_VERSION = 1.0.0
     ```

5. **Deploy**:
   - Clique em "Deploy"
   - Aguarde o build completar
   - Sua aplicação estará disponível em uma URL `.vercel.app`

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir as instruções interativas
```

### Passo 3: Configurar Domínio Personalizado (Opcional)

1. **No Dashboard do Vercel**:
   - Vá para o projeto
   - Clique em "Settings" → "Domains"
   - Adicione seu domínio personalizado

2. **Configurar DNS**:
   - Aponte seu domínio para os servidores do Vercel
   - Aguarde propagação DNS (até 48h)

### Passo 4: Configurar Deploy Automático

1. **Conectar Repositório**:
   - O Vercel já conecta automaticamente ao GitHub
   - Cada push na branch principal fará deploy automático

2. **Preview Deployments**:
   - Pull requests geram URLs de preview
   - Ideal para testar mudanças antes do merge

## 🌐 Deploy no Netlify (Alternativa)

### Passo 1: Preparar Projeto

1. **Configurar Build**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **Criar arquivo `_redirects`** em `public/`:
   ```
   /*    /index.html   200
   ```

### Passo 2: Deploy

1. **Via Interface**:
   - Acesse [netlify.com](https://netlify.com)
   - Conecte repositório GitHub
   - Configure build settings
   - Deploy

2. **Via CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

## 🔧 Configurações de Produção

### Performance Otimizations

#### 1. Vite Config (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          axios: ['axios']
        }
      }
    }
  }
})
```

#### 2. Headers de Cache (`vercel.json`)
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### SEO e Meta Tags

#### 1. Atualizar `index.html`
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Sistema de gerenciamento de lideranças empáticas" />
  <meta name="keywords" content="liderança, empática, gestão, equipes" />
  <meta name="author" content="Equipe Lideranças Empáticas" />
  <title>Lideranças Empáticas - Sistema de Gestão</title>
</head>
```

## 🧪 Testes de Produção

### Checklist de Verificação

- [ ] **Build Local**: `npm run build` executa sem erros
- [ ] **Preview Local**: `npm run preview` funciona corretamente
- [ ] **API Connection**: Frontend conecta com backend em produção
- [ ] **Responsividade**: Layout funciona em mobile e desktop
- [ ] **Performance**: Lighthouse Score > 90
- [ ] **SEO**: Meta tags configuradas
- [ ] **HTTPS**: SSL ativo automaticamente
- [ ] **Custom Domain**: Configurado se necessário

### Testes Funcionais

```bash
# Testar conexão com API
curl https://seu-frontend.vercel.app

# Verificar se carrega recursos
curl -I https://seu-frontend.vercel.app/assets/index.js

# Testar responsividade (via browser dev tools)
```

## 📊 Monitoramento

### Vercel Analytics

1. **Ativar Analytics**:
   - No dashboard do projeto
   - Vá em "Analytics"
   - Ative o Web Analytics

2. **Métricas Disponíveis**:
   - Page Views
   - Unique Visitors
   - Core Web Vitals
   - Top Pages

### Logs e Debugging

```bash
# Ver logs de build
vercel logs

# Ver logs de função (se houver)
vercel logs --follow
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Build Falha
**Sintomas**: Build não completa
**Soluções**:
- Verificar se todas as dependências estão no `package.json`
- Checar erros de TypeScript/ESLint
- Validar sintaxe de componentes React

#### 2. API Não Conecta
**Sintomas**: Erro 404/500 nas chamadas da API
**Soluções**:
- Verificar se `VITE_API_URL` está correta
- Confirmar se backend está rodando
- Checar CORS no backend

#### 3. Roteamento SPA
**Sintomas**: Erro 404 em rotas diretas
**Soluções**:
- Verificar se `vercel.json` tem rewrites configurados
- Para Netlify, criar arquivo `_redirects`

#### 4. Variáveis de Ambiente
**Sintomas**: `undefined` em `import.meta.env`
**Soluções**:
- Variáveis devem começar com `VITE_`
- Configurar no dashboard da plataforma
- Rebuild após adicionar variáveis

### Comandos de Debug

```bash
# Verificar variáveis de ambiente
echo $VITE_API_URL

# Testar build local
npm run build && npm run preview

# Verificar tamanho do bundle
npx vite-bundle-analyzer dist
```

## 📈 Otimizações Avançadas

### Code Splitting

```javascript
// Lazy loading de componentes
const Dashboard = lazy(() => import('./components/Dashboard'));
const Participantes = lazy(() => import('./components/Participantes'));

// Usar com Suspense
<Suspense fallback={<div>Carregando...</div>}>
  <Dashboard />
</Suspense>
```

### Service Worker (PWA)

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
```

## 🔗 Links Úteis

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev/guide/
- **React Docs**: https://react.dev

## 📝 Próximos Passos

1. **Configurar Monitoramento**: Analytics e error tracking
2. **Implementar PWA**: Service workers e cache
3. **Otimizar Performance**: Code splitting e lazy loading
4. **Configurar CI/CD**: Testes automáticos
5. **Backup e Versionamento**: Estratégia de releases

---

**Desenvolvido pela Equipe Lideranças Empáticas - Projeto Interdisciplinar 2025**

