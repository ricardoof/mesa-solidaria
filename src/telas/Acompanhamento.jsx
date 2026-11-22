import { MapPin, Trophy } from 'lucide-react'
import { useApp } from '../estado.jsx'
import { ROTULO_MODALIDADE, ROTULO_TIPO, descreverItens, fmtData } from '../dados.js'
import { Botao, Caixa, Dado, Tela } from '../componentes/ui.jsx'
import { LinhaStatus } from '../componentes/comuns.jsx'

export default function Acompanhamento({ id }) {
  const app = useApp()
  const d = app.doacoes.find((x) => x.id === id)
  if (!d) return null

  async function consultar() {
    const ok = await app.processo(() => {
      if (d.etapa === 0) {
        app.atualizarDoacao(d.id, { etapa: 1 })
        return { msg: 'Solicitação em análise: a equipe está conferindo os itens. Consulte de novo em instantes.', tom: 'info' }
      }
      return null
    })
    if (ok) {
      app.atualizarDoacao(d.id, { etapa: 2 })
      app.avisar('Doação aprovada. As orientações de entrega estão disponíveis.')
    }
  }

  let rodape = null
  if (d.etapa < 2) rodape = <Botao onClick={consultar}>Consultar andamento</Botao>
  else if (d.etapa === 2) rodape = <Botao onClick={() => app.ir('entrega', { id: d.id })}>Ver orientações de entrega</Botao>

  return (
    <Tela titulo="Acompanhamento da doação" subtitulo={`Protocolo ${d.protocolo}`} rodape={rodape}>
      <Caixa titulo="Para onde vai sua doação" icone={MapPin} tom="folha">
        <p><strong>{app.banco.nome}</strong>, que repassa para {app.banco.instituicoes} instituições e famílias cadastradas do bairro.</p>
      </Caixa>
      <Caixa><LinhaStatus etapa={d.etapa} /></Caixa>
      <Caixa>
        <dl>
          <Dado rotulo="Tipo">{ROTULO_TIPO[d.tipo]}</Dado>
          {d.tipo !== 'lote' && <Dado rotulo="Categoria">{d.categoria}</Dado>}
          <Dado rotulo="Itens">{descreverItens(d)}</Dado>
          <Dado rotulo="Como chega">{d.tipo === 'lote' ? 'Coleta na loja' : ROTULO_MODALIDADE[d.modalidade]}</Dado>
          <Dado rotulo="Registrada em">{fmtData(d.criadaEm)}</Dado>
        </dl>
      </Caixa>
      {d.etapa === 3 ? (
        <Caixa titulo={`+${d.pontosLiberados} pontos liberados`} icone={Trophy} tom="milho">
          <p>A equipe confirmou o recebimento. Obrigado por doar!</p>
        </Caixa>
      ) : (
        <p className="text-sm text-stone-600">Os pontos são liberados quando a equipe confirmar o recebimento.</p>
      )}
    </Tela>
  )
}
