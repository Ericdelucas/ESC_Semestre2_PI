import ReactDOM from 'react-dom'

function ModalVerRelatorio({ show, onClose, relatorio, equipes = [], participantes = [], pontosDoRelatorio = () => 0 }) {
  if (!show || !relatorio) return null

  // parse dados_json com segurança
  let dados = {}
  try { dados = typeof relatorio.dados_json === 'string' ? JSON.parse(relatorio.dados_json) : (relatorio.dados_json || {}) } catch (e) { dados = {} }

  const equipeName = (() => {
    if (relatorio.equipe_id) {
      const eq = equipes.find(e => String(e.id) === String(relatorio.equipe_id))
      if (eq) return eq.nome
    }
    return relatorio.titulo || '—'
  })()

  const pontos = pontosDoRelatorio(relatorio)

  return ReactDOM.createPortal(
    <div className="modal active" style={{ zIndex: 4000 }}>
      <div className="modal-content" style={{ maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2>Visualizar Relatório</h2>
          <span className="close" onClick={onClose} style={{ cursor: 'pointer' }}>&times;</span>
        </div>

        <div style={{ padding: '1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{relatorio.titulo}</div>
            <div style={{ color: '#666' }}>· {relatorio.tipo}</div>
            <div style={{ marginLeft: 'auto', color: '#333' }}>{new Date(relatorio.created_at || relatorio.createdAt || Date.now()).toLocaleString('pt-BR')}</div>
          </div>

          <div style={{ marginBottom: '0.8rem' }}>
            <strong>Equipe:</strong> {equipeName}
          </div>

          <div style={{ marginBottom: '0.8rem' }}>
            <strong>Gerado por:</strong> {relatorio.gerado_por || '—'}
          </div>

          <div style={{ marginBottom: '0.8rem' }}>
            <strong>Pontos calculados:</strong> {pontos}
          </div>

          <hr style={{ margin: '1rem 0' }} />

          <div style={{ marginBottom: '1rem' }}>
            <strong>Resumo</strong>
            <p style={{ whiteSpace: 'pre-wrap' }}>{dados.resumo || '—'}</p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Resultados</strong>
            <p style={{ whiteSpace: 'pre-wrap' }}>{dados.resultados || '—'}</p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Tipo de impacto:</strong> {dados.tipoImpacto || dados.tipo || '—'}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Quantidade / Impacto:</strong> {dados.quantidade ?? dados.impacto ?? '—'}
          </div>

          {/* imagem/arquivo se existir */}
          {relatorio.arquivo_path || dados.imagem || dados.fileUrl ? (
            <div style={{ marginTop: '1rem' }}>
              <strong>Arquivo / Imagem</strong>
              <div style={{ marginTop: '0.6rem' }}>
                <img src={relatorio.arquivo_path || dados.imagem || dados.fileUrl} alt="anexo" style={{ maxWidth: '100%', borderRadius: 8 }} />
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.4rem' }}>
            <button className="btn btn-outline" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ModalVerRelatorio
