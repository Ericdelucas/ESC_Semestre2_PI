# 📊 ESC Monitoring System – Lideranças Empáticas

O **ESC Monitoring System** é uma aplicação web full stack criada para facilitar o gerenciamento de equipes acadêmicas em projetos extensionistas.  
O sistema possibilita **cadastrar equipes**, **registrar atividades**, **definir metas**, **acompanhar indicadores** e gerar relatórios.  

A arquitetura utiliza a stack **MySQL + Express + React + Node.js (MERN adaptado com MySQL)**.

---

## 📌 Pré-requisitos

Certifique-se de ter os seguintes programas instalados no computador:

| Software              | Função |
|-----------------------|--------|
| 🖥️ **Visual Studio Code** | Editor de código utilizado para desenvolvimento |
| 🟢 **Node.js (LTS)**       | Ambiente de execução do backend e frontend |
| 🐬 **XAMPP** (ou outro servidor MySQL) | Inclui servidor MySQL e Apache |
| 🛠️ **MySQL Workbench** (opcional) | Interface gráfica para gerenciar o banco de dados |
| 🌐 **Navegador Web**       | Acesso à aplicação (Google Chrome, Firefox, Edge) |

---

## ⚙️ Instalação e Configuração

### 1. 📂 Obtendo o Projeto
- **Via GitHub**:
  ```bash
  git clone https://github.com/Ericdelucas/ESC_Semestre2_PI.git
  cd ESC_Semestre2_PI

---

## 📽️ Demonstração em Vídeo

Para visualizar a aplicação em funcionamento, assista ao vídeo demonstrativo disponível no link abaixo:

👉 [Demonstração do ESC Monitoring System](https://drive.google.com/file/d/1tL4rQHjMckuimwuIKZ_PX8B9ZQKzdgPy/view?usp=sharing)

---

## 📑 Documentação Complementar

- **Rotas da API**: descritas acima, podem ser testadas com ferramentas como Postman ou Insomnia.  
- **Coleção Postman**: disponível no repositório em `ESC/muu/Liderancas_Empaticas_API.postman_collection.json`.  
- **Modelo do Banco de Dados**: diagrama e instruções no arquivo `esc_db.sql`.  
- **Relatórios e atas do projeto**: encontram-se na pasta `/docs`.

---

---

## 📡 Rotas da API

A API do **ESC Monitoring System** oferece endpoints REST para gerenciamento de **atividades** e **equipes**.

### 🔹 Atividades
- `GET /api/atividades` → lista todas as atividades  
- `GET /api/atividades/:id` → retorna uma atividade pelo ID  
- `POST /api/atividades` → cria uma nova atividade  
- `PUT /api/atividades/:id` → atualiza uma atividade existente  
- `DELETE /api/atividades/:id` → remove uma atividade  

### 🔹 Equipes
- `GET /api/equipes` → lista todas as equipes  
- `GET /api/equipes/:id` → retorna uma equipe pelo ID  
- `POST /api/equipes` → cria uma nova equipe  
- `PUT /api/equipes/:id` → atualiza uma equipe existente  
- `DELETE /api/equipes/:id` → remove uma equipe  

### 🔹 Exemplos de Respostas
**Exemplo – GET /api/atividades**
```json
[
  {
    "id": 1,
    "nome": "Campanha Solidária",
    "tipo": "Evento",
    "descricao": "Arrecadação de alimentos",
    "status": "Em andamento",
    "meta_financeira": 2000,
    "valor_arrecadado": 750,
    "equipe_id": 2
  }
]


## 🤝 Contribuição

1. Faça um fork do projeto.  
2. Crie uma branch para sua feature (`git checkout -b feature/nome-feature`).  
3. Commit suas alterações (`git commit -m "adiciona nova feature"`).  
4. Envie para o repositório remoto (`git push origin feature/nome-feature`).  
5. Abra um Pull Request.

---

## 👨‍💻 Equipe

- **Eric de Lucas** – Desenvolvimento Full Stack  
- **Enhsiang Chien
- **Stephanie Macedo da Silva
- **Joel
  **

---

---

## ⚙️ Processo de Instalação



### 🔹 Passo 1 – Clonar o Repositório
Baixe o código do projeto do GitHub:
```bash
git clone https://github.com/Ericdelucas/ESC_Semestre2_PI.git
cd ESC_Semestre2_PI


🔹 Passo 2 – Configurar o Banco de Dados

Abra o XAMPP e ative os serviços Apache e MySQL.

Acesse o MySQL Workbench ou phpMyAdmin.

Crie um banco de dados chamado esc_db.

Importe o arquivo de backup (esc_db.sql) que está na pasta do projeto:

MySQL Workbench:

Vá em Server > Data Import.

Escolha Import from Self-Contained File.

Selecione esc_db.sql.

Em Default Schema, escolha New e digite esc_db.

Clique em Start Import.

phpMyAdmin:

Vá em Importar.

Selecione esc_db.sql e clique em Executar.

🔹 Passo 3 – Configurar o Backend (API)

Acesse a pasta system:

cd system
npm install

Crie um arquivo .env dentro de system com as credenciais:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=esc_db
DB_PORT=3306
FRONTEND_URL=http://localhost:5173

npm run dev

✅ backend conectado ao mysql com sucesso

🔹 Passo 4 – Configurar o Frontend (React)

Abra um novo terminal no VS Code.

Acesse a pasta do frontend:

cd ESC/muu/muu
npm install

VITE_API_URL=http://localhost:3001/api

npm run dev


## 📜 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.
