# Backend - Sistema Lideranças Empáticas

API RESTful para o sistema de gerenciamento de lideranças empáticas, desenvolvida em Node.js com Express e MySQL.

## 🚀 Deploy em Produção

### Railway (Recomendado)

1. **Conecte o repositório**:
   - Acesse [railway.app](https://railway.app)
   - Clique em "Deploy from GitHub Repo"
   - Selecione este repositório
   - Escolha a pasta `/backend`

2. **Configure o banco MySQL**:
   - Adicione um serviço MySQL no Railway
   - Ou use PlanetScale (gratuito)

3. **Defina as variáveis de ambiente**:
   ```env
   DB_HOST=containers-us-west-xxx.railway.app
   DB_USER=root
   DB_PASSWORD=xxxxxxxxxx
   DB_NAME=railway
   DB_PORT=xxxx
   PORT=3001
   NODE_ENV=production
   ```

4. **Deploy automático**:
   - O Railway detectará automaticamente o projeto Node.js
   - Executará `npm install` e `npm start`
   - Criará as tabelas automaticamente

### Outras Plataformas

- **Render**: Similar ao Railway, com configuração via `render.yaml`
- **Heroku**: Requer Procfile e é mais caro
- **DigitalOcean App Platform**: Boa alternativa com preços competitivos

## 🛠️ Desenvolvimento Local

### Pré-requisitos

- Node.js 16+
- MySQL 8.0+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

### Configuração do Banco

O sistema criará automaticamente as seguintes tabelas:

- `edicoes` - Edições do programa
- `participantes` - Participantes das edições
- `equipes` - Equipes formadas
- `atividades` - Atividades das equipes
- `doacoes` - Registro de doações
- `metas` - Metas estabelecidas

## 📡 API Endpoints

### Informações do Sistema
- `GET /api` - Informações da API
- `GET /api/test` - Teste de funcionamento
- `GET /api/health` - Status da conexão com banco

### Edições
- `GET /api/edicoes` - Listar edições
- `GET /api/edicoes/:id` - Buscar edição
- `POST /api/edicoes` - Criar edição
- `PUT /api/edicoes/:id` - Atualizar edição
- `DELETE /api/edicoes/:id` - Excluir edição

### Participantes
- `GET /api/participantes` - Listar participantes
- `GET /api/participantes/:id` - Buscar participante
- `GET /api/participantes/edicao/:edicaoId` - Participantes por edição
- `POST /api/participantes` - Criar participante
- `PUT /api/participantes/:id` - Atualizar participante
- `DELETE /api/participantes/:id` - Excluir participante

### Equipes
- `GET /api/equipes` - Listar equipes
- `GET /api/equipes/:id` - Buscar equipe
- `GET /api/equipes/edicao/:edicaoId` - Equipes por edição
- `POST /api/equipes` - Criar equipe
- `PUT /api/equipes/:id` - Atualizar equipe
- `DELETE /api/equipes/:id` - Excluir equipe

### Atividades
- `GET /api/atividades` - Listar atividades
- `GET /api/atividades/:id` - Buscar atividade
- `GET /api/atividades/equipe/:equipeId` - Atividades por equipe
- `POST /api/atividades` - Criar atividade
- `PUT /api/atividades/:id` - Atualizar atividade
- `DELETE /api/atividades/:id` - Excluir atividade

### Doações
- `GET /api/doacoes` - Listar doações
- `GET /api/doacoes/:id` - Buscar doação
- `GET /api/doacoes/aluno/:aluno` - Doações por aluno
- `GET /api/doacoes/campanha/:campanha` - Doações por campanha
- `GET /api/doacoes/stats/resumo` - Estatísticas
- `POST /api/doacoes` - Registrar doação
- `PUT /api/doacoes/:id` - Atualizar doação
- `DELETE /api/doacoes/:id` - Excluir doação

### Metas
- `GET /api/metas` - Listar metas
- `GET /api/metas/:id` - Buscar meta
- `GET /api/metas/equipe/:equipe` - Metas por equipe
- `GET /api/metas/status/:status` - Metas por status
- `GET /api/metas/prioridade/:prioridade` - Metas por prioridade
- `GET /api/metas/periodo/:inicio/:fim` - Metas por período
- `GET /api/metas/stats/resumo` - Estatísticas
- `POST /api/metas` - Criar meta
- `PUT /api/metas/:id` - Atualizar meta
- `PATCH /api/metas/:id/status` - Atualizar status
- `DELETE /api/metas/:id` - Excluir meta

## 🧪 Testes

### Postman Collection

Importe os arquivos:
- `Liderancas_Empaticas_API.postman_collection.json`
- `Liderancas_Empaticas_Environment.postman_environment.json`

### Testes Manuais

```bash
# Teste básico
curl http://localhost:3001/api/test

# Health check
curl http://localhost:3001/api/health

# Criar edição
curl -X POST http://localhost:3001/api/edicoes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste 2025",
    "dataInicio": "2025-02-01",
    "dataFim": "2025-06-30",
    "descricao": "Edição de teste"
  }'
```

## 📊 Monitoramento

### Logs
```bash
# Ver logs em produção (Railway)
railway logs

# Logs locais
npm run dev
```

### Métricas Importantes
- Tempo de resposta das APIs
- Uso de CPU e memória
- Erros de conexão com banco
- Taxa de sucesso das requisições

## 🔧 Configurações

### Variáveis de Ambiente

```env
# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=liderancas_empaticas
DB_PORT=3306

# Servidor
PORT=3001
NODE_ENV=development
```

### CORS

O CORS está configurado para aceitar todas as origens em desenvolvimento. Para produção, configure origens específicas:

```javascript
app.use(cors({
  origin: ['https://seu-frontend.com', 'https://www.seu-frontend.com']
}));
```

## 🚨 Troubleshooting

### Erro de Conexão com Banco
1. Verifique as variáveis de ambiente
2. Confirme se o MySQL está rodando
3. Teste a conexão manualmente

### Porta em Uso
1. Use `process.env.PORT` sempre
2. Não fixe a porta no código
3. Verifique se não há outros processos na porta

### Tabelas Não Criadas
1. Verifique se a função `initializeDatabase()` está sendo chamada
2. Confirme as permissões do usuário do banco
3. Verifique os logs de inicialização

## 📝 Documentação Adicional

- [Documentação Completa da API](../DOCUMENTACAO_API.md)
- [Guia de Testes Postman](../GUIA_TESTES_POSTMAN.md)
- [Guia de Deploy Railway](../GUIA_DEPLOY_RAILWAY.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido pela Equipe Lideranças Empáticas - Projeto Interdisciplinar 2025**

