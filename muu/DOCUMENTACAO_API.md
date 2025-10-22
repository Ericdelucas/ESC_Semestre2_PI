# Documentação da API - Sistema Lideranças Empáticas

## Visão Geral

A API do Sistema Lideranças Empáticas é uma aplicação RESTful desenvolvida em Node.js com Express e MySQL, projetada para gerenciar edições, participantes, equipes, atividades, doações e metas do programa de liderança empática.

### Informações Técnicas

- **Versão:** 1.0.0
- **Base URL:** `http://localhost:3001/api` (desenvolvimento) / `https://sua-api.com/api` (produção)
- **Banco de Dados:** MySQL
- **Autenticação:** Não implementada (versão inicial)
- **Formato de Resposta:** JSON
- **Codificação:** UTF-8

### Estrutura de Resposta Padrão

Todas as respostas da API seguem o seguinte formato:

```json
{
  "message": "Descrição da operação realizada",
  "data": {} // ou [] para listas
}
```

Em caso de erro:

```json
{
  "error": "Descrição do erro"
}
```

## Endpoints Principais

### 1. Informações da API

#### GET /api
Retorna informações gerais sobre a API.

**Resposta de Sucesso (200):**
```json
{
  "name": "Lideranças Empáticas API",
  "version": "1.0.0",
  "description": "API para gerenciamento do sistema Lideranças Empáticas",
  "database": "MySQL",
  "endpoints": {
    "edicoes": "/api/edicoes",
    "participantes": "/api/participantes",
    "equipes": "/api/equipes",
    "atividades": "/api/atividades",
    "doacoes": "/api/doacoes",
    "metas": "/api/metas",
    "test": "/api/test"
  }
}
```

#### GET /api/test
Endpoint de teste para verificar se a API está funcionando.

**Resposta de Sucesso (200):**
```json
{
  "message": "API Lideranças Empáticas funcionando!",
  "timestamp": "2025-01-18T10:30:00.000Z",
  "version": "1.0.0",
  "database": "MySQL"
}
```

#### GET /api/health
Verifica o status da conexão com o banco de dados.

**Resposta de Sucesso (200):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-18T10:30:00.000Z"
}
```

**Resposta de Erro (500):**
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Mensagem de erro",
  "timestamp": "2025-01-18T10:30:00.000Z"
}
```

## 2. Edições

As edições representam os períodos ou ciclos do programa de liderança empática.

### GET /api/edicoes
Lista todas as edições ordenadas por data de criação (mais recentes primeiro).

**Resposta de Sucesso (200):**
```json
{
  "message": "Edições listadas com sucesso",
  "data": [
    {
      "id": 1,
      "nome": "Lideranças Empáticas 2025.1",
      "dataInicio": "2025-02-01",
      "dataFim": "2025-06-30",
      "descricao": "Primeira edição de 2025",
      "status": "Planejada",
      "created_at": "2025-01-18T10:00:00.000Z"
    }
  ]
}
```

### GET /api/edicoes/:id
Busca uma edição específica pelo ID.

**Parâmetros:**
- `id` (number): ID da edição

**Resposta de Sucesso (200):**
```json
{
  "message": "Edição encontrada",
  "data": {
    "id": 1,
    "nome": "Lideranças Empáticas 2025.1",
    "dataInicio": "2025-02-01",
    "dataFim": "2025-06-30",
    "descricao": "Primeira edição de 2025",
    "status": "Planejada",
    "created_at": "2025-01-18T10:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Edição não encontrada"
}
```

### POST /api/edicoes
Cria uma nova edição.

**Corpo da Requisição:**
```json
{
  "nome": "Lideranças Empáticas 2025.2",
  "dataInicio": "2025-08-01",
  "dataFim": "2025-12-15",
  "descricao": "Segunda edição de 2025"
}
```

**Campos Obrigatórios:**
- `nome` (string): Nome da edição
- `dataInicio` (date): Data de início no formato YYYY-MM-DD
- `dataFim` (date): Data de fim no formato YYYY-MM-DD

**Campos Opcionais:**
- `descricao` (string): Descrição da edição

**Resposta de Sucesso (201):**
```json
{
  "message": "Edição criada com sucesso",
  "data": {
    "id": 2,
    "nome": "Lideranças Empáticas 2025.2",
    "dataInicio": "2025-08-01",
    "dataFim": "2025-12-15",
    "descricao": "Segunda edição de 2025",
    "status": "Planejada"
  }
}
```

