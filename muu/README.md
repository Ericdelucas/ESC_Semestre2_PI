# Sistema Lideranças Empáticas - Projeto Interdisciplinar (Fullstack)

## Descrição do Projeto

O Sistema Lideranças Empáticas é uma aplicação web fullstack desenvolvida para gerenciar projetos de impacto social e desenvolvimento humano. Ele permite o gerenciamento de edições, participantes, equipes, atividades, doações e metas, com foco no monitoramento do progresso de alunos e equipes.

### Funcionalidades Principais:

- **Gerenciamento de Edições**: Cadastro, edição e exclusão de edições de projetos.
- **Gerenciamento de Participantes**: Cadastro e controle de alunos e mentores.
- **Gerenciamento de Equipes**: Criação de equipes, atribuição de mentores e membros.
- **Gerenciamento de Atividades**: Definição e acompanhamento de atividades com metas financeiras e status.
- **Sistema de Doações**: Registro de doações com pontuação automática por item, ranking e estatísticas.
- **Monitoramento de Alunos e Equipes**: Countdown timer para tarefas, timeline de atividades (individual e por grupo).
- **Calendário de Metas**: Definição e acompanhamento de metas por equipes, com visão administrativa.
- **Relatórios Detalhados**: Visão geral do desempenho, doações e metas.
- **Autenticação**: Sistema de login básico para acesso.
- **Interface Responsiva**: Adaptação a diferentes tamanhos de tela.

## Estrutura do Projeto

O projeto é dividido em duas partes principais: Frontend (React) e Backend (Node.js com Express e SQLite).

```
muu/
├── backend/                  # Backend da aplicação
│   ├── controllers/          # Lógica de negócio (ainda não implementado, mas planejado)
│   ├── routes/               # Definição das rotas da API
│   ├── database.sqlite       # Banco de dados SQLite
│   ├── package.json          # Dependências e scripts do backend
│   └── server.js             # Servidor Express principal
└── muu/                      # Frontend da aplicação (React)
    ├── public/               # Arquivos estáticos
    ├── src/                  # Código fonte do React
    │   ├── assets/           # Imagens, vídeos, etc.
    │   ├── components/       # Componentes React reutilizáveis
    │   │   ├── Monitoring/   # Componentes de monitoramento
    │   │   └── Goals/        # Componentes de metas
    │   ├── services/         # Serviços de comunicação com a API
    │   ├── App.jsx           # Componente principal da aplicação
    │   ├── index.css         # Estilos globais
    │   └── main.jsx          # Ponto de entrada do React
    ├── index.html            # HTML principal do frontend
    ├── package.json          # Dependências e scripts do frontend
    └── vite.config.js        # Configuração do Vite
```

## Rotas da API (Backend)

A API é acessível através da porta `3001` (ex: `http://localhost:3001/api`).

### Edições
- `GET /api/edicoes`: Lista todas as edições.
- `GET /api/edicoes/:id`: Busca uma edição por ID.
- `POST /api/edicoes`: Cria uma nova edição.
- `PUT /api/edicoes/:id`: Atualiza uma edição existente.
- `DELETE /api/edicoes/:id`: Exclui uma edição.

### Participantes
- `GET /api/participantes`: Lista todos os participantes.
- `GET /api/participantes/:id`: Busca um participante por ID.
- `GET /api/participantes/tipo/:tipo`: Lista participantes por tipo.
- `POST /api/participantes`: Cria um novo participante.
- `PUT /api/participantes/:id`: Atualiza um participante existente.
- `DELETE /api/participantes/:id`: Exclui um participante.

### Equipes
- `GET /api/equipes`: Lista todas as equipes.
- `GET /api/equipes/:id`: Busca uma equipe por ID.
- `GET /api/equipes/edicao/:edicao_id`: Lista equipes por edição.
- `POST /api/equipes`: Cria uma nova equipe.
- `PUT /api/equipes/:id`: Atualiza uma equipe existente.
- `DELETE /api/equipes/:id`: Exclui uma equipe.

### Atividades
- `GET /api/atividades`: Lista todas as atividades.
- `GET /api/atividades/:id`: Busca uma atividade por ID.
- `GET /api/atividades/equipe/:equipe_id`: Lista atividades por equipe.
- `GET /api/atividades/tipo/:tipo`: Lista atividades por tipo.
- `POST /api/atividades`: Cria uma nova atividade.
- `PUT /api/atividades/:id`: Atualiza uma atividade existente.
- `PATCH /api/atividades/:id/valor`: Atualiza o valor arrecadado de uma atividade.
- `DELETE /api/atividades/:id`: Exclui uma atividade.

### Doações
- `GET /api/doacoes`: Lista todas as doações.
- `GET /api/doacoes/:id`: Busca uma doação por ID.
- `GET /api/doacoes/aluno/:aluno`: Lista doações por aluno responsável.
- `GET /api/doacoes/item/:item`: Lista doações por item.
- `GET /api/doacoes/periodo/:inicio/:fim`: Lista doações por período.
- `GET /api/doacoes/stats/geral`: Retorna estatísticas gerais de doações e ranking de itens.
- `POST /api/doacoes`: Registra uma nova doação.
- `PUT /api/doacoes/:id`: Atualiza uma doação existente.
- `DELETE /api/doacoes/:id`: Exclui uma doação.

### Metas
- `GET /api/metas`: Lista todas as metas.
- `GET /api/metas/:id`: Busca uma meta por ID.
- `GET /api/metas/equipe/:equipe`: Lista metas por equipe.
- `GET /api/metas/status/:status`: Lista metas por status.
- `GET /api/metas/periodo/:inicio/:fim`: Lista metas por período.
- `GET /api/metas/stats/geral`: Retorna estatísticas gerais de metas.
- `POST /api/metas`: Cria uma nova meta.
- `PUT /api/metas/:id`: Atualiza uma meta existente.
- `PATCH /api/metas/:id/status`: Atualiza o status de uma meta.
- `DELETE /api/metas/:id`: Exclui uma meta.

## Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:
- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)

### Configuração do Backend

1. Navegue até o diretório `backend`:
   ```bash
   cd muu/backend
   ```
2. Instale as dependências do backend:
   ```bash
   npm install
   ```
3. Inicie o servidor backend:
   ```bash
   npm run dev
   ```
   O servidor será iniciado na porta `3001` (http://localhost:3001).
   Ele criará automaticamente o arquivo `database.sqlite` na primeira execução.

### Configuração do Frontend

1. Em um **novo terminal**, navegue até o diretório `muu` (raiz do frontend):
   ```bash
   cd muu/muu
   ```
2. Instale as dependências do frontend:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do frontend:
   ```bash
   npm run dev
   ```
   O frontend será iniciado na porta `5173` (http://localhost:5173) ou em uma porta disponível (ex: `5174`).

### Acessando a Aplicação

Após iniciar ambos os servidores (backend e frontend), abra seu navegador e acesse a URL do frontend (ex: `http://localhost:5173`).

## Vídeo Demonstrativo

[Link para o vídeo demonstrativo (a ser adicionado)]

## Deploy

[Informações sobre deploy (a ser adicionado)]

## Observações

- O banco de dados utilizado no ambiente de desenvolvimento é SQLite, mas a estrutura da API é compatível com MySQL.
- O projeto está modularizado e organizado para facilitar a manutenção e futuras expansões.


