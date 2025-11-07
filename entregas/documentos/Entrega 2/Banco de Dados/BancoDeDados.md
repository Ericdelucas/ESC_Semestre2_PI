# 1. Tabela usuarios

A tabela usuarios é responsável pelo cadastro e autenticação de cada membro do sistema.<br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária, garantindo a
identificação única de cada usuário. <br>
O campo name (name VARCHAR(255) NOT NULL) armazena o nome completo do usuário. <br>
O campo email (email VARCHAR(255) UNIQUE NOT NULL) registra o e-mail, utilizado para
login e não havendo repetições. <br>
O campo password (password VARCHAR(255) NOT NULL) guarda a senha de acesso do
usuário. <br>
O campo tipo (tipo ENUM('administrador', 'professor', 'aluno', 'mentor') DEFAULT 'aluno')
diferencia os cargos dentro da plataforma e define os níveis de permissão. <br>
O campo ativo (ativo BOOLEAN DEFAULT TRUE) indica se a conta está ativa. <br>
Os campos created_at e updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP) armazenam a data de criação e a última atualização do
registro. <br>

<pre>
CREATE TABLE usuarios ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
name VARCHAR(255) NOT NULL, 
email VARCHAR(255) UNIQUE NOT NULL, 
password VARCHAR(255) NOT NULL, 
tipo ENUM('administrador', 'professor', 'aluno', 'mentor') DEFAULT 'aluno', 
ativo BOOLEAN DEFAULT TRUE, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP 
);
</pre>

<hr>

# 2. Tabela edicoes

A tabela edicoes armazena as edições e os ciclos do projeto Lideranças Empáticas. <br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária pois cada edição
possui seu próprio id. <br>
O campo nome (nome VARCHAR(255) NOT NULL) define o nome da edição. <br>
Os campos dataInicio e dataFim (dataInicio DATE NOT NULL, dataFim DATE NOT NULL,)
registram o período de início e fim. <br>
O campo descricao (descricao TEXT) detalha em forma de texto a edição. <br>
O campo status (status ENUM('Planejada', 'Em Andamento', 'Finalizada') DEFAULT 'Planejada')
mostra o andamento do projeto. <br>
Os campos meta_financeira e valor_arrecadado (DECIMAL(10,2)) controlam as metas e
resultados financeiros de cada arrecadação. <br>
Os campos numero_participantes e numero_equipes (numero_participantes INT DEFAULT 0,
numero_equipes INT DEFAULT 0,) auxiliam na análise estatística das equipes que estão
envolvidas. <br>
Os campos created_at e updated_at ( created_at TIMESTAMP DEFAULT
CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP)registram datas de criação e atualização de cada projeto. <br>
<pre>
CREATE TABLE edicoes ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
nome VARCHAR(255) NOT NULL, 
dataInicio DATE NOT NULL, 
dataFim DATE NOT NULL, 
descricao TEXT, 
status ENUM('Planejada', 'Em Andamento', 'Finalizada') DEFAULT 'Planejada', 
meta_financeira DECIMAL(10,2) DEFAULT 0.00, 
valor_arrecadado DECIMAL(10,2) DEFAULT 0.00, 
numero_participantes INT DEFAULT 0, 
numero_equipes INT DEFAULT 0, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP 
);
</pre>
<hr>

# 3. Tabela participantes

