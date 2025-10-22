# Guia de Testes com Postman - API Lideranças Empáticas

## Introdução

Este guia fornece instruções detalhadas para testar a API do Sistema Lideranças Empáticas usando o Postman. A collection inclui todos os endpoints disponíveis com exemplos de requisições e respostas.

## Pré-requisitos

1. **Postman instalado** (versão desktop ou web)
2. **Servidor da API rodando** em `http://localhost:3001`
3. **Banco de dados MySQL configurado** e conectado

## Importando a Collection

### Passo 1: Importar Collection
1. Abra o Postman
2. Clique em "Import" no canto superior esquerdo
3. Selecione o arquivo `Liderancas_Empaticas_API.postman_collection.json`
4. Clique em "Import"

### Passo 2: Importar Environment
1. Clique em "Import" novamente
2. Selecione o arquivo `Liderancas_Empaticas_Environment.postman_environment.json`
3. Clique em "Import"
4. Selecione o environment "Lideranças Empáticas - Environment" no dropdown superior direito

## Estrutura da Collection

A collection está organizada nas seguintes pastas:

### 1. Sistema
- **Informações da API**: Retorna informações gerais da API
- **Teste da API**: Endpoint de teste básico
- **Health Check**: Verifica status da conexão com o banco

### 2. Edições
- Operações CRUD completas para edições
- Inclui validação automática de status baseado em datas

### 3. Participantes
- Gerenciamento de participantes
- Busca por edição
- Validação de email único

### 4. Equipes
- Operações CRUD para equipes
- Associação com edições
- Gerenciamento de membros

### 5. Atividades
- Gerenciamento de atividades das equipes
- Controle de metas financeiras
- Acompanhamento de status

### 6. Doações
- Registro de doações
- Estatísticas e relatórios
- Busca por aluno e campanha

### 7. Metas
- Gerenciamento de metas
- Controle de prioridade e status
- Estatísticas detalhadas

## Sequência de Testes Recomendada

### Fase 1: Verificação do Sistema
```
1. Sistema → Teste da API
2. Sistema → Health Check
3. Sistema → Informações da API
```

### Fase 2: Configuração Básica
```
1. Edições → Criar Edição
2. Participantes → Criar Participante
3. Participantes → Criar Mentor
4. Equipes → Criar Equipe
```

### Fase 3: Operações Avançadas
```
1. Atividades → Criar Atividade de Arrecadação
2. Atividades → Criar Atividade com Meta Financeira
3. Doações → Registrar Doação de Alimentos
4. Doações → Registrar Doação de Roupas
5. Metas → Criar Meta de Alta Prioridade
```

### Fase 4: Consultas e Relatórios
```
1. Doações → Estatísticas de Doações
2. Metas → Estatísticas de Metas
3. Participantes → Listar Participantes por Edição
4. Equipes → Listar Equipes por Edição
```

## Cenários de Teste Detalhados

### Cenário 1: Fluxo Completo de uma Edição

#### 1.1 Criar Nova Edição
```http
POST /api/edicoes
{
  "nome": "Lideranças Empáticas 2025.1",
  "dataInicio": "2025-02-01",
  "dataFim": "2025-06-30",
  "descricao": "Primeira edição de 2025"
}
```

**Resultado Esperado**: Status 201, edição criada com ID 1

#### 1.2 Adicionar Participantes
```http
POST /api/participantes
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "telefone": "(11) 99999-9999",
  "tipo": "Aluno",
  "edicao_id": 1
}
```

#### 1.3 Formar Equipe
```http
POST /api/equipes
{
  "nome": "Equipe Alpha",
  "mentor": "Prof. Maria Santos",
  "edicao_id": 1,
  "membros": "João Silva, Ana Costa, Pedro Santos"
}
```

#### 1.4 Definir Atividades
```http
POST /api/atividades
{
  "nome": "Campanha do Agasalho",
  "tipo": "Arrecadação",
  "descricao": "Campanha para arrecadar agasalhos",
  "equipe_id": 1,
  "status": "Planejada"
}
```

### Cenário 2: Registro e Acompanhamento de Doações

#### 2.1 Registrar Primeira Doação
```http
POST /api/doacoes
{
  "data_doacao": "2025-01-18",
  "aluno_responsavel": "João Silva",
  "item_doacao": "Alimentos não perecíveis",
  "quantidade": 15.5,
  "campanha": "Natal Solidário",
  "doador": "Família Silva",
  "pontuacao": 30
}
```

#### 2.2 Verificar Estatísticas
```http
GET /api/doacoes/stats/resumo
```

#### 2.3 Buscar Doações por Aluno
```http
GET /api/doacoes/aluno/João Silva
```

### Cenário 3: Gerenciamento de Metas

#### 3.1 Criar Meta de Alta Prioridade
```http
POST /api/metas
{
  "data": "2025-02-15",
  "titulo": "Arrecadar 500kg de alimentos",
  "descricao": "Meta para campanha de alimentos",
  "equipe": "Equipe Alpha",
  "prioridade": "alta",
  "status": "pendente"
}
```

