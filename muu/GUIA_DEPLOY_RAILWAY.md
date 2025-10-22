# Guia Completo de Deploy no Railway - Backend Lideranças Empáticas

## Pré-requisitos

1. **Conta GitHub** com o repositório do projeto
2. **Conta Railway** (gratuita com $5 de créditos mensais)
3. **Projeto preparado** com as configurações necessárias

## Passo 1: Login no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "Deploy a new project"
3. Escolha "Continue with GitHub" para autenticação
4. Autorize o Railway a acessar seus repositórios

## Passo 2: Conectar Repositório

1. Após o login, você verá opções de deploy:
   - **Deploy from GitHub Repo** ← Escolha esta opção
   - Deploy a Template
   - Deploy PostgreSQL
   - Deploy MySQL
   - Empty Project

2. Selecione o repositório do projeto "Lideranças Empáticas"
3. Escolha a pasta `/backend` se o projeto estiver em monorepo
4. Clique em "Deploy"

## Passo 3: Configurar Banco de Dados MySQL

### Opção A: Usar Railway MySQL (Recomendado)
1. No dashboard do projeto, clique em "New Service"
2. Selecione "Database" → "MySQL"
3. Aguarde a criação do banco
4. Anote as credenciais geradas automaticamente

### Opção B: Usar PlanetScale (Gratuito)
1. Crie conta em [planetscale.com](https://planetscale.com)
2. Crie um novo banco de dados
3. Obtenha a connection string
4. Use no Railway como variável de ambiente

## Passo 4: Configurar Variáveis de Ambiente

No Railway, vá em **Variables** e adicione:

```env
# Banco de Dados (Railway MySQL)
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=xxxxxxxxxx
DB_NAME=railway
DB_PORT=xxxx

# Ou para PlanetScale
DATABASE_URL=mysql://username:password@host:port/database?sslaccept=strict

# Configurações do Servidor
PORT=3001
NODE_ENV=production
```

**Importante**: O Railway fornece essas variáveis automaticamente se você usar o MySQL deles. Acesse a aba "Connect" do serviço MySQL para copiar os valores.

## Passo 5: Verificar Configurações do Projeto

### 5.1 Verificar package.json
Certifique-se de que o `package.json` tem os scripts corretos:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required'"
  }
}
```

### 5.2 Verificar server.js
O servidor deve escutar na porta correta:

```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

## Passo 6: Deploy Automático

1. O Railway detectará automaticamente que é um projeto Node.js
2. Instalará as dependências com `npm install`
3. Executará `npm start`
4. Criará as tabelas automaticamente (nossa função `initializeDatabase()`)

## Passo 7: Verificar Deploy

### 7.1 Verificar Logs
1. No dashboard, clique no serviço backend
2. Vá na aba "Logs"
3. Verifique se não há erros
4. Procure por mensagens como:
   - "Conectado ao banco de dados MySQL"
   - "Tabelas do banco de dados inicializadas"
   - "Servidor rodando na porta 3001"

### 7.2 Testar API
1. Copie a URL pública do serviço (algo como `https://backend-production-xxxx.up.railway.app`)
2. Teste os endpoints:
   ```bash
   # Teste básico
   curl https://sua-url.up.railway.app/api/test
   
   # Health check
   curl https://sua-url.up.railway.app/api/health
   
   # Informações da API
   curl https://sua-url.up.railway.app/api
   ```

## Passo 8: Configurar Domínio Personalizado (Opcional)

1. No serviço backend, vá em "Settings"
2. Na seção "Domains", clique "Generate Domain"
3. Ou adicione um domínio personalizado se tiver

## Passo 9: Monitoramento

### 9.1 Métricas Disponíveis
- CPU Usage
- Memory Usage
- Network Egress
- Error Logs
- Request Logs

### 9.2 Configurar Alertas
1. Vá em "Settings" → "Notifications"
2. Configure alertas para:
   - Alto uso de CPU
   - Erros de aplicação
   - Downtime

## Troubleshooting Comum

### Erro: "Cannot connect to database"
**Solução**:
1. Verifique as variáveis de ambiente
2. Confirme se o MySQL está rodando
3. Teste a conexão manualmente

### Erro: "Port already in use"
**Solução**:
1. Certifique-se de usar `process.env.PORT`
2. Não fixe a porta no código

### Erro: "Build failed"
**Solução**:
1. Verifique se todas as dependências estão no `package.json`
2. Confirme se não há erros de sintaxe
3. Verifique os logs de build

### Aplicação não responde
**Solução**:
1. Verifique se está escutando em `0.0.0.0`
2. Confirme se a porta está correta
3. Verifique os logs de runtime

## Custos Estimados

### Tier Gratuito (Railway)
- **$5/mês em créditos** (suficiente para desenvolvimento)
- **500MB RAM** por serviço
- **1GB storage** por banco
- **100GB bandwidth**

### Custos Adicionais
- **MySQL**: $3/mês (se usar Railway MySQL)
- **Upgrade para 1GB RAM**: $10/mês
- **Bandwidth extra**: $0.10/GB

## Próximos Passos

1. **Testar todas as rotas** com Postman
2. **Configurar CORS** para o frontend
3. **Implementar logs estruturados**
4. **Configurar backup do banco**
5. **Monitorar performance**

## Scripts Úteis

### Deploy via CLI (Opcional)
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Backup do Banco
```bash
# Conectar ao banco Railway
railway connect mysql

# Fazer backup
mysqldump -h host -u user -p database > backup.sql
```

## Checklist Final

- [ ] Repositório conectado ao Railway
- [ ] MySQL configurado e rodando
- [ ] Variáveis de ambiente definidas
- [ ] Deploy realizado com sucesso
- [ ] API respondendo corretamente
- [ ] Logs sem erros críticos
- [ ] Endpoints testados
- [ ] URL pública anotada
- [ ] Monitoramento configurado

## URLs Importantes

- **Dashboard Railway**: https://railway.app/dashboard
- **Documentação**: https://docs.railway.app
- **Status Page**: https://status.railway.app
- **Suporte**: https://help.railway.app

---

**Próximo**: Após o deploy do backend, faremos o deploy do frontend no Netlify/Vercel e conectaremos os dois serviços.