A tabela participantes reúne os dados de todos os envolvidos no projeto. <br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária pois cada
participante tem seu próprio ID evitando repetições. <br>
O campo nome (nome VARCHAR(255) NOT NULL) armazena o nome completo do
participante. <br>
O campo email (email VARCHAR(255) UNIQUE NOT NULL) registra o e-mail do participante. <br>
O campo telefone (telefone VARCHAR(20)) guarda o número de contato do participante. <br>
O campo tipo (tipo ENUM('aluno', 'mentor', 'professor', 'voluntario') NOT NULL) define o cargo
do participante. <br>
O campo curso (curso VARCHAR(255)) e semestre (INT) identificam o vínculo acadêmico do
participante. <br>
O campo ra (ra VARCHAR(50)) representa o registro acadêmico do participante. <br>
O campo edicao_id (INT) é chave estrangeira que conecta o participante à tabela edicoes. <br>
O campo equipe_id (INT) é chave estrangeira que o vincula à tabela equipes. <br>
Os campos pontuacao_total, ativo, created_at e updated_at (edicao_id INT, equipe_id INT,
pontuacao_total INT DEFAULT 0,) controlam pontuação, status e histórico de alterações. <br>
Os campos created_at e updated_at ( created_at TIMESTAMP DEFAULT
CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP)registram datas de criação e atualização de cada participante. <br>
O Campo (FOREIGN KEY (edicao_id) REFERENCES edicoes(id) ON DELETE SET NULL,)
serve para ligar a tabela participantes com a tabela edicoes, dizendo que
o campo edicao_id da tabela participantes está relacionado ao campo id da tabela edicoes. <br>
Os campos (INDEX idx_participantes_email (email), INDEX idx_participantes_tipo (tipo), INDEX
idx_participantes_edicao (edicao_id)) para localizar o registro muito mais
rápido, sem precisar verificar linha por linha. <br>

<pre>
CREATE TABLE participantes ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
nome VARCHAR(255) NOT NULL, 
email VARCHAR(255) UNIQUE NOT NULL, 
telefone VARCHAR(20), 
tipo ENUM('aluno', 'mentor', 'professor', 'voluntario') NOT NULL,
curso VARCHAR(255), 
semestre INT, 
ra VARCHAR(50), 
edicao_id INT, 
equipe_id INT, 
pontuacao_total INT DEFAULT 0, 
ativo BOOLEAN DEFAULT TRUE, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP, 
FOREIGN KEY (edicao_id) REFERENCES edicoes(id) ON DELETE SET NULL, 
INDEX idx_participantes_email (email), 
INDEX idx_participantes_tipo (tipo), 
INDEX idx_participantes_edicao (edicao_id) 
);
</pre>
<hr>

# 4. Tabela equipes

A tabela equipes organiza os grupos de alunos e mentores. <br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária pois cada equipe
tem um id unico. <br>
O campo nome (nome VARCHAR(255) NOT NULL) define o nome da equipe. <br>
Os campos mentor e mentor_email (VARCHAR(255)) identificam o mentor responsável. <br>
O campo edicao_id (INT) é chave estrangeira que conecta a equipe à tabela edicoes. <br>
Os campos numero_membros, meta_financeira, valor_arrecadado e pontuacao_total
( numero_membros INT DEFAULT 0,
meta_financeira DECIMAL(10,2) DEFAULT 0.00, valor_arrecadado DECIMAL(10,2) DEFAULT
0.00,pontuacao_total INT DEFAULT 0,
) monitoram o desempenho de cada equipe. <br>
O campo status (ENUM('Ativa', 'Inativa', 'Finalizada')) mostra a situação atual da equipe. <br>
O Campo (FOREIGN KEY (edicao_id) REFERENCES edicoes(id) ON DELETE SET NULL,)
serve para ligar a tabela equipes com a
tabela edicoes, dizendo que o campo edicao_id da tabela equipes está relacionado ao campo
id da tabela edicoes. <br>
Os campos (INDEX idx_equipes_edicao (edicao_id), INDEX idx_equipes_status(status)) para
localizar o registro muito mais
rápido, sem precisar verificar linha por linha. <br>

<pre>
CREATE TABLE equipes ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
nome VARCHAR(255) NOT NULL, 
mentor VARCHAR(255), 
mentor_email VARCHAR(255), 
edicao_id INT, 
numero_membros INT DEFAULT 0, 
meta_financeira DECIMAL(10,2) DEFAULT 0.00, 
valor_arrecadado DECIMAL(10,2) DEFAULT 0.00, 
pontuacao_total INT DEFAULT 0, 
status ENUM('Ativa', 'Inativa', 'Finalizada') DEFAULT 'Ativa', 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP, 
FOREIGN KEY (edicao_id) REFERENCES edicoes(id) ON DELETE SET NULL,
INDEX idx_equipes_edicao (edicao_id), 
INDEX idx_equipes_status (status) 
); 
</pre>
<hr>

# 5. Tabela atividades