#### 3.2 Atualizar Status da Meta
```http
PATCH /api/metas/1/status
{
  "status": "em_andamento"
}
```

#### 3.3 Verificar Estatísticas de Metas
```http
GET /api/metas/stats/resumo
```

## Testes de Validação

### Validação de Campos Obrigatórios

#### Teste: Criar Edição sem Nome
```http
POST /api/edicoes
{
  "dataInicio": "2025-02-01",
  "dataFim": "2025-06-30"
}
```
**Resultado Esperado**: Status 400, erro "Nome, data de início e data de fim são obrigatórios"

#### Teste: Criar Participante com Email Duplicado
```http
POST /api/participantes
{
  "nome": "Outro João",
  "email": "joao.silva@email.com",  // Email já usado
  "tipo": "Aluno"
}
```
**Resultado Esperado**: Status 400, erro "Email já cadastrado"

### Validação de Recursos Não Encontrados

#### Teste: Buscar Edição Inexistente
```http
GET /api/edicoes/999
```
**Resultado Esperado**: Status 404, erro "Edição não encontrada"

#### Teste: Atualizar Participante Inexistente
```http
PUT /api/participantes/999
{
  "nome": "Nome Atualizado",
  "email": "novo@email.com",
  "tipo": "Aluno"
}
```
**Resultado Esperado**: Status 404, erro "Participante não encontrado"

## Variáveis de Environment

O environment inclui as seguintes variáveis:

- `base_url`: URL base da API (padrão: http://localhost:3001/api)
- `base_url_prod`: URL de produção (a ser configurada)
- `content_type`: Tipo de conteúdo (application/json)
- `edicao_id`: ID da edição para testes (padrão: 1)
- `participante_id`: ID do participante para testes (padrão: 1)
- `equipe_id`: ID da equipe para testes (padrão: 1)
- `atividade_id`: ID da atividade para testes (padrão: 1)
- `doacao_id`: ID da doação para testes (padrão: 1)
- `meta_id`: ID da meta para testes (padrão: 1)

### Configurando para Produção

Para testar em produção:
1. Duplique o environment
2. Altere `base_url` para a URL de produção
3. Atualize os IDs conforme necessário

## Scripts de Teste Automatizado

### Exemplo de Test Script (JavaScript)
```javascript
// Adicionar em Tests tab de uma requisição
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has message", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
});

pm.test("Response has data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});
```

### Exemplo de Pre-request Script
```javascript
// Gerar timestamp dinâmico
pm.environment.set("timestamp", new Date().toISOString());

// Gerar email único
const uniqueEmail = `teste${Date.now()}@email.com`;
pm.environment.set("unique_email", uniqueEmail);
```

## Monitoramento e Relatórios

### Executando Collection Completa
1. Clique nos três pontos (...) na collection
2. Selecione "Run collection"
3. Configure as opções desejadas
4. Clique em "Run Lideranças Empáticas API"

### Gerando Relatórios
1. Após executar a collection, clique em "Export Results"
2. Escolha o formato desejado (JSON, HTML)
3. Salve o relatório para documentação

## Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão
**Sintoma**: "Could not get any response"
**Solução**: 
- Verificar se o servidor está rodando na porta 3001
- Confirmar se o MySQL está conectado
- Verificar firewall/antivírus

#### 2. Erro 500 - Internal Server Error
**Sintoma**: Erro interno do servidor
**Solução**:
- Verificar logs do servidor
- Confirmar configuração do banco de dados
- Verificar se todas as tabelas foram criadas

#### 3. Erro 404 - Not Found
**Sintoma**: Rota não encontrada
**Solução**:
- Verificar URL da requisição
- Confirmar se o endpoint existe
- Verificar se o ID do recurso é válido

#### 4. Erro 400 - Bad Request
**Sintoma**: Dados inválidos
**Solução**:
- Verificar campos obrigatórios
- Validar formato dos dados (datas, emails)
- Confirmar tipos de dados

### Logs e Debug

Para debug detalhado:
1. Abra o Console do Postman (View → Show Postman Console)
2. Execute as requisições
3. Analise os logs detalhados

## Integração Contínua

### Newman (CLI do Postman)
```bash
# Instalar Newman
npm install -g newman

# Executar collection
newman run Liderancas_Empaticas_API.postman_collection.json \
  -e Liderancas_Empaticas_Environment.postman_environment.json \
  --reporters html,cli

# Executar com relatório detalhado
newman run Liderancas_Empaticas_API.postman_collection.json \
  -e Liderancas_Empaticas_Environment.postman_environment.json \
  --reporters html,cli \
  --reporter-html-export report.html
```

## Conclusão

Este guia fornece uma base completa para testar a API Lideranças Empáticas. Use os cenários de teste como ponto de partida e adapte conforme suas necessidades específicas.

Para suporte adicional, consulte:
- Documentação da API (`DOCUMENTACAO_API.md`)
- Logs do servidor
- Console do Postman para debug detalhado

---

*Guia atualizado para versão 1.0.0 da API*