### PUT /api/edicoes/:id
Atualiza uma edição existente.

**Parâmetros:**
- `id` (number): ID da edição

**Corpo da Requisição:**
```json
{
  "nome": "Lideranças Empáticas 2025.2 - Atualizada",
  "dataInicio": "2025-08-01",
  "dataFim": "2025-12-20",
  "descricao": "Segunda edição de 2025 - versão atualizada"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Edição atualizada com sucesso",
  "data": {
    "id": 2,
    "nome": "Lideranças Empáticas 2025.2 - Atualizada",
    "dataInicio": "2025-08-01",
    "dataFim": "2025-12-20",
    "descricao": "Segunda edição de 2025 - versão atualizada",
    "status": "Planejada"
  }
}
```

### DELETE /api/edicoes/:id
Exclui uma edição.

**Parâmetros:**
- `id` (number): ID da edição

**Resposta de Sucesso (200):**
```json
{
  "message": "Edição excluída com sucesso",
  "changes": 1
}
```

## 3. Participantes

Gerencia os participantes das edições do programa.

### GET /api/participantes
Lista todos os participantes com informações da edição associada.

**Resposta de Sucesso (200):**
```json
{
  "message": "Participantes listados com sucesso",
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao.silva@email.com",
      "telefone": "(11) 99999-9999",
      "tipo": "Aluno",
      "edicao_id": 1,
      "edicao_nome": "Lideranças Empáticas 2025.1",
      "created_at": "2025-01-18T10:00:00.000Z"
    }
  ]
}
```

### GET /api/participantes/:id
Busca um participante específico pelo ID.

### GET /api/participantes/edicao/:edicaoId
Lista participantes de uma edição específica.

**Parâmetros:**
- `edicaoId` (number): ID da edição

### POST /api/participantes
Cria um novo participante.

**Corpo da Requisição:**
```json
{
  "nome": "Maria Santos",
  "email": "maria.santos@email.com",
  "telefone": "(11) 88888-8888",
  "tipo": "Mentor",
  "edicao_id": 1
}
```

**Campos Obrigatórios:**
- `nome` (string): Nome do participante
- `email` (string): Email único do participante
- `tipo` (string): Tipo do participante (Aluno, Mentor, Coordenador, etc.)

**Campos Opcionais:**
- `telefone` (string): Telefone do participante
- `edicao_id` (number): ID da edição associada

### PUT /api/participantes/:id
Atualiza um participante existente.

### DELETE /api/participantes/:id
Exclui um participante.

## 4. Equipes

Gerencia as equipes formadas durante as edições.

### GET /api/equipes
Lista todas as equipes com informações da edição associada.

### GET /api/equipes/:id
Busca uma equipe específica pelo ID.

### GET /api/equipes/edicao/:edicaoId
Lista equipes de uma edição específica.

### POST /api/equipes
Cria uma nova equipe.

**Corpo da Requisição:**
```json
{
  "nome": "Equipe Alpha",
  "mentor": "Prof. Carlos Silva",
  "edicao_id": 1,
  "membros": "João Silva, Maria Santos, Pedro Costa"
}
```

**Campos Obrigatórios:**
- `nome` (string): Nome da equipe

**Campos Opcionais:**
- `mentor` (string): Nome do mentor da equipe
- `edicao_id` (number): ID da edição associada
- `membros` (string): Lista de membros da equipe

### PUT /api/equipes/:id
Atualiza uma equipe existente.

### DELETE /api/equipes/:id
Exclui uma equipe.

## 5. Atividades

Gerencia as atividades realizadas pelas equipes.

### GET /api/atividades
Lista todas as atividades com informações da equipe associada.

### GET /api/atividades/:id
Busca uma atividade específica pelo ID.

### GET /api/atividades/equipe/:equipeId
Lista atividades de uma equipe específica.

### POST /api/atividades
Cria uma nova atividade.

**Corpo da Requisição:**
```json
{
  "nome": "Campanha de Arrecadação",
  "tipo": "Arrecadação",
  "descricao": "Campanha para arrecadar alimentos",
  "equipe_id": 1,
  "meta_financeira": 1000.00,
  "valor_arrecadado": 250.00,
  "status": "Em Andamento"
}
```

**Campos Obrigatórios:**
- `nome` (string): Nome da atividade
- `tipo` (string): Tipo da atividade

**Campos Opcionais:**
- `descricao` (string): Descrição da atividade
- `equipe_id` (number): ID da equipe responsável
- `meta_financeira` (decimal): Meta financeira da atividade
- `valor_arrecadado` (decimal): Valor já arrecadado
- `status` (string): Status da atividade (Pendente, Em Andamento, Concluída)

### PUT /api/atividades/:id
Atualiza uma atividade existente.

### DELETE /api/atividades/:id
Exclui uma atividade.

## 6. Doações

Gerencia o registro de doações recebidas.

### GET /api/doacoes
Lista todas as doações ordenadas por data.

### GET /api/doacoes/:id
Busca uma doação específica pelo ID.

### GET /api/doacoes/aluno/:aluno
Lista doações por aluno responsável.

### GET /api/doacoes/campanha/:campanha
Lista doações por campanha.

### GET /api/doacoes/stats/resumo
Retorna estatísticas das doações.

**Resposta de Sucesso (200):**
```json
{
  "message": "Estatísticas de doações",
  "data": {
    "total_doacoes": 150,
    "total_pontuacao": 3500,
    "total_por_item": [
      {
        "item_doacao": "Alimentos",
        "quantidade": 50,
        "total_quantidade": 500.5,
        "total_pontos": 1500
      }
    ],
    "top_alunos": [
      {
        "aluno_responsavel": "João Silva",
        "total_doacoes": 15,
        "total_pontos": 450
      }
    ]
  }
}
```

### POST /api/doacoes
Cria um novo registro de doação.

**Corpo da Requisição:**
```json
{
  "data_doacao": "2025-01-18",
  "aluno_responsavel": "João Silva",
  "item_doacao": "Alimentos não perecíveis",
  "quantidade": 10.5,
  "campanha": "Natal Solidário",
  "doador": "Empresa XYZ",
  "pontuacao": 25
}
```

**Campos Obrigatórios:**
- `data_doacao` (date): Data da doação no formato YYYY-MM-DD
- `aluno_responsavel` (string): Nome do aluno responsável
- `item_doacao` (string): Descrição do item doado
- `quantidade` (decimal): Quantidade doada
- `pontuacao` (integer): Pontuação atribuída à doação

**Campos Opcionais:**
- `campanha` (string): Nome da campanha
- `doador` (string): Nome do doador

### PUT /api/doacoes/:id
Atualiza um registro de doação.

### DELETE /api/doacoes/:id
Exclui um registro de doação.

## 7. Metas

Gerencia as metas estabelecidas para as equipes e atividades.

### GET /api/metas
Lista todas as metas ordenadas por data.

### GET /api/metas/:id
Busca uma meta específica pelo ID.

### GET /api/metas/equipe/:equipe
Lista metas de uma equipe específica.

### GET /api/metas/status/:status
Lista metas por status.

**Status válidos:**
- `pendente`: Meta ainda não iniciada
- `em_andamento`: Meta em execução
- `concluida`: Meta finalizada com sucesso
- `cancelada`: Meta cancelada

### GET /api/metas/prioridade/:prioridade
Lista metas por prioridade.

**Prioridades válidas:**
- `baixa`: Prioridade baixa
- `media`: Prioridade média
- `alta`: Prioridade alta

### GET /api/metas/periodo/:dataInicio/:dataFim
Lista metas por período.

**Parâmetros:**
- `dataInicio` (date): Data de início no formato YYYY-MM-DD
- `dataFim` (date): Data de fim no formato YYYY-MM-DD

### GET /api/metas/stats/resumo
Retorna estatísticas das metas.

**Resposta de Sucesso (200):**
```json
{
  "message": "Estatísticas de metas",
  "data": {
    "total_metas": 45,
    "metas_por_status": [
      {
        "status": "pendente",
        "quantidade": 15
      },
      {
        "status": "em_andamento",
        "quantidade": 20
      },
      {
        "status": "concluida",
        "quantidade": 8
      },
      {
        "status": "cancelada",
        "quantidade": 2
      }
    ],
    "metas_por_prioridade": [
      {
        "prioridade": "alta",
        "quantidade": 12
      },
      {
        "prioridade": "media",
        "quantidade": 25
      },
      {
        "prioridade": "baixa",
        "quantidade": 8
      }
    ],
    "metas_por_equipe": [
      {
        "equipe": "Equipe Alpha",
        "quantidade": 8
      }
    ]
  }
}
```

