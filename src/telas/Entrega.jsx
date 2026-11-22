// Entrega da doação: preparação, orientações e confirmação do recebimento
import { useState } from 'react'
import { useApp } from '../estado.jsx'
import { SELO_PONTOS } from '../dados.js'
import { Botao, Tela } from '../componentes/ui.jsx'
import { OrientacoesEntrega } from './Confirmacao.jsx'

const PONTOS = { comum: { habitante: 30, estabelecimento: 50 }, lote: 50, critica: 80 }

export default function Entrega({ id }) {
  const app = useApp()
  const d = app.doacoes.find((x) => x.id === id)
  const [feito, setFeito] = useState({})
  if (!d) return null

  const tarefas =
    d.tipo === 'lote'
      ? ['Escrever o código nas caixas', 'Deixar as caixas no local de coleta']
      : d.tipo === 'critica'
        ? ['Embalar em caixas fechadas', 'Levar o passe expresso']
        : ['Separar os itens da doação', 'Embalar em caixas ou sacolas limpas']

  async function informar() {
    const ok = await app.processo(() => {
      if (!tarefas.every((t) => feito[t])) return 'Marque as etapas de preparação antes de informar a entrega.'
      if (!d.avisosEntrega) {
        app.atualizarDoacao(d.id, { avisosEntrega: 1 })
        return { msg: 'Recebimento ainda não confirmado: a equipe do banco ainda não registrou a chegada. Aguarde alguns minutos e informe de novo.', tom: 'info' }
      }
      return null
    })
    if (!ok) return
    const pts = d.tipo === 'comum' ? PONTOS.comum[app.usuario.perfil] : PONTOS[d.tipo]
    app.atualizarDoacao(d.id, { etapa: 3, pontosLiberados: pts })
    app.creditarPontos(pts)
    const total = app.usuario.pontos + pts
    const selo = app.usuario.perfil === 'estabelecimento' && app.usuario.pontos < SELO_PONTOS && total >= SELO_PONTOS
    app.ir('acompanhamento', { id: d.id }, { limpar: true })
    app.avisar(`Doação registrada e +${pts} pontos liberados.${selo ? ' A loja conquistou o selo Parceiro Frequente!' : ''}`)
  }

  const retirada = d.modalidade === 'retirada' || d.tipo === 'lote'

  return (
    <Tela
      titulo="Entrega da doação"
      subtitulo={`Protocolo ${d.protocolo}`}
      rodape={<Botao onClick={informar}>{retirada ? 'Informar retirada realizada' : 'Informar entrega realizada'}</Botao>}
    >
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-bold">Antes de {retirada ? 'a coleta' : 'sair'}</legend>
        {tarefas.map((t) => (
          <label key={t} className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm">
            <input type="checkbox" checked={!!feito[t]} onChange={(e) => setFeito({ ...feito, [t]: e.target.checked })} className="h-5 w-5 accent-[#1E5A3C]" />
            {t}
          </label>
        ))}
      </fieldset>
      <OrientacoesEntrega d={{ ...d, endereco: app.usuario?.endereco }} banco={app.banco} />
      <p className="text-sm text-stone-600">Depois da {retirada ? 'coleta' : 'entrega'}, toque no botão abaixo. Os pontos são liberados quando a equipe confirma o recebimento.</p>
    </Tela>
  )
}