A tabela atividades armazena os eventos e ações realizadas pelas equipes. <br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária para evitar
repetições cada atividade tem um id único. <br>
O campo nome (nome VARCHAR(255) NOT NULL) define o nome da atividade. <br>
O campo tipo (tipo ENUM('arrecadacao', 'evento', 'campanha', 'workshop', 'palestra', 'outro')
NOT NULL) identifica o tipo de atividade. <br>
Os campos descricao, data_inicio, data_fim, status, local e observacoes( descricao TEXT,
data_inicio DATE, data_fim DATE,
status ENUM('Pendente', 'Em Andamento', 'Concluída', 'Cancelada') DEFAULT 'Pendente', local
VARCHAR(255), observacoes TEXT,
) detalham os andamentos de cada atividade. <br>
As chaves estrangeiras equipe_id e edicao_id vinculam a atividade à equipe e edição
correspondentes. <br>
Os campos (created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at
TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
servem para registrar automaticamente a data e hora de criação e atualização de cada
atividade. <br>
Os campos (FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL,
FOREIGN KEY (edicao_id) REFERENCES edicoes(id) ON DELETE SET NULL)
criam relações entre a tabela de atividades e as tabelas de equipes e edições, garantindo que
cada atividade esteja associada a uma equipe e a uma edição específica; se alguma
delas for excluída, o valor fica nulo para não apagar o registro. <br>
Já os campos (INDEX idx_atividades_equipe (equipe_id), INDEX idx_atividades_tipo (tipo),
INDEX idx_atividades_status (status), INDEX idx_atividades_data (data_inicio, data_fim))
são usados para deixar as consultas mais rápidas, permitindo localizar atividades com mais
eficiência por equipe, tipo, status ou intervalo de datas. <br>

<pre>
CREATE TABLE atividades ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
nome VARCHAR(255) NOT NULL, 
tipo ENUM('arrecadacao', 'evento', 'campanha', 'workshop', 'palestra', 'outro') NOT NULL, 
descricao TEXT, 
equipe_id INT, 
edicao_id INT, 
responsavel VARCHAR(255), 
data_inicio DATE, 
data_fim DATE, 
meta_financeira DECIMAL(10,2) DEFAULT 0.00, 
valor_arrecadado DECIMAL(10,2) DEFAULT 0.00, 
status ENUM('Pendente', 'Em Andamento', 'Concluída', 'Cancelada') DEFAULT 'Pendente', 
local VARCHAR(255), 
observacoes TEXT, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP, 
FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL, 
FOREIGN KEY (edicao_id) REFERENCES edicoes(id) ON DELETE SET NULL, 
INDEX idx_atividades_equipe (equipe_id), 
INDEX idx_atividades_tipo (tipo), 
INDEX idx_atividades_status (status), 
INDEX idx_atividades_data (data_inicio, data_fim) 
); 
</pre>
<hr>

# 6. Tabela doacoes

