import { useState, useEffect } from 'react'

function GoalsCalendar({ userType = 'aluno', equipeUsuario = 'Equipe Alpha', metas = [], onMetasChange }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [metaSelecionada, setMetaSelecionada] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    prioridade: 'media',
    status: 'pendente',
    responsavel: '',
    equipe: equipeUsuario
  })

  // Usar metas passadas como prop ao invés de dados forjados

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({ date, isCurrentMonth: true })
    }
    
    // Dias do próximo mês para completar a grade
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day)
      days.push({ date: nextDate, isCurrentMonth: false })
    }
    
    return days
  }

  const getMetasForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return metas.filter(meta => {
      return dateStr >= meta.dataInicio && dateStr <= meta.dataFim
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    const metasData = getMetasForDate(date)
    if (metasData.length > 0) {
      // Mostrar detalhes das metas do dia
    }
  }

  const handleAddMeta = () => {
    setMetaSelecionada(null)
    setFormData({
      titulo: '',
      descricao: '',
      dataInicio: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      dataFim: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      prioridade: 'media',
      status: 'pendente',
      responsavel: '',
      equipe: equipeUsuario
    })
    setShowModal(true)
  }

  const handleEditMeta = (meta) => {
    setMetaSelecionada(meta)
    setFormData(meta)
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (metaSelecionada) {
      // Editar meta existente
      const metasAtualizadas = metas.map(meta => 
        meta.id === metaSelecionada.id ? { ...formData, id: meta.id } : meta
      )
      if (onMetasChange) {
        onMetasChange(metasAtualizadas)
      }
    } else {
      // Adicionar nova meta
      const novaMeta = {
        ...formData,
        id: Date.now(),
        progresso: 0
      }
      const metasAtualizadas = [...metas, novaMeta]
      if (onMetasChange) {
        onMetasChange(metasAtualizadas)
      }
    }
    
    setShowModal(false)
    setMetaSelecionada(null)
    setFormData({
      titulo: '',
      descricao: '',
      dataInicio: '',
      dataFim: '',
      prioridade: 'media',
      status: 'pendente',
      responsavel: '',
      equipe: equipeUsuario
    })
  }

  const handleDeleteMeta = (metaId) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      const metasAtualizadas = metas.filter(meta => meta.id !== metaId)
      if (onMetasChange) {
        onMetasChange(metasAtualizadas)
      }
    }
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getPrioridadeClass = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'priority-high'
      case 'media': return 'priority-medium'
      case 'baixa': return 'priority-low'
      default: return 'priority-medium'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'concluida': return 'status-completed'
      case 'em_andamento': return 'status-progress'
      case 'pendente': return 'status-pending'
      case 'atrasada': return 'status-overdue'
      default: return 'status-pending'
    }
  }

  return (
    <div className="goals-calendar">
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button onClick={handlePrevMonth} className="nav-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={handleNextMonth} className="nav-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="calendar-actions">
          <button className="btn btn-primary" onClick={handleAddMeta}>
            <i className="fas fa-plus"></i>
            Nova Meta
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {getDaysInMonth(currentDate).map((dayObj, index) => {
            const metasData = getMetasForDate(dayObj.date)
            const isToday = dayObj.date.toDateString() === new Date().toDateString()
            const isSelected = selectedDate && dayObj.date.toDateString() === selectedDate.toDateString()
            
            return (
              <div
                key={index}
                className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDateClick(dayObj.date)}
              >
                <span className="day-number">{dayObj.date.getDate()}</span>
                {metasData.length > 0 && (
                  <div className="day-metas">
                    {metasData.slice(0, 2).map(meta => (
                      <div
                        key={meta.id}
                        className={`meta-indicator ${getPrioridadeClass(meta.prioridade)} ${getStatusClass(meta.status)}`}
                        title={meta.titulo}
                      >
                        {meta.titulo.substring(0, 15)}...
                      </div>
                    ))}
                    {metasData.length > 2 && (
                      <div className="meta-more">+{metasData.length - 2}</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Lista de Metas */}
      <div className="metas-list">
        <h4>
          <i className="fas fa-list"></i>
          Metas da Equipe {equipeUsuario}
        </h4>
        <div className="metas-grid">
          {metas.map(meta => (
            <div key={meta.id} className={`meta-card ${getStatusClass(meta.status)}`}>
              <div className="meta-header">
                <h5>{meta.titulo}</h5>
                <div className="meta-actions">
                  <button onClick={() => handleEditMeta(meta)} className="btn-icon">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDeleteMeta(meta.id)} className="btn-icon delete">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <p className="meta-description">{meta.descricao}</p>
              
              <div className="meta-details">
                <span className="meta-date">
                  <i className="fas fa-calendar"></i>
                  {new Date(meta.dataInicio).toLocaleDateString('pt-BR')} - {new Date(meta.dataFim).toLocaleDateString('pt-BR')}
                </span>
                <span className={`meta-priority ${getPrioridadeClass(meta.prioridade)}`}>
                  {meta.prioridade.charAt(0).toUpperCase() + meta.prioridade.slice(1)}
                </span>
              </div>
              
              {meta.progresso !== undefined && (
                <div className="meta-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${meta.progresso}%`}}
                    ></div>
                  </div>
                  <span className="progress-text">{meta.progresso}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Meta */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal goals-modal">
            <div className="modal-header">
              <h3>{metaSelecionada ? 'Editar Meta' : 'Nova Meta'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="goals-form">
              <div className="form-group">
                <label>Título da Meta *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({...prev, titulo: e.target.value}))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({...prev, descricao: e.target.value}))}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data de Início *</label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData(prev => ({...prev, dataInicio: e.target.value}))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Data de Fim *</label>
                  <input
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => setFormData(prev => ({...prev, dataFim: e.target.value}))}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prioridade</label>
                  <select
                    value={formData.prioridade}
                    onChange={(e) => setFormData(prev => ({...prev, prioridade: e.target.value}))}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="atrasada">Atrasada</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Responsável</label>
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData(prev => ({...prev, responsavel: e.target.value}))}
                  placeholder="Nome do responsável"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i>
                  {metaSelecionada ? 'Atualizar' : 'Criar'} Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalsCalendar

