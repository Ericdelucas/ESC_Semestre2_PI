// Sistema de Gerenciamento Lideranças Empáticas
// Armazenamento local de dados
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Inicializar dados padrão se não existirem
        if (!localStorage.getItem('usuarios')) {
            const usuariosPadrao = [
                {
                    id: 1,
                    nome: 'Administrador',
                    email: 'admin@liderancas.com',
                    senha: 'admin123',
                    tipo: 'administrador',
                    curso: ''
                },
                {
                    id: 2,
                    nome: 'Prof. Maria Silva',
                    email: 'maria@liderancas.com',
                    senha: 'prof123',
                    tipo: 'professor',
                    curso: 'administracao'
                },
                {
                    id: 3,
                    nome: 'João Mentor',
                    email: 'joao@liderancas.com',
                    senha: 'mentor123',
                    tipo: 'mentor',
                    curso: 'economia'
                },
                {
                    id: 4,
                    nome: 'Ana Aluna',
                    email: 'ana@liderancas.com',
                    senha: 'aluno123',
                    tipo: 'aluno',
                    curso: 'administracao'
                }
            ];
            localStorage.setItem('usuarios', JSON.stringify(usuariosPadrao));
        }

        if (!localStorage.getItem('edicoes')) {
            const edicoesPadrao = [
                {
                    id: 1,
                    nome: 'Lideranças Empáticas 2025.1',
                    dataInicio: '2025-02-01',
                    dataFim: '2025-06-30',
                    descricao: 'Primeira edição de 2025',
                    status: 'ativo'
                }
            ];
            localStorage.setItem('edicoes', JSON.stringify(edicoesPadrao));
        }

        if (!localStorage.getItem('equipes')) {
            localStorage.setItem('equipes', JSON.stringify([]));
        }

        if (!localStorage.getItem('atividades')) {
            localStorage.setItem('atividades', JSON.stringify([]));
        }

        if (!localStorage.getItem('tiposAtividade')) {
            const tiposPadrao = [
                { id: 1, nome: 'Arrecadação de Alimentos' },
                { id: 2, nome: 'Arrecadação de Fundos' },
                { id: 3, nome: 'Evento Social' },
                { id: 4, nome: 'Workshop' },
                { id: 5, nome: 'Outro' }
            ];
            localStorage.setItem('tiposAtividade', JSON.stringify(tiposPadrao));
        }
    }

    // Métodos genéricos para CRUD
    getAll(entity) {
        return JSON.parse(localStorage.getItem(entity) || '[]');
    }

    getById(entity, id) {
        const items = this.getAll(entity);
        return items.find(item => item.id === parseInt(id));
    }

    save(entity, item) {
        const items = this.getAll(entity);
        if (item.id) {
            // Atualizar
            const index = items.findIndex(i => i.id === item.id);
            if (index !== -1) {
                items[index] = item;
            }
        } else {
            // Criar novo
            item.id = this.getNextId(entity);
            items.push(item);
        }
        localStorage.setItem(entity, JSON.stringify(items));
        return item;
    }

    delete(entity, id) {
        const items = this.getAll(entity);
        const filteredItems = items.filter(item => item.id !== parseInt(id));
        localStorage.setItem(entity, JSON.stringify(filteredItems));
    }

    getNextId(entity) {
        const items = this.getAll(entity);
        return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    }
}

// Sistema de Autenticação
class AuthManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.currentUser = null;
        this.checkStoredAuth();
    }

    checkStoredAuth() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.updateUI();
        }
    }

    login(email, password, userType) {
        const usuarios = this.dataManager.getAll('usuarios');
        const user = usuarios.find(u => 
            u.email === email && 
            u.senha === password && 
            u.tipo === userType
        );

        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.updateUI();
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        showSection('welcome');
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userInfo = document.getElementById('userInfo');
        const navMenu = document.getElementById('navMenu');

        if (this.currentUser) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            userInfo.style.display = 'block';
            userInfo.textContent = `${this.currentUser.nome} (${this.currentUser.tipo})`;
            navMenu.style.display = 'flex';
            
            // Mostrar dashboard após login
            showSection('dashboard');
            updateDashboard();
        } else {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            userInfo.style.display = 'none';
            navMenu.style.display = 'none';
        }
    }

    hasPermission(action) {
        if (!this.currentUser) return false;
        
        const permissions = {
            'administrador': ['create', 'read', 'update', 'delete', 'manage_users', 'manage_teams'],
            'professor': ['read', 'create_activities', 'update_activities'],
            'mentor': ['read', 'create_activities', 'update_activities', 'manage_team'],
            'aluno': ['read', 'self_register']
        };

        return permissions[this.currentUser.tipo]?.includes(action) || false;
    }
}