A tabela doacoes é responsável por registrar todas as contribuições realizadas pelas equipes,
sejam em dinheiro, alimentos, roupas ou outros itens. <br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária, garantindo um
identificador único para cada doação. <br>
O campo data_doacao (DATE NOT NULL) registra o dia em que a doação foi realizada. <br>
O campo aluno_responsavel (VARCHAR(255) NOT NULL) identifica quem fez o registro. <br>
O campo aluno_ra (aluno_ra VARCHAR(50),) identifica o registro acadêmico do aluno que fez
o registro. <br>
O campo equipe_id (INT) é uma chave estrangeira que associa a doação à equipe. <br>
O campo atividade_id (INT) é outra chave estrangeira que relaciona a doação à atividade
específica. <br>
O campo item_doacao (VARCHAR(255) NOT NULL) define o item que foi doado. <br>
O campo categoria (ENUM('alimento', 'roupa', 'brinquedo', 'material_escolar', 'higiene', 'outro')
NOT NULL) classifica o tipo de item que foi feito da doação. <br>
O campo quantidade (DECIMAL(10,2) NOT NULL) indica a quantidade de coisas que foi
doada. <br>
O campo unidade (VARCHAR(50) DEFAULT 'unidade') mostra a unidade de medida (kg, litro,
etc). <br>
O campo valor_estimado (DECIMAL(10,2) DEFAULT 0.00) registra o valor monetário
aproximado da doação. <br>
O campo pontuacao (INT NOT NULL DEFAULT 0) contabiliza pontos de desempenho
baseados nas doações. <br>
O campo observacoes (observacoes TEXT,) descreve a doação com mais detalhes em forma
de texto. <br>
Os campos (created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP))
registram automaticamente a data e hora em que a doação foi criada e a última vez que ela foi
atualizada. <br>
Os campos (FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL,
FOREIGN KEY (atividade_id) REFERENCES atividades(id) ON DELETE SET NULL
criam vínculos entre as doações e as tabelas equipes e atividades, garantindo que cada
doação esteja associada a uma equipe e a uma atividade específica. <br>
Caso alguma delas seja excluída, o campo correspondente é definido como NULL, para não
apagar o registro da doação. <br>
Os campos (INDEX idx_doacoes_data (data_doacao), INDEX idx_doacoes_aluno
(aluno_responsavel),
INDEX idx_doacoes_equipe (equipe_id), INDEX idx_doacoes_categoria (categoria)) servem
para otimizar as buscas e consultas no banco de dados. <br>
Eles tornam mais rápidas as pesquisas filtradas por data da doação, nome do aluno
responsável, equipe associada ou categoria da doação (como alimento, roupa etc.). <br>

<pre>
CREATE TABLE doacoes ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
data_doacao DATE NOT NULL, 
aluno_responsavel VARCHAR(255) NOT NULL, 
aluno_ra VARCHAR(50), 
equipe_id INT, 
atividade_id INT, 
item_doacao VARCHAR(255) NOT NULL, 
categoria ENUM('alimento', 'roupa', 'brinquedo', 'material_escolar', 'higiene', 'outro') NOT
NULL, 
quantidade DECIMAL(10,2) NOT NULL, 
unidade VARCHAR(50) DEFAULT 'unidade', 
valor_estimado DECIMAL(10,2) DEFAULT 0.00, 
campanha VARCHAR(255), 
doador VARCHAR(255), 
doador_contato VARCHAR(255),
pontuacao INT NOT NULL DEFAULT 0, 
observacoes TEXT, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP, 
FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL, 
FOREIGN KEY (atividade_id) REFERENCES atividades(id) ON DELETE SET NULL, 
INDEX idx_doacoes_data (data_doacao), 
INDEX idx_doacoes_aluno (aluno_responsavel), 
INDEX idx_doacoes_equipe (equipe_id), 
INDEX idx_doacoes_categoria (categoria) 
); 
</pre>
<hr>

# 7. Tabela metas

A tabela metas define e acompanha os objetivos das equipes. <br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária pois cada meta
possui seu próprio id assim evita metas repetidas. <br>
O campo titulo (VARCHAR(255) NOT NULL) define o nome da meta. <br>
O campo descricao (TEXT) descreve o objetivo de forma detalhada. <br>
O campo equipe_id (INT) é chave estrangeira que conecta a meta à equipe responsável. <br>
O campo responsavel (VARCHAR(255)) identifica quem lidera o cumprimento da meta. <br>
Os campos data_inicio e data_fim (DATE NOT NULL) determinam o período da meta. <br>
O campo prioridade (ENUM('baixa','media','alta') DEFAULT 'media') indica o nível de
importância. <br>
O campo status (ENUM('pendente','em_andamento','concluida','atrasada','cancelada')
DEFAULT 'pendente') mostra o andamento da meta. <br>
O campo progresso (INT DEFAULT 0) representa o percentual de avanço da meta. <br>
Os campos meta_numerica, valor_atual e unidade (meta_numerica DECIMAL(10,2),
valor_atual DECIMAL(10,2) DEFAULT 0.00,
unidade VARCHAR(50),) armazenam valores quantitativos da meta. <br>
O campo observacoes (observacoes TEXT,) descreve a meta com mais detalhes em forma de
texto. <br>
Os campos (created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at
TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP)registram automaticamente quando a meta foi criada e quando foi
modificada pela última vez, garantindo o histórico de alterações sem precisar inserir
manualmente essas datas. <br>
O campo (FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL) cria
uma chave estrangeira que conecta cada meta à tabela equipes, indicando a qual equipe
aquela meta pertence. Se a equipe for excluída, o campo é definido como NULL, mantendo o
registro da meta, mas sem vínculo com uma equipe inexistente. <br>
Os campos (INDEX idx_metas_equipe (equipe_id), INDEX idx_metas_status (status), INDEX
idx_metas_prioridade (prioridade), INDEX idx_metas_data (data_inicio, data_fim),) servem para
melhorar o desempenho das consultas no banco de dados. <br>
Eles permitem buscar e filtrar metas de forma mais rápida — seja por equipe, status (pendente,
concluída etc.), prioridade (baixa, média, alta) ou pelo intervalo de datas de início e término. <br>

