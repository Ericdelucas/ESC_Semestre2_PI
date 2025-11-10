import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'

function Graficos({ active }) {
  const [selected, setSelected] = useState('linha')

  const dadosMensais = Array.from({ length: 12 }).map((_, i) => ({
    mes: new Date(0, i).toLocaleString('pt-BR', { month: 'short' }),
    arrecadado: Math.floor(Math.random() * 4000 + 1000),
    meta: Math.floor(Math.random() * 5000 + 2000),
  }))

  const dadosDoacoes = [
    { name: 'Doações', value: 60 },
    { name: 'Metas Concluídas', value: 25 },
    { name: 'Metas Pendentes', value: 15 },
  ]

  const cores = ['#00C49F', '#FFBB28', '#FF8042']

  if (!active) return null

  return (
    <section className="section active">
      <div className="container">
        <h2>Gráficos de Desempenho</h2>

        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <button onClick={() => setSelected('linha')} className="btn btn-primary" style={{ marginRight: '8px' }}>Linha</button>
          <button onClick={() => setSelected('barras')} className="btn btn-primary" style={{ marginRight: '8px' }}>Barras</button>
          <button onClick={() => setSelected('pizza')} className="btn btn-primary">Pizza</button>
        </div>

        <div style={{ height: 400 }}>
          {selected === 'linha' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="arrecadado" stroke="#007bff" strokeWidth={3} />
                <Line type="monotone" dataKey="meta" stroke="#00c49f" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {selected === 'barras' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="arrecadado" fill="#007bff" />
                <Bar dataKey="meta" fill="#00c49f" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {selected === 'pizza' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosDoacoes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dadosDoacoes.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  )
}

export default Graficos