### POST /api/metas
Cria uma nova meta.

**Corpo da Requisição:**
```json
{
  "data": "2025-02-15",
  "titulo": "Arrecadar 500kg de alimentos",
  "descricao": "Meta para a campanha do agasalho",
  "equipe": "Equipe Alpha",
  "prioridade": "alta",
  "status": "pendente"
}
```

**Campos Obrigatórios:**
- `data` (date): Data da meta no formato YYYY-MM-DD
- `titulo` (string): Título da meta

**Campos Opcionais:**
- `descricao` (string): Descrição detalhada da meta
- `equipe` (string): Nome da equipe responsável
- `prioridade` (string): Prioridade da meta (baixa, media, alta)
- `status` (string): Status da meta (pendente, em_andamento, concluida, cancelada)

### PUT /api/metas/:id
Atualiza uma meta existente.

### PATCH /api/metas/:id/status
Atualiza apenas o status de uma meta.

**Corpo da Requisição:**
```json
{
  "status": "em_andamento"
}
```

### DELETE /api/metas/:id
Exclui uma meta.

## Códigos de Status HTTP

A API utiliza os seguintes códigos de status HTTP:

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Dados inválidos ou campos obrigatórios ausentes
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## Tratamento de Erros

Todos os erros retornam um objeto JSON com a seguinte estrutura:

```json
{
  "error": "Descrição do erro"
}
```

### Erros Comuns

1. **Campos obrigatórios ausentes (400)**:
   ```json
   {
     "error": "Nome, data de início e data de fim são obrigatórios"
   }
   ```

2. **Recurso não encontrado (404)**:
   ```json
   {
     "error": "Edição não encontrada"
   }
   ```

3. **Email duplicado (400)**:
   ```json
   {
     "error": "Email já cadastrado"
   }
   ```

4. **Erro de conexão com banco (500)**:
   ```json
   {
     "error": "Erro ao conectar com o banco de dados"
   }
   ```

## Configuração e Instalação

### Pré-requisitos

- Node.js 16+ 
- MySQL 8.0+
- npm ou yarn

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=liderancas_empaticas
DB_PORT=3306
PORT=3001
```

### Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

### Estrutura do Banco de Dados

O sistema cria automaticamente as seguintes tabelas:

1. **edicoes**: Armazena informações das edições
2. **participantes**: Dados dos participantes
3. **equipes**: Informações das equipes
4. **atividades**: Atividades realizadas
5. **doacoes**: Registro de doações
6. **metas**: Metas estabelecidas

## Exemplos de Uso

### Criar uma nova edição e participante

```bash
# 1. Criar edição
curl -X POST http://localhost:3001/api/edicoes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Lideranças Empáticas 2025.1",
    "dataInicio": "2025-02-01",
    "dataFim": "2025-06-30",
    "descricao": "Primeira edição de 2025"
  }'

# 2. Criar participante
curl -X POST http://localhost:3001/api/participantes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "telefone": "(11) 99999-9999",
    "tipo": "Aluno",
    "edicao_id": 1
  }'
```

### Registrar uma doação

```bash
curl -X POST http://localhost:3001/api/doacoes \
  -H "Content-Type: application/json" \
  -d '{
    "data_doacao": "2025-01-18",
    "aluno_responsavel": "João Silva",
    "item_doacao": "Alimentos não perecíveis",
    "quantidade": 10.5,
    "campanha": "Natal Solidário",
    "doador": "Empresa XYZ",
    "pontuacao": 25
  }'
```

## Considerações de Segurança

**Versão Atual (1.0.0):**
- Não possui autenticação implementada
- Todas as rotas são públicas
- Adequado apenas para ambiente de desenvolvimento/demonstração

**Recomendações para Produção:**
- Implementar autenticação JWT
- Adicionar validação de permissões por role
- Configurar HTTPS
- Implementar rate limiting
- Adicionar logs de auditoria
- Validar e sanitizar todas as entradas

## Suporte e Contato

Para dúvidas sobre a API, entre em contato com a equipe de desenvolvimento do projeto Lideranças Empáticas.

---

*Documentação gerada automaticamente - Versão 1.0.0*