<pre>
CREATE TABLE metas ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
titulo VARCHAR(255) NOT NULL, 
descricao TEXT, 
equipe VARCHAR(255) NOT NULL, 
equipe_id INT, 
responsavel VARCHAR(255), 
data_inicio DATE NOT NULL, 
data_fim DATE NOT NULL, 
prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media', 
status ENUM('pendente', 'em_andamento', 'concluida', 'atrasada', 'cancelada') DEFAULT
'pendente', 
progresso INT DEFAULT 0, 
meta_numerica DECIMAL(10,2), 
valor_atual DECIMAL(10,2) DEFAULT 0.00, 
unidade VARCHAR(50), 
observacoes TEXT, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP, 
FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL, 
INDEX idx_metas_equipe (equipe_id), 
INDEX idx_metas_status (status), 
INDEX idx_metas_prioridade (prioridade), 
INDEX idx_metas_data (data_inicio, data_fim) 
); 
</pre>

<hr>

# 8. Tabela relatorios

A tabela relatorios guarda os documentos gerados pelo sistema com informações sobre
desempenho, atividades e finanças. <br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária pois cada relatório
possui seu próprio Id e isso evita repetições. <br>
O campo titulo (VARCHAR(255) NOT NULL,) indica o nome do relatório. <br>
O campo tipo (ENUM('geral','equipe','atividade','financeiro','participacao') NOT NULL) classifica
o tipo de relatório. <br>
Os campos periodo_inicio e periodo_fim (periodo_inicio DATE, periodo_fim DATE,) indicam o
intervalo de tempo considerado. <br>
O campo equipe_id (INT) é chave estrangeira que conecta o relatório à equipe correspondente. <br>
O campo edicao_id (INT) relaciona o relatório à edição. <br>
O campo dados_json (JSON) armazena dados estruturados. <br>
O campo arquivo_path (VARCHAR(500)) define o caminho do arquivo gerado. <br>
O campo (created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP), registra
automaticamente a data e hora em que o relatório foi criado, permitindo manter o controle
cronológico dos relatórios sem precisar inserir manualmente essa informação. <br>
Os campos (FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL,
FOREIGN KEY (edicao_id) REFERENCES edicoes(id) ON DELETE SET NULL), criam chaves
estrangeiras que conectam os relatórios às respectivas equipes e edições do projeto. Isso
garante que cada relatório esteja vinculado a uma equipe e a uma edição específica. Caso uma
equipe ou edição seja excluída, o campo é automaticamente definido como NULL, evitando
erros de referência no banco de dados. <br>
Os campos (INDEX idx_relatorios_tipo (tipo), INDEX idx_relatorios_periodo (periodo_inicio,
periodo_fim),) servem para acelerar as buscas e consultas. <br>
O primeiro facilita a localização de relatórios por tipo (como geral, equipe, atividade, financeiro
ou participação), e o segundo otimiza pesquisas baseadas em períodos de tempo, permitindo
filtrar relatórios entre datas específicas de forma mais eficiente. <br>

<pre>
CREATE TABLE relatorios ( 
id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(255) NOT NULL, 
tipo ENUM('geral', 'equipe', 'atividade', 'financeiro', 'participacao') NOT NULL, 
periodo_inicio DATE, 
periodo_fim DATE, 
equipe_id INT, 
edicao_id INT, 
gerado_por VARCHAR(255), 
dados_json JSON, 
arquivo_path VARCHAR(500), 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL, 
FOREIGN KEY (edicao_id) REFERENCES edicoes(id) ON DELETE SET NULL, 
INDEX idx_relatorios_tipo (tipo), 
INDEX idx_relatorios_periodo (periodo_inicio, periodo_fim) 
); 
</pre>
<hr>

