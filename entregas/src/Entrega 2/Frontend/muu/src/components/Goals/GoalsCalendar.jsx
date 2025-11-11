import { useState, useMemo } from "react"

function GoalsCalendar({ metas = [], onMetasChange, equipeUsuario = "Equipe Alpha" }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingMeta, setEditingMeta] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    prioridade: "media",
    status: "pendente",
    equipe: equipeUsuario
  })

  // === Funções de Calendário ===
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ date: new Date(year, month, i - firstDay.getDay() + 1), isCurrentMonth: false })
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }

    while (days.length < 42) {
      const nextDate = new Date(
        year,
        month,
        lastDay.getDate() + (days.length - (firstDay.getDay() + lastDay.getDate())) + 1
      )
      days.push({ date: nextDate, isCurrentMonth: false })
    }

    return days
  }

  const getMetasForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0]
    return metas.filter((meta) => dateStr >= meta.dataInicio && dateStr <= meta.dataFim)
  }

  // === Navegação ===
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  // === Modal ===
  const openNewMetaModal = () => {
    if (!selectedDate) {
      alert("Selecione um dia no calendário antes de criar uma meta.")
      return
    }

    setEditingMeta(null)
    setFormData({
      titulo: "",
      descricao: "",
      dataInicio: selectedDate.toISOString().split("T")[0],
      dataFim: selectedDate.toISOString().split("T")[0],
      prioridade: "media",
      status: "pendente",
      equipe: equipeUsuario
    })
    setShowModal(true)
  }

  const openEditMetaModal = (meta) => {
    setEditingMeta(meta)
    setFormData({ ...meta })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingMeta) {
      const atualizadas = metas.map((m) =>
        m.id === editingMeta.id ? { ...editingMeta, ...formData } : m
      )
      onMetasChange && onMetasChange(atualizadas)
    } else {
      const novaMeta = { id: Date.now(), ...formData }
      const novas = [...metas, novaMeta]
      onMetasChange && onMetasChange(novas)
    }

    setShowModal(false)
    setEditingMeta(null)
  }

  const handleDelete = () => {
    if (!editingMeta) return
    if (!confirm("Deseja realmente excluir esta meta?")) return

    const filtradas = metas.filter((m) => m.id !== editingMeta.id)
    onMetasChange && onMetasChange(filtradas)
    setShowModal(false)
    setEditingMeta(null)
  }

  // === Utilitários ===
  const calcularProgressoMeta = (meta) => {
    const inicio = new Date(meta.dataInicio)
    const fim = new Date(meta.dataFim)
    const hoje = new Date()

    if (hoje <= inicio) return 0
    if (hoje >= fim) return 100

    const total = fim - inicio
    const passado = hoje - inicio
    return Math.min(100, Math.round((passado / total) * 100))
  }

  const metasAtivas = useMemo(() => {
    const hoje = new Date()
    return metas.filter((meta) => new Date(meta.dataFim) >= hoje)
  }, [metas])

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  // === Interface ===
  return (
    <div className="goals-calendar">
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button onClick={handlePrevMonth} className="nav-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={handleNextMonth} className="nav-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <button className="btn btn-primary" onClick={openNewMetaModal}>
          <i className="fas fa-plus"></i> Nova Meta
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {getDaysInMonth(currentDate).map((dayObj, i) => {
            const metasDoDia = getMetasForDate(dayObj.date)
            const isSelected = selectedDate && dayObj.date.toDateString() === selectedDate.toDateString()

            return (
              <div
                key={i}
                className={`calendar-day ${!dayObj.isCurrentMonth ? "other-month" : ""} ${isSelected ? "selected" : ""}`}
                onClick={() => handleDateClick(dayObj.date)}
              >
                <span className="day-number">{dayObj.date.getDate()}</span>

                {metasDoDia.map((meta) => (
                  <div
                    key={meta.id}
                    className="meta-indicator"
                    title={meta.descricao || meta.titulo}
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditMetaModal(meta)
                    }}
                  >
                    {meta.titulo}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* === MODAL UNIVERSAL === */}
      <div className={`modal ${showModal ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>{editingMeta ? "Editar Meta" : "Nova Meta"}</h2>
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título da Meta *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Data de Início *</label>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Data de Fim *</label>
                <input
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              {editingMeta && (
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  <i className="fas fa-trash"></i> Excluir
                </button>
              )}
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">{editingMeta ? "Salvar Alterações" : "Salvar"}</button>
            </div>
          </form>
        </div>
      </div>

      {/* === SIDEBAR === */}
      <div className={`sidebar ${showSidebar ? "open" : ""}`}>
        <button className="toggle-btn" onClick={() => setShowSidebar(!showSidebar)}>
          <i className={`fas fa-chevron-${showSidebar ? "right" : "left"}`}></i>
        </button>
        <h3>⏳ Prazo das Metas</h3>

        {metasAtivas.length === 0 ? (
          <p>Nenhuma meta em andamento</p>
        ) : (
          metasAtivas.map((meta) => {
            const progresso = calcularProgressoMeta(meta)
            const diasRestantes = Math.ceil((new Date(meta.dataFim) - new Date()) / (1000 * 60 * 60 * 24))

            return (
              <div key={meta.id} className="meta-progress">
                <strong>{meta.titulo}</strong>
                <div className="progress-bar">
                  <div
                    className={`progress ${progresso > 80 ? "danger" : progresso > 50 ? "warning" : "safe"}`}
                    style={{ width: `${progresso}%` }}
                  ></div>
                </div>
                <small>{diasRestantes > 0 ? `${diasRestantes} dias restantes` : "Prazo encerrado"}</small>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default GoalsCalendar