// Instâncias globais
const dataManager = new DataManager();
const authManager = new AuthManager(dataManager);

// Funções de navegação
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Carregar dados específicos da seção
        switch(sectionId) {
            case 'edicoes':
                loadEdicoes();
                break;
            case 'participantes':
                loadParticipantes();
                break;
            case 'equipes':
                loadEquipes();
                break;
            case 'atividades':
                loadAtividades();
                break;
            case 'dashboard':
                updateDashboard();
                break;
        }
    }
}

// Funções de modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        
        // Carregar dados necessários para o modal
        switch(modalId) {
            case 'equipeModal':
                loadMentorsForEquipe();
                loadEdicoesForEquipe();
                loadAlunosForEquipe();
                break;
            case 'atividadeModal':
                loadEquipesForAtividade();
                break;
        }
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // Limpar formulário
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Dashboard
function updateDashboard() {
    const edicoes = dataManager.getAll('edicoes');
    const usuarios = dataManager.getAll('usuarios');
    const equipes = dataManager.getAll('equipes');
    const atividades = dataManager.getAll('atividades');

    document.getElementById('totalEdicoes').textContent = edicoes.filter(e => e.status === 'ativo').length;
    document.getElementById('totalParticipantes').textContent = usuarios.length;
    document.getElementById('totalEquipes').textContent = equipes.length;
    document.getElementById('totalAtividades').textContent = atividades.length;

    // Carregar atividades recentes
    loadRecentActivities();
}

function loadRecentActivities() {
    const atividades = dataManager.getAll('atividades');
    const equipes = dataManager.getAll('equipes');
    const recentActivitiesList = document.getElementById('recentActivitiesList');
    
    // Ordenar por data de criação (simulada) e pegar as 5 mais recentes
    const recentActivities = atividades.slice(-5).reverse();
    
    if (recentActivities.length === 0) {
        recentActivitiesList.innerHTML = '<p>Nenhuma atividade registrada ainda.</p>';
        return;
    }
    
    recentActivitiesList.innerHTML = recentActivities.map(atividade => {
        const equipe = equipes.find(e => e.id === atividade.equipeId);
        return `
            <div class="activity-item">
                <h4>${atividade.nome}</h4>
                <p>Equipe: ${equipe ? equipe.nome : 'N/A'} | Tipo: ${atividade.tipo}</p>
                <span class="activity-date">Meta: ${atividade.metaEsperada} ${atividade.unidadeMeta}</span>
            </div>
        `;
    }).join('');
}

