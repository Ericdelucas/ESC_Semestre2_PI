# Sistema de Monitoramento ESC - Lideranças Empáticas

## Descrição do Projeto

Este é um sistema completo de monitoramento de alunos desenvolvido em React, modernizando o projeto ESC_Semestre2_PI com novas funcionalidades avançadas de acompanhamento e gestão.

## Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- Login com diferentes tipos de usuário: Administrador, Professor, Mentor, Aluno
- Interface responsiva e moderna
- Controle de acesso baseado em perfis

### ⏰ Monitoramento de Tempo
- Relógio visual com imagem personalizada (Relogio.png)
- Contador de tempo em tempo real
- Período configurado para 1 mês
- Barra de progresso visual
- Estatísticas de tempo restante

### 📊 Timeline de Atividades
- Timeline individual do aluno
- Timeline geral da equipe
- Registro de todas as atividades com pontuação
- Status de aprovação/pendência
- Prevenção de fraudes através do rastreamento individual

### 🎁 Sistema de Doações
- Formulário completo baseado na imagem de referência (Inputs.png)
- Sistema de pontuação por item:
  - Arroz: 1 ponto
  - Feijão: 2 pontos
  - Açúcar: 3 pontos
  - Óleo: 4 pontos
  - Macarrão: 5 pontos
  - Fubá: 6 pontos
  - Leite em Pó: 7 pontos
  - Item Não Listado: 8 pontos
  - Dinheiro: 9 pontos
- Registro automático na timeline
- Controle de campanhas e doadores

### 📅 Calendário de Metas
- Criação e gerenciamento de metas por equipe
- Acompanhamento de progresso
- Datas de início e fim
- Status de conclusão
- Responsáveis por meta

### 👨‍💼 Painel Administrativo
- Monitoramento de todas as equipes
- Controle de metas com histórico de ações
- Relatórios semanais automáticos
- Estatísticas gerais do sistema
- Rastreamento de adições e remoções de metas

## Tecnologias Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool e desenvolvimento
- **CSS3** - Estilização responsiva
- **JavaScript ES6+** - Lógica da aplicação

## Estrutura do Projeto

```
esc-monitoring-system/
├── src/
│   ├── components/
│   │   ├── LoginModal.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TimeMonitor.jsx
│   │   ├── Timeline.jsx
│   │   ├── DonationSystem.jsx
│   │   ├── GoalsCalendar.jsx
│   │   └── AdminPanel.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
│   ├── Relogio.png
│   └── inputs.png
├── package.json
└── README.md
```

## Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação e Execução

1. **Clone ou baixe o projeto**
   ```bash
   cd esc-monitoring-system
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## Usuários de Teste

### Aluno
- **Email:** joao.silva@teste.com
- **Senha:** 123456
- **Tipo:** Aluno

### Administrador
- **Email:** admin@esc.com
- **Senha:** admin123
- **Tipo:** Administrador

## Funcionalidades por Perfil

### Aluno
- ✅ Dashboard com estatísticas pessoais
- ✅ Monitoramento de tempo
- ✅ Timeline individual e da equipe
- ✅ Sistema de doações
- ✅ Calendário de metas da equipe

### Administrador
- ✅ Todas as funcionalidades do aluno
- ✅ Painel administrativo completo
- ✅ Monitoramento de todas as equipes
- ✅ Controle de metas com histórico
- ✅ Relatórios semanais
- ✅ Estatísticas gerais do sistema

## Características Técnicas

### Responsividade
- Design adaptável para desktop e mobile
- Interface otimizada para diferentes tamanhos de tela
- Componentes flexíveis e escaláveis

### Performance
- Carregamento rápido com Vite
- Componentes otimizados
- Gerenciamento eficiente de estado

### Segurança
- Controle de acesso por perfil
- Validação de dados
- Prevenção de fraudes através do rastreamento

## Melhorias Implementadas

1. **Modernização Completa**: Migração do projeto original para React moderno
2. **Interface Aprimorada**: Design limpo e profissional
3. **Funcionalidades Avançadas**: Sistema completo de monitoramento
4. **Prevenção de Fraudes**: Timeline individual e de equipe
5. **Painel Administrativo**: Controle total para gestores
6. **Relatórios Automáticos**: Geração de relatórios semanais

## Suporte e Manutenção

O sistema foi desenvolvido seguindo as melhores práticas de desenvolvimento React, garantindo:
- Código limpo e bem documentado
- Componentes reutilizáveis
- Fácil manutenção e extensão
- Estrutura escalável

## Próximos Passos

Para implementação em produção, considere:
1. Integração com banco de dados real
2. Sistema de autenticação robusto
3. API backend para persistência de dados
4. Testes automatizados
5. Deploy em servidor de produção

---

**Desenvolvido com ❤️ para o projeto ESC - Lideranças Empáticas**