# 9. Tabela monitoramento

A tabela monitoramento é usada para acompanhar o progresso das equipes em tempo real. <br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária pois cada
monitoramento tem seu próprio ID evitando repetições e erros na hora da monitoramento. <br>
O campo data_registro (DATE NOT NULL) armazena a data do registrada no monitoramento. <br>
O campo equipe_id (INT) é chave estrangeira que liga o monitoramento à equipe. <br>
O campo aluno_responsavel (VARCHAR(255)) registra quem realizou a atividade monitorada. <br>
O campo atividade (VARCHAR(255)) descreve a tarefa monitorada. <br>
O campo tempo_dedicado (INT) registra o tempo gasto em minutos. <br>
O campo descricao_atividade (TEXT) explica o que foi feito. <br>
Os campos resultados, dificuldades e proximos_passos (TEXT) detalham o andamento e
desafios. <br>
O campo status_geral (ENUM('excelente','bom','regular','ruim') DEFAULT 'bom') avalia o
desempenho. <br>
A linha FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL cria
uma chave estrangeira que conecta o registro de monitoramento à equipe correspondente na
tabela equipes. Isso significa que cada registro de monitoramento está ligado a uma equipe
específica. Caso essa equipe seja excluída do sistema, o campo equipe_id é automaticamente
definido como NULL, evitando erros e mantendo a integridade dos dados. <br>
Os campos (FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL)
cria uma chave estrangeira que conecta os registros da tabela de monitoramento com a tabela
equipes, garantindo que cada atividade monitorada esteja associada a uma equipe específica.
Caso uma equipe seja excluída, o valor do campo equipe_id é automaticamente definido como
NULL, evitando falhas de referência no banco de dados e mantendo a integridade das
informações. <br>
Os índices (INDEX idx_monitoramento_data (data_registro),) e (INDEX
idx_monitoramento_equipe (equipe_id),)são utilizados para otimizar o desempenho das
consultas. <br>

<pre>
CREATE TABLE monitoramento ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
data_registro DATE NOT NULL, 
equipe_id INT, 
aluno_responsavel VARCHAR(255), 
atividade VARCHAR(255), 
tempo_dedicado INT, -- em minutos 
descricao_atividade TEXT, 
resultados TEXT, 
dificuldades TEXT, 
proximos_passos TEXT, 
status_geral ENUM('excelente', 'bom', 'regular', 'ruim') DEFAULT 'bom', 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE SET NULL, 
INDEX idx_monitoramento_data (data_registro), 
INDEX idx_monitoramento_equipe (equipe_id) 
);
</pre>

<hr>

# 10. Tabela images

A tabela images armazena as imagens enviadas pelos usuários relacionadas a atividades, 
equipes ou doações. <br>
O campo id (id INT AUTO_INCREMENT PRIMARY KEY) é a chave primária para evitar
repetições de imagens cada imagem tem ID único. <br>
O campo img (VARCHAR(500) NOT NULL) guarda o caminho da imagem. <br>
O campo titulo (VARCHAR(255)) define o nome do arquivo. <br>
O campo descricao (TEXT) fornece detalhes sobre o conteúdo. <br>
O campo categoria (ENUM('atividade','evento','doacao','equipe','geral') DEFAULT 'geral')
classifica o tipo da imagem. <br>
O campo relacionado_id (INT) vincula a imagem à entidade correspondente (atividade, equipe,
etc). <br>
O campo relacionado_tipo (VARCHAR(50)) indica a tabela à qual a imagem está associada. <br>
O campo created_at registra o momento em que a imagem foi adicionada. <br>

<pre>
CREATE TABLE images (
id INT AUTO_INCREMENT PRIMARY KEY, 
img VARCHAR(500) NOT NULL, 
titulo VARCHAR(255), 
descricao TEXT, 
categoria ENUM('atividade', 'evento', 'doacao', 'equipe', 'geral') DEFAULT 'geral', 
relacionado_id INT, -- ID da tabela relacionada (atividade, equipe, etc.) 
relacionado_tipo VARCHAR(50), -- tipo da tabela relacionada 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 
</pre>

<hr>