// Gerenciamento de Edições
function loadEdicoes() {
    const edicoes = dataManager.getAll('edicoes');
    const tbody = document.querySelector('#edicoesTable tbody');
    
    tbody.innerHTML = edicoes.map(edicao => `
        <tr>
            <td>${edicao.nome}</td>
            <td>${formatDate(edicao.dataInicio)}</td>
            <td>${formatDate(edicao.dataFim)}</td>
            <td><span class="status ${edicao.status}">${edicao.status}</span></td>
            <td class="actions">
                <button class="btn btn-success" onclick="editEdicao(${edicao.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteEdicao(${edicao.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function editEdicao(id) {
    const edicao = dataManager.getById('edicoes', id);
    if (edicao) {
        document.getElementById('edicaoNome').value = edicao.nome;
        document.getElementById('edicaoDataInicio').value = edicao.dataInicio;
        document.getElementById('edicaoDataFim').value = edicao.dataFim;
        document.getElementById('edicaoDescricao').value = edicao.descricao || '';
        
        // Adicionar ID ao formulário para identificar edição
        document.getElementById('edicaoForm').dataset.editId = id;
        showModal('edicaoModal');
    }
}

function deleteEdicao(id) {
    if (confirm('Tem certeza que deseja excluir esta edição?')) {
        dataManager.delete('edicoes', id);
        loadEdicoes();
        showAlert('Edição excluída com sucesso!', 'success');
    }
}

// Gerenciamento de Participantes
function loadParticipantes() {
    const usuarios = dataManager.getAll('usuarios');
    const tbody = document.querySelector('#participantesTable tbody');
    
    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td><span class="status">${usuario.tipo}</span></td>
            <td>${usuario.curso || 'N/A'}</td>
            <td class="actions">
                <button class="btn btn-success" onclick="editParticipante(${usuario.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteParticipante(${usuario.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function filterParticipantes() {
    const filter = document.getElementById('tipoFilter').value;
    const usuarios = dataManager.getAll('usuarios');
    const filteredUsuarios = filter ? usuarios.filter(u => u.tipo === filter) : usuarios;
    
    const tbody = document.querySelector('#participantesTable tbody');
    tbody.innerHTML = filteredUsuarios.map(usuario => `
        <tr>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td><span class="status">${usuario.tipo}</span></td>
            <td>${usuario.curso || 'N/A'}</td>
            <td class="actions">
                <button class="btn btn-success" onclick="editParticipante(${usuario.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteParticipante(${usuario.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function editParticipante(id) {
    const usuario = dataManager.getById('usuarios', id);
    if (usuario) {
        document.getElementById('participanteNome').value = usuario.nome;
        document.getElementById('participanteEmail').value = usuario.email;
        document.getElementById('participanteTipo').value = usuario.tipo;
        document.getElementById('participanteCurso').value = usuario.curso || '';
        document.getElementById('participanteSenha').value = usuario.senha;
        
        document.getElementById('participanteForm').dataset.editId = id;
        showModal('participanteModal');
    }
}

function deleteParticipante(id) {
    if (confirm('Tem certeza que deseja excluir este participante?')) {
        dataManager.delete('usuarios', id);
        loadParticipantes();
        showAlert('Participante excluído com sucesso!', 'success');
    }
}

// Gerenciamento de Equipes
function loadEquipes() {
    const equipes = dataManager.getAll('equipes');
    const usuarios = dataManager.getAll('usuarios');
    const edicoes = dataManager.getAll('edicoes');
    const tbody = document.querySelector('#equipesTable tbody');
    
    tbody.innerHTML = equipes.map(equipe => {
        const mentor = usuarios.find(u => u.id === equipe.mentorId);
        const edicao = edicoes.find(e => e.id === equipe.edicaoId);
        const membros = equipe.membros ? equipe.membros.length : 0;
        
        return `
            <tr>
                <td>${equipe.nome}</td>
                <td>${mentor ? mentor.nome : 'N/A'}</td>
                <td>${membros} membros</td>
                <td>${edicao ? edicao.nome : 'N/A'}</td>
                <td class="actions">
                    <button class="btn btn-success" onclick="editEquipe(${equipe.id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteEquipe(${equipe.id})">Excluir</button>
                </td>
            </tr>
        `;
    }).join('');
}

function loadMentorsForEquipe() {
    const usuarios = dataManager.getAll('usuarios');
    const mentors = usuarios.filter(u => u.tipo === 'mentor');
    const select = document.getElementById('equipeMentor');
    
    select.innerHTML = '<option value="">Selecione um mentor...</option>' +
        mentors.map(mentor => `<option value="${mentor.id}">${mentor.nome}</option>`).join('');
}

function loadEdicoesForEquipe() {
    const edicoes = dataManager.getAll('edicoes');
    const select = document.getElementById('equipeEdicao');
    
    select.innerHTML = '<option value="">Selecione uma edição...</option>' +
        edicoes.map(edicao => `<option value="${edicao.id}">${edicao.nome}</option>`).join('');
}

function loadAlunosForEquipe() {
    const usuarios = dataManager.getAll('usuarios');
    const alunos = usuarios.filter(u => u.tipo === 'aluno');
    const container = document.getElementById('equipeMembros');
    
    container.innerHTML = alunos.map(aluno => `
        <div class="checkbox-item">
            <input type="checkbox" id="aluno_${aluno.id}" value="${aluno.id}">
            <label for="aluno_${aluno.id}">${aluno.nome} (${aluno.curso})</label>
        </div>
    `).join('');
}

function editEquipe(id) {
    const equipe = dataManager.getById('equipes', id);
    if (equipe) {
        document.getElementById('equipeNome').value = equipe.nome;
        document.getElementById('equipeMentor').value = equipe.mentorId || '';
        document.getElementById('equipeEdicao').value = equipe.edicaoId || '';
        
        // Marcar membros selecionados
        setTimeout(() => {
            if (equipe.membros) {
                equipe.membros.forEach(membroId => {
                    const checkbox = document.getElementById(`aluno_${membroId}`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }, 100);
        
        document.getElementById('equipeForm').dataset.editId = id;
        showModal('equipeModal');
    }
}

function deleteEquipe(id) {
    if (confirm('Tem certeza que deseja excluir esta equipe?')) {
        dataManager.delete('equipes', id);
        loadEquipes();
        showAlert('Equipe excluída com sucesso!', 'success');
    }
}

// Gerenciamento de Atividades
function loadAtividades() {
    const atividades = dataManager.getAll('atividades');
    const equipes = dataManager.getAll('equipes');
    const tbody = document.querySelector('#atividadesTable tbody');
    
    tbody.innerHTML = atividades.map(atividade => {
        const equipe = equipes.find(e => e.id === atividade.equipeId);
        
        return `
            <tr>
                <td>${atividade.nome}</td>
                <td>${atividade.tipo}</td>
                <td>${equipe ? equipe.nome : 'N/A'}</td>
                <td>${formatDate(atividade.dataInicio)}</td>
                <td>${formatDate(atividade.dataFim)}</td>
                <td>${atividade.metaEsperada} ${atividade.unidadeMeta}</td>
                <td>${atividade.valorArrecadado} ${atividade.unidadeMeta}</td>
                <td class="actions">
                    <button class="btn btn-success" onclick="editAtividade(${atividade.id})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteAtividade(${atividade.id})">Excluir</button>
                </td>
            </tr>
        `;
    }).join('');
}

function loadEquipesForAtividade() {
    const equipes = dataManager.getAll('equipes');
    const select = document.getElementById('atividadeEquipe');
    
    select.innerHTML = '<option value="">Selecione uma equipe...</option>' +
        equipes.map(equipe => `<option value="${equipe.id}">${equipe.nome}</option>`).join('');
}

function editAtividade(id) {
    const atividade = dataManager.getById('atividades', id);
    if (atividade) {
        document.getElementById('atividadeNome').value = atividade.nome;
        document.getElementById('atividadeTipo').value = atividade.tipo;
        document.getElementById('atividadeEquipe').value = atividade.equipeId || '';
        document.getElementById('atividadeDataInicio').value = atividade.dataInicio;
        document.getElementById('atividadeDataFim').value = atividade.dataFim;
        document.getElementById('atividadeMetaEsperada').value = atividade.metaEsperada;
        document.getElementById('atividadeUnidadeMeta').value = atividade.unidadeMeta;
        document.getElementById('atividadeValorArrecadado').value = atividade.valorArrecadado || 0;
        document.getElementById('atividadeValorFundo').value = atividade.valorFundo || 0;
        
        document.getElementById('atividadeForm').dataset.editId = id;
        showModal('atividadeModal');
    }
}

function deleteAtividade(id) {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
        dataManager.delete('atividades', id);
        loadAtividades();
        showAlert('Atividade excluída com sucesso!', 'success');
    }
}

// Sistema de Relatórios
function generateReport(type) {
    const reportResult = document.getElementById('reportResult');
    reportResult.classList.add('active');
    
    let reportContent = '';
    
    switch(type) {
        case 'geral':
            reportContent = generateGeneralReport();
            break;
        case 'periodo':
            reportContent = generatePeriodReport();
            break;
        case 'equipe':
            reportContent = generateTeamReport();
            break;
        case 'equipe-periodo':
            reportContent = generateTeamPeriodReport();
            break;
    }
    
    reportResult.innerHTML = reportContent;
}

function generateGeneralReport() {
    const atividades = dataManager.getAll('atividades');
    const equipes = dataManager.getAll('equipes');
    const usuarios = dataManager.getAll('usuarios');
    
    const totalAtividades = atividades.length;
    const totalArrecadado = atividades.reduce((sum, a) => sum + (parseFloat(a.valorArrecadado) || 0), 0);
    const totalFundoUtilizado = atividades.reduce((sum, a) => sum + (parseFloat(a.valorFundo) || 0), 0);
    
    return `
        <h3>Relatório Geral de Atividades</h3>
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-tasks"></i>
                <div class="stat-info">
                    <h3>${totalAtividades}</h3>
                    <p>Total de Atividades</p>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-coins"></i>
                <div class="stat-info">
                    <h3>R$ ${totalArrecadado.toFixed(2)}</h3>
                    <p>Total Arrecadado</p>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-wallet"></i>
                <div class="stat-info">
                    <h3>R$ ${totalFundoUtilizado.toFixed(2)}</h3>
                    <p>Fundo Utilizado</p>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <div class="stat-info">
                    <h3>${equipes.length}</h3>
                    <p>Equipes Ativas</p>
                </div>
            </div>
        </div>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Atividade</th>
                        <th>Tipo</th>
                        <th>Equipe</th>
                        <th>Meta</th>
                        <th>Arrecadado</th>
                        <th>% Atingido</th>
                    </tr>
                </thead>
                <tbody>
                    ${atividades.map(atividade => {
                        const equipe = equipes.find(e => e.id === atividade.equipeId);
                        const percentual = ((parseFloat(atividade.valorArrecadado) || 0) / (parseFloat(atividade.metaEsperada) || 1) * 100).toFixed(1);
                        
                        return `
                            <tr>
                                <td>${atividade.nome}</td>
                                <td>${atividade.tipo}</td>
                                <td>${equipe ? equipe.nome : 'N/A'}</td>
                                <td>${atividade.metaEsperada} ${atividade.unidadeMeta}</td>
                                <td>${atividade.valorArrecadado || 0} ${atividade.unidadeMeta}</td>
                                <td>${percentual}%</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generatePeriodReport() {
    return `
        <h3>Relatório por Período</h3>
        <div class="form-group">
            <label>Selecione o período:</label>
            <input type="date" id="periodoInicio" onchange="updatePeriodReport()">
            <input type="date" id="periodoFim" onchange="updatePeriodReport()">
        </div>
        <div id="periodReportContent">
            <p>Selecione um período para gerar o relatório.</p>
        </div>
    `;
}

function generateTeamReport() {
    const equipes = dataManager.getAll('equipes');
    
    return `
        <h3>Relatório por Equipe</h3>
        <div class="form-group">
            <label>Selecione a equipe:</label>
            <select id="equipeSelect" onchange="updateTeamReport()">
                <option value="">Selecione uma equipe...</option>
                ${equipes.map(equipe => `<option value="${equipe.id}">${equipe.nome}</option>`).join('')}
            </select>
        </div>
        <div id="teamReportContent">
            <p>Selecione uma equipe para gerar o relatório.</p>
        </div>
    `;
}

function generateTeamPeriodReport() {
    const equipes = dataManager.getAll('equipes');
    
    return `
        <h3>Relatório por Equipe e Período</h3>
        <div class="form-group">
            <label>Selecione a equipe:</label>
            <select id="equipeSelectPeriod" onchange="updateTeamPeriodReport()">
                <option value="">Selecione uma equipe...</option>
                ${equipes.map(equipe => `<option value="${equipe.id}">${equipe.nome}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Selecione o período:</label>
            <input type="date" id="teamPeriodoInicio" onchange="updateTeamPeriodReport()">
            <input type="date" id="teamPeriodoFim" onchange="updateTeamPeriodReport()">
        </div>
        <div id="teamPeriodReportContent">
            <p>Selecione uma equipe e período para gerar o relatório.</p>
        </div>
    `;
}

function updatePeriodReport() {
    const inicio = document.getElementById('periodoInicio').value;
    const fim = document.getElementById('periodoFim').value;
    
    if (!inicio || !fim) return;
    
    const atividades = dataManager.getAll('atividades');
    const equipes = dataManager.getAll('equipes');
    
    const atividadesPeriodo = atividades.filter(a => 
        a.dataInicio >= inicio && a.dataFim <= fim
    );
    
    const content = document.getElementById('periodReportContent');
    content.innerHTML = `
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-tasks"></i>
                <div class="stat-info">
                    <h3>${atividadesPeriodo.length}</h3>
                    <p>Atividades no Período</p>
                </div>
            </div>
        </div>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Atividade</th>
                        <th>Equipe</th>
                        <th>Data Início</th>
                        <th>Data Fim</th>
                        <th>Arrecadado</th>
                    </tr>
                </thead>
                <tbody>
                    ${atividadesPeriodo.map(atividade => {
                        const equipe = equipes.find(e => e.id === atividade.equipeId);
                        return `
                            <tr>
                                <td>${atividade.nome}</td>
                                <td>${equipe ? equipe.nome : 'N/A'}</td>
                                <td>${formatDate(atividade.dataInicio)}</td>
                                <td>${formatDate(atividade.dataFim)}</td>
                                <td>${atividade.valorArrecadado || 0} ${atividade.unidadeMeta}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function updateTeamReport() {
    const equipeId = document.getElementById('equipeSelect').value;
    if (!equipeId) return;
    
    const atividades = dataManager.getAll('atividades');
    const equipes = dataManager.getAll('equipes');
    const usuarios = dataManager.getAll('usuarios');
    
    const equipe = equipes.find(e => e.id === parseInt(equipeId));
    const atividadesEquipe = atividades.filter(a => a.equipeId === parseInt(equipeId));
    const mentor = usuarios.find(u => u.id === equipe.mentorId);
    
    const content = document.getElementById('teamReportContent');
    content.innerHTML = `
        <h4>Equipe: ${equipe.nome}</h4>
        <p><strong>Mentor:</strong> ${mentor ? mentor.nome : 'N/A'}</p>
        <p><strong>Membros:</strong> ${equipe.membros ? equipe.membros.length : 0}</p>
        
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-tasks"></i>
                <div class="stat-info">
                    <h3>${atividadesEquipe.length}</h3>
                    <p>Atividades da Equipe</p>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Atividade</th>
                        <th>Tipo</th>
                        <th>Meta</th>
                        <th>Arrecadado</th>
                        <th>% Atingido</th>
                    </tr>
                </thead>
                <tbody>
                    ${atividadesEquipe.map(atividade => {
                        const percentual = ((parseFloat(atividade.valorArrecadado) || 0) / (parseFloat(atividade.metaEsperada) || 1) * 100).toFixed(1);
                        return `
                            <tr>
                                <td>${atividade.nome}</td>
                                <td>${atividade.tipo}</td>
                                <td>${atividade.metaEsperada} ${atividade.unidadeMeta}</td>
                                <td>${atividade.valorArrecadado || 0} ${atividade.unidadeMeta}</td>
                                <td>${percentual}%</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function updateTeamPeriodReport() {
    const equipeId = document.getElementById('equipeSelectPeriod').value;
    const inicio = document.getElementById('teamPeriodoInicio').value;
    const fim = document.getElementById('teamPeriodoFim').value;
    
    if (!equipeId || !inicio || !fim) return;
    
    const atividades = dataManager.getAll('atividades');
    const equipes = dataManager.getAll('equipes');
    
    const equipe = equipes.find(e => e.id === parseInt(equipeId));
    const atividadesEquipePeriodo = atividades.filter(a => 
        a.equipeId === parseInt(equipeId) && 
        a.dataInicio >= inicio && 
        a.dataFim <= fim
    );
    
    const content = document.getElementById('teamPeriodReportContent');
    content.innerHTML = `
        <h4>Equipe: ${equipe.nome}</h4>
        <p><strong>Período:</strong> ${formatDate(inicio)} a ${formatDate(fim)}</p>
        
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-tasks"></i>
                <div class="stat-info">
                    <h3>${atividadesEquipePeriodo.length}</h3>
                    <p>Atividades no Período</p>
                </div>
            </div>
        </div>
        
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Atividade</th>
                        <th>Data Início</th>
                        <th>Data Fim</th>
                        <th>Meta</th>
                        <th>Arrecadado</th>
                    </tr>
                </thead>
                <tbody>
                    ${atividadesEquipePeriodo.map(atividade => `
                        <tr>
                            <td>${atividade.nome}</td>
                            <td>${formatDate(atividade.dataInicio)}</td>
                            <td>${formatDate(atividade.dataFim)}</td>
                            <td>${atividade.metaEsperada} ${atividade.unidadeMeta}</td>
                            <td>${atividade.valorArrecadado || 0} ${atividade.unidadeMeta}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Funções utilitárias
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function logout() {
    authManager.logout();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Modal controls
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Login button
    document.getElementById('loginBtn').addEventListener('click', function() {
        showModal('loginModal');
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;
        
        if (authManager.login(email, password, userType)) {
            hideModal('loginModal');
            showAlert('Login realizado com sucesso!', 'success');
        } else {
            showAlert('Credenciais inválidas!', 'error');
        }
    });
    
    // Edição form
    document.getElementById('edicaoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const edicao = {
            nome: formData.get('nome'),
            dataInicio: formData.get('dataInicio'),
            dataFim: formData.get('dataFim'),
            descricao: formData.get('descricao'),
            status: 'ativo'
        };
        
        const editId = this.dataset.editId;
        if (editId) {
            edicao.id = parseInt(editId);
            delete this.dataset.editId;
        }
        
        dataManager.save('edicoes', edicao);
        hideModal('edicaoModal');
        loadEdicoes();
        showAlert('Edição salva com sucesso!', 'success');
    });
    
    // Participante form
    document.getElementById('participanteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const participante = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            tipo: formData.get('tipo'),
            curso: formData.get('curso'),
            senha: formData.get('senha')
        };
        
        const editId = this.dataset.editId;
        if (editId) {
            participante.id = parseInt(editId);
            delete this.dataset.editId;
        }
        
        dataManager.save('usuarios', participante);
        hideModal('participanteModal');
        loadParticipantes();
        showAlert('Participante salvo com sucesso!', 'success');
    });
    
    // Equipe form
    document.getElementById('equipeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const selectedMembros = Array.from(document.querySelectorAll('#equipeMembros input:checked'))
            .map(checkbox => parseInt(checkbox.value));
        
        const equipe = {
            nome: formData.get('nome'),
            mentorId: parseInt(formData.get('mentor')),
            edicaoId: parseInt(formData.get('edicao')),
            membros: selectedMembros
        };
        
        const editId = this.dataset.editId;
        if (editId) {
            equipe.id = parseInt(editId);
            delete this.dataset.editId;
        }
        
        dataManager.save('equipes', equipe);
        hideModal('equipeModal');
        loadEquipes();
        showAlert('Equipe salva com sucesso!', 'success');
    });
    
    // Atividade form
    document.getElementById('atividadeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const atividade = {
            nome: formData.get('nome'),
            tipo: formData.get('tipo'),
            equipeId: parseInt(formData.get('equipe')),
            dataInicio: formData.get('dataInicio'),
            dataFim: formData.get('dataFim'),
            metaEsperada: parseFloat(formData.get('metaEsperada')),
            unidadeMeta: formData.get('unidadeMeta'),
            valorArrecadado: parseFloat(formData.get('valorArrecadado')) || 0,
            valorFundo: parseFloat(formData.get('valorFundo')) || 0
        };
        
        const editId = this.dataset.editId;
        if (editId) {
            atividade.id = parseInt(editId);
            delete this.dataset.editId;
        }
        
        dataManager.save('atividades', atividade);
        hideModal('atividadeModal');
        loadAtividades();
        showAlert('Atividade salva com sucesso!', 'success');
    });
});

