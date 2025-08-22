# Modelagem do Banco de Dados - Projeto Lideranças Empáticas

## Introdução
Esta seção detalha a modelagem do banco de dados relacional para a aplicação web do Projeto Lideranças Empáticas, conforme os requisitos funcionais e não funcionais especificados no documento PI_2CCOMP_202502. O objetivo é criar uma estrutura de dados robusta e escalável que suporte todas as funcionalidades do sistema, garantindo a integridade e a persistência dos dados.

## Requisitos de Banco de Dados
De acordo com o documento, o sistema deve utilizar um banco de dados relacional (MySQL ou SQLite) e garantir a integridade dos dados através de chaves primárias e estrangeiras. Os requisitos funcionais implicam a necessidade de armazenar informações sobre:

*   **Edições do Projeto:** Gerenciadas por administradores.
*   **Participantes:** Alunos, professores e mentores, com auto cadastro para alunos.
*   **Equipes:** Composta por múltiplos alunos e um mentor.
*   **Tipos de Atividade:** Ex: arrecadação de alimentos, fundos.
*   **Atividades por Equipe:** Detalhes como tipo, nome, datas, metas, valores arrecadados e utilizados.

## Diagrama Entidade-Relacionamento (ER)
Com base nos requisitos, o diagrama ER a seguir representa as entidades e seus relacionamentos. Este diagrama serve como base para a criação do esquema do banco de dados.

```mermaid
erDiagram
    EDICAO ||--o{ EQUIPE : 


contém
    EQUIPE ||--o{ ATIVIDADE : realiza
    PARTICIPANTE ||--o{ EQUIPE : pertence
    TIPO_ATIVIDADE ||--o{ ATIVIDADE : é_do_tipo

    EDICAO {
        INT id_edicao PK
        VARCHAR(255) nome_edicao
        DATE data_inicio
        DATE data_fim
    }

    PARTICIPANTE {
        INT id_participante PK
        VARCHAR(255) nome
        VARCHAR(255) email UK
        VARCHAR(255) senha
        ENUM("aluno", "professor", "mentor", "administrador") perfil
    }

    EQUIPE {
        INT id_equipe PK
        VARCHAR(255) nome_equipe
        INT id_edicao FK
        INT id_mentor FK
    }

    ATIVIDADE {
        INT id_atividade PK
        VARCHAR(255) nome_atividade
        INT id_equipe FK
        INT id_tipo_atividade FK
        DATE data_inicio
        DATE data_fim
        DECIMAL(10,2) meta_esperada
        VARCHAR(50) unidade_meta
        DECIMAL(10,2) valor_arrecadado
        DECIMAL(10,2) valor_fundo_utilizado
    }

    TIPO_ATIVIDADE {
        INT id_tipo_atividade PK
        VARCHAR(255) nome_tipo
    }

    # Tabela de relacionamento para Alunos em Equipes (Muitos para Muitos)
    EQUIPE_ALUNO {
        INT id_equipe FK
        INT id_aluno FK
        PRIMARY KEY (id_equipe, id_aluno)
    }

    # Relacionamentos
    EQUIPE ||--o{ EQUIPE_ALUNO : tem
    PARTICIPANTE ||--o{ EQUIPE_ALUNO : é_membro

    # Adicionando o relacionamento de mentor na tabela EQUIPE
    PARTICIPANTE ||--o{ EQUIPE : orienta

```

## Esquema do Banco de Dados (SQL)

Com base no diagrama ER, o seguinte script SQL pode ser utilizado para criar as tabelas no banco de dados MySQL:

```sql
CREATE TABLE EDICAO (
    id_edicao INT PRIMARY KEY AUTO_INCREMENT,
    nome_edicao VARCHAR(255) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL
);

CREATE TABLE PARTICIPANTE (
    id_participante INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('aluno', 'professor', 'mentor', 'administrador') NOT NULL
);

CREATE TABLE EQUIPE (
    id_equipe INT PRIMARY KEY AUTO_INCREMENT,
    nome_equipe VARCHAR(255) NOT NULL,
    id_edicao INT NOT NULL,
    id_mentor INT,
    FOREIGN KEY (id_edicao) REFERENCES EDICAO(id_edicao),
    FOREIGN KEY (id_mentor) REFERENCES PARTICIPANTE(id_participante)
);

CREATE TABLE TIPO_ATIVIDADE (
    id_tipo_atividade INT PRIMARY KEY AUTO_INCREMENT,
    nome_tipo VARCHAR(255) NOT NULL
);

CREATE TABLE ATIVIDADE (
    id_atividade INT PRIMARY KEY AUTO_INCREMENT,
    nome_atividade VARCHAR(255) NOT NULL,
    id_equipe INT NOT NULL,
    id_tipo_atividade INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    meta_esperada DECIMAL(10,2),
    unidade_meta VARCHAR(50),
    valor_arrecadado DECIMAL(10,2),
    valor_fundo_utilizado DECIMAL(10,2),
    FOREIGN KEY (id_equipe) REFERENCES EQUIPE(id_equipe),
    FOREIGN KEY (id_tipo_atividade) REFERENCES TIPO_ATIVIDADE(id_tipo_atividade)
);

CREATE TABLE EQUIPE_ALUNO (
    id_equipe INT NOT NULL,
    id_aluno INT NOT NULL,
    PRIMARY KEY (id_equipe, id_aluno),
    FOREIGN KEY (id_equipe) REFERENCES EQUIPE(id_equipe),
    FOREIGN KEY (id_aluno) REFERENCES PARTICIPANTE(id_participante)
);
```

## Considerações Finais
Este modelo de banco de dados atende aos requisitos iniciais do projeto Lideranças Empáticas, fornecendo uma estrutura sólida para o armazenamento e gerenciamento das informações. A utilização de chaves primárias e estrangeiras garante a integridade referencial, enquanto a escolha de tipos de dados adequados otimiza o armazenamento e a recuperação. Este esquema pode ser expandido no futuro para acomodar novas funcionalidades e requisitos, mantendo a escalabilidade e manutenibilidade do sistema.


