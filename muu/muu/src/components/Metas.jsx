import { useState } from 'react'
import GoalsCalendar from './Goals/GoalsCalendar'
import AdminGoalsView from './Goals/AdminGoalsView'

function Metas({ active, user, metas = [], onMetasChange }) {
  const [viewMode, setViewMode] = useState('calendar') // calendar, admin
  
  // Determinar se o usuário é administrador
  const isAdmin = user && (user.tipo === 'administrador' || user.tipo === 'professor')
  
  const handleMetasChange = (novasMetas) => {
    if (onMetasChange) {
      onMetasChange(novasMetas)
    }
  }
  
  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2>Gerenciamento de Metas</h2>
          <div className="section-actions">
            {isAdmin && (
              <div className="view-toggle">
                <button 
                  className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setViewMode('calendar')}
                >
                  <i className="fas fa-calendar"></i>
                  Calendário
                </button>
                <button 
                  className={`btn ${viewMode === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setViewMode('admin')}
                >
                  <i className="fas fa-users-cog"></i>
                  Visão Admin
                </button>
              </div>
            )}
            <button className="btn btn-outline">
              <i className="fas fa-download"></i>
              Exportar
            </button>
          </div>
        </div>

        {/* Informações do usuário */}
        <div className="user-context">
          <div className="context-card">
            <i className="fas fa-user"></i>
            <div>
              <h4>Usuário Atual</h4>
              <p>{user ? `${user.nome} (${user.tipo})` : 'Não logado'}</p>
            </div>
          </div>
          
          {user && user.equipe && (
            <div className="context-card">
              <i className="fas fa-users"></i>
              <div>
                <h4>Equipe</h4>
                <p>{user.equipe}</p>
              </div>
            </div>
          )}
          
          <div className="context-card">
            <i className="fas fa-info-circle"></i>
            <div>
              <h4>Permissões</h4>
              <p>{isAdmin ? 'Administrador - Acesso completo' : 'Aluno - Gerenciar metas da equipe'}</p>
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="metas-stats">
          <div className="stat-card">
            <i className="fas fa-tasks"></i>
            <div className="stat-info">
              <h3>{metas.length}</h3>
              <p>Metas Ativas</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-check-circle"></i>
            <div className="stat-info">
              <h3>{metas.filter(meta => meta.status === 'concluida').length}</h3>
              <p>Concluídas</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-clock"></i>
            <div className="stat-info">
              <h3>{metas.filter(meta => meta.status === 'em_andamento').length}</h3>
              <p>Em Andamento</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-exclamation-triangle"></i>
            <div className="stat-info">
              <h3>{metas.filter(meta => meta.status === 'pendente').length}</h3>
              <p>Pendentes</p>
            </div>
          </div>
        </div>

        {/* Alertas Importantes */}
        <div className="metas-alerts">
          <h3>
            <i className="fas fa-bell"></i>
            Alertas Importantes
          </h3>
          <div className="alerts-list">
            <div className="alert-item warning">
              <i className="fas fa-exclamation-triangle"></i>
              <div className="alert-content">
                <h4>Meta com Prazo Próximo</h4>
                <p>A meta "Arrecadar 50kg de alimentos" vence em 3 dias.</p>
                <small>Equipe Alpha</small>
              </div>
            </div>
            
            <div className="alert-item success">
              <i className="fas fa-check-circle"></i>
              <div className="alert-content">
                <h4>Meta Concluída</h4>
                <p>Parabéns! A meta "Campanha de Reciclagem" foi concluída com sucesso.</p>
                <small>Equipe Beta</small>
              </div>
            </div>
            
            <div className="alert-item info">
              <i className="fas fa-info-circle"></i>
              <div className="alert-content">
                <h4>Nova Funcionalidade</h4>
                <p>Agora você pode definir metas recorrentes no calendário.</p>
                <small>Sistema</small>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {viewMode === 'calendar' ? (
          <GoalsCalendar 
            userType={user?.tipo || 'aluno'}
            equipeUsuario={user?.equipe || 'Equipe Alpha'}
            metas={metas}
            onMetasChange={handleMetasChange}
          />
        ) : (
          isAdmin && <AdminGoalsView metas={metas} />
        )}

        {/* Dicas e Ajuda */}
        <div className="metas-help">
          <h3>
            <i className="fas fa-lightbulb"></i>
            Dicas para Gerenciar Metas
          </h3>
          <div className="help-grid">
            <div className="help-card">
              <i className="fas fa-target"></i>
              <h4>Seja Específico</h4>
              <p>Defina metas claras e mensuráveis. Ex: "Arrecadar 50kg de alimentos" ao invés de "Arrecadar alimentos".</p>
            </div>
            
            <div className="help-card">
              <i className="fas fa-calendar-check"></i>
              <h4>Defina Prazos</h4>
              <p>Estabeleça datas realistas para início e fim das metas. Isso ajuda no planejamento e acompanhamento.</p>
            </div>
            
            <div className="help-card">
              <i className="fas fa-users"></i>
              <h4>Trabalhe em Equipe</h4>
              <p>Distribua responsabilidades entre os membros da equipe para aumentar as chances de sucesso.</p>
            </div>
            
            <div className="help-card">
              <i className="fas fa-chart-line"></i>
              <h4>Acompanhe o Progresso</h4>
              <p>Atualize regularmente o status das metas e celebre as conquistas da equipe.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Metas

