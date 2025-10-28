import videoFile from '../assets/video.mp4'

function Welcome({ active, onLogin }) {
  return (
    <section className={`section ${active ? 'active' : ''}`}>
      <div className="container_body">
        <div className="welcome-content">
          <h1>Bem-vindo ao Sistema Lideranças Empáticas</h1>
          <p>Uma plataforma para gerenciar projetos de impacto social e desenvolvimento humano.</p>
          
          <div className="features">
            <div className="feature">
              <i className="fas fa-users"></i>
              <h3>Gerenciamento de Equipes</h3>
              <p>Organize e acompanhe equipes de alunos com seus mentores</p>
            </div>
            <div className="feature">
              <i className="fas fa-tasks"></i>
              <h3>Controle de Atividades</h3>
              <p>Registre e monitore atividades de arrecadação e impacto social</p>
            </div>
            <div className="feature">
              <i className="fas fa-chart-bar"></i>
              <h3>Relatórios Detalhados</h3>
              <p>Visualize resultados e gere relatórios de desempenho</p>
            </div>
          </div>
          
          <button className="btn btn-primary btn-large" onClick={onLogin}>
            Começar Agora
          </button>

          <footer>
            <h2>Fecap</h2>
          </footer>
          
          <p className="branca">
          O projeto Lideranças Empáticas tem como objetivo elevar o aprendizado dos estudantes do 1° semestre dos cursos de ciências econômicas, ciências contábeis e administração da Fundação Escola de Comércio Álvares Penteado - FECAP
          </p>
          
          <div className="welcome-video">
            <video src={videoFile} controls width="400">
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Welcome

