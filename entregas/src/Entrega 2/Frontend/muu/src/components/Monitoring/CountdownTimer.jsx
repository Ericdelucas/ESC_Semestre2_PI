import { useState, useEffect } from 'react'

function CountdownTimer({ targetDate, title = "Tempo Restante para Conclusão das Tarefas" }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
        setIsExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
      }
    }

    // Calcular imediatamente
    calculateTimeLeft()

    // Atualizar a cada segundo
    const timer = setInterval(calculateTimeLeft, 1000)

    // Cleanup
    return () => clearInterval(timer)
  }, [targetDate])

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0')
  }

  return (
    <div className="countdown-timer">
      <div className="countdown-header">
        <i className="fas fa-clock"></i>
        <h3>{title}</h3>
      </div>
      
      <div className={`countdown-display ${isExpired ? 'expired' : ''}`}>
        {isExpired ? (
          <div className="expired-message">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Prazo Expirado!</span>
          </div>
        ) : (
          <div className="time-units">
            <div className="time-unit">
              <div className="time-number">{formatNumber(timeLeft.days)}</div>
              <div className="time-label">Dias</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-number">{formatNumber(timeLeft.hours)}</div>
              <div className="time-label">Horas</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-number">{formatNumber(timeLeft.minutes)}</div>
              <div className="time-label">Minutos</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-number">{formatNumber(timeLeft.seconds)}</div>
              <div className="time-label">Segundos</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="countdown-info">
        <p>
          <i className="fas fa-calendar-alt"></i>
          Data limite: {new Date(targetDate).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}

export default CountdownTimer

