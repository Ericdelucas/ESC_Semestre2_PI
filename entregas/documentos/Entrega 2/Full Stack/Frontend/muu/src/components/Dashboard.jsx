function Dashboard({ active, edicoes, participantes, equipes, atividades }) {
  // Dados de exemplo para atividades recentes
  const atividadesRecentes = [
    {
      id: 1,
      nome: "Arrecadação de Alimentos",
      equipe: "Equipe Alpha",
      data: "2024-12-10",
      descricao: "Campanha de arrecadação no campus"
    },
    {
      id: 2,
      nome: "Workshop de Liderança",
      equipe: "Equipe Beta",
      data: "2024-12-09",
      descricao: "Treinamento em habilidades de liderança"
    },
    {
      id: 3,
      nome: "Visita ao Lar de Idosos",
      equipe: "Equipe Gamma",
      data: "2024-12-08",
      descricao: "Atividade de interação social"
    }
  ]

  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container">
        <h2>Dashboard</h2>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <i className="fas fa-calendar"></i>
            <div className="stat-info">
              <h3>{edicoes.length}</h3>
              <p>Edições Ativas</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <div className="stat-info">
              <h3>{participantes.length}</h3>
              <p>Participantes</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-user-friends"></i>
            <div className="stat-info">
              <h3>{equipes.length}</h3>
              <p>Equipes</p>
            </div>
          </div>
          
          <div className="stat-card">
            <i className="fas fa-tasks"></i>
            <div className="stat-info">
              <h3>{atividades.length}</h3>
              <p>Atividades</p>
            </div>
          </div>
        </div>
        
        <div className="recent-activities">
          <h3>Atividades Recentes</h3>
          <div className="activities-list">
            {atividadesRecentes.map(atividade => (
              <div key={atividade.id} className="activity-item">
                <h4>{atividade.nome}</h4>
                <p>{atividade.descricao}</p>
                <div className="activity-date">
                  {atividade.equipe} - {new Date(atividade.data).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard

