// Estabelecimentos, Cenário 2: Dificuldade para encontrar quem receba a doação
// I1 = validação imediata e garantia de recepção
// I2A / I2B = alerta de urgência com formulário ou com cartões
import { useRef, useState } from 'react'
import { Apple, Beef, Carrot, Clock, MapPin, Milk, Siren, UserRound, Warehouse } from 'lucide-react'
import { FIM, Palco, useFluxo } from '../../fluxo.jsx'
import { useSim } from '../../simulador.jsx'
import { BANCO, fmtHora, gerarCodigo } from '../../dados.js'
import { AreaTexto, Botao, Caixa, Campo, Dado, GrupoOpcoes, Selecao, Tela } from '../../componentes/ui.jsx'
import { Mapa, QrIlustrativo } from '../../componentes/ilustracoes.jsx'
import { TelaFim } from '../../componentes/compartilhadas.jsx'

const CAPACIDADE_TOTAL = 300

function ValidacaoImediata({ reiniciar }) {
  const f = useFluxo('Painel principal')
  const { simularFalhas } = useSim()
  const [categorias, setCategorias] = useState(['Hortifrúti', 'Grãos', 'Laticínios'])
  const [ocupado, setOcupado] = useState(180)
  const [categoria, setCategoria] = useState('')
  const [volume, setVolume] = useState('')
  const jaRemoveu = useRef(false)
  const livre = CAPACIDADE_TOTAL - ocupado
  const pct = Math.round((ocupado / CAPACIDADE_TOTAL) * 100)

  function iniciar(cat) {
    setCategoria(cat)
    f.ir('Confirmação de categoria e estimativa de volume', `u: Iniciar doação de ${cat}`)
  }

  async function confirmar() {
    f.acao('Confirma categoria e volume')
    const kg = Number(volume)
    const ok = await f.processo('Validar e reservar espaço de doação', {
      verificar: () => {
        if (!(kg > 0)) return 'Informe o volume estimado em quilos.'
        if (simularFalhas && !jaRemoveu.current) {
          jaRemoveu.current = true
          setCategorias((c) => c.filter((x) => x !== categoria))
          return {
            msg: `Categoria deixou de ser aceita: o estoque de ${categoria} lotou há instantes. O painel foi atualizado com as categorias aceitas agora.`,
            voltarPara: 'Painel principal',
          }
        }
        if (kg > livre) return `Volume acima da capacidade disponível: restam ${livre} kg hoje. Reduza a estimativa ou divida em duas entregas.`
        return null
      },
    })
    if (ok) {
      setOcupado((o) => o + kg)
      f.ir('Dados de entrega', 'p: Espaço reservado')
    }
  }

  const ate = new Date(Date.now() + 3 * 3600000)

  return (
    <Palco fluxo={f}>
      {f.cena === 'Painel principal' && (
        <Tela titulo="Status do banco hoje" subtitulo={BANCO.nome}>
          <Caixa titulo="Capacidade de recebimento" icone={Warehouse}>
            <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Capacidade ocupada">
              <div className="h-full rounded-full bg-folha" style={{ width: `${pct}%` }} />
            </div>
            <p><strong>{pct}% ocupado.</strong> Cabem mais {livre} kg hoje.</p>
          </Caixa>
          <Caixa titulo="Categorias aceitas hoje">
            {categorias.length ? (
              <div className="flex flex-wrap gap-2">
                {categorias.map((c) => (
                  <span key={c} className="rounded-full bg-folha-clara px-3 py-1 text-sm font-bold text-folha">{c}</span>
                ))}
              </div>
            ) : (
              <p>Nenhuma categoria aberta agora.</p>
            )}
          </Caixa>
          <div className="space-y-2">
            {categorias.map((c, i) => (
              <Botao key={c} variante={i === 0 ? 'primario' : 'secundario'} onClick={() => iniciar(c)}>
                Iniciar doação de {c}
              </Botao>
            ))}
          </div>
        </Tela>
      )}

      {f.cena === 'Confirmação de categoria e estimativa de volume' && (
        <Tela
          titulo="Confirme a categoria e o volume"
          voltar={{ rotulo: 'Painel', acao: () => f.ir('Painel principal', 'u: Voltar ao painel') }}
          rodape={<Botao onClick={confirmar}>Confirmar categoria e volume</Botao>}
        >
          <Caixa tom="folha"><Dado rotulo="Categoria">{categoria}</Dado></Caixa>
          <Campo rotulo="Volume estimado (kg)" type="number" min="1" inputMode="numeric" value={volume} onChange={(e) => setVolume(e.target.value)} dica={`Disponível agora: ${livre} kg.`} />
        </Tela>
      )}

      {f.cena === 'Dados de entrega' && (
        <Tela titulo="Espaço reservado" subtitulo={`${volume} kg de ${categoria}`} rodape={<Botao onClick={() => f.ir(FIM, 'u: Concluir')}>Concluir</Botao>}>
          <Mapa />
          <Caixa>
            <p className="flex gap-2"><MapPin size={18} className="shrink-0 text-folha" aria-hidden />{BANCO.endereco}, doca 1</p>
            <p className="flex gap-2"><UserRound size={18} className="shrink-0 text-folha" aria-hidden />Triagem: Marta Silva, (31) 98765-4321</p>
            <p className="flex gap-2"><Clock size={18} className="shrink-0 text-folha" aria-hidden />Reserva válida até {fmtHora(ate)}</p>
          </Caixa>
        </Tela>
      )}

      {f.cena === FIM && <TelaFim titulo="Recepção garantida" texto="A loja só sai para entregar quando há espaço reservado e alguém esperando." reiniciar={reiniciar} />}
    </Palco>
  )
}

const CARTOES = [
  { valor: 'Frutas', icone: Apple },
  { valor: 'Verduras', icone: Carrot },
  { valor: 'Laticínios', icone: Milk },
  { valor: 'Carnes', icone: Beef },
]
const NIVEIS = ['Baixa', 'Moderada', 'Alta', 'Crítica', 'Muito crítica']

function Urgencia({ variante, reiniciar }) {
  const f = useFluxo('Solicitar doação crítica')
  const [d, setD] = useState({ categoria: '', urgencia: variante === 'I2B' ? 3 : '', descricao: '' })
  const [passe, setPasse] = useState(null)

  async function solicitar() {
    f.acao('Informar categoria e nível de urgência dos perecíveis')
    const ok = await f.processo('Avaliar urgência e elegibilidade do perfil', {
      verificar: () => {
        if (!d.categoria || d.urgencia === '') return 'Dados incompletos: escolha a categoria e o nível de urgência.'
        if (variante === 'I2A' && !d.descricao.trim()) return 'Dados incompletos: descreva a quantidade dos perecíveis.'
        if (variante === 'I2B' && d.urgencia < 2)
          return 'Perfil não qualificado para envio expresso: urgência baixa ou moderada segue a doação comum, com agendamento.'
        return null
      },
      falhaSimulada: 'Perfil não qualificado para envio expresso: o cadastro da loja precisa de validação. A gestão foi avisada; tente de novo.',
    })
    if (ok) {
      setPasse({ codigo: gerarCodigo('PX'), ate: new Date(Date.now() + 2 * 3600000) })
      f.ir('Emissão do passe expresso e orientações de entrega', 'p: Aprovado automaticamente e notificação enviada à gestão')
    }
  }

  const nivelTexto = variante === 'I2B' ? NIVEIS[d.urgencia] : d.urgencia

  return (
    <Palco fluxo={f}>
      {f.cena === 'Solicitar doação crítica' && (
        <Tela titulo="Solicitar doação crítica" subtitulo="Para perecíveis que estragam em poucas horas." rodape={<Botao variante="perigo" icone={Siren} onClick={solicitar}>{variante === 'I2A' ? 'Solicitar envio expresso' : 'Solicitar'}</Botao>}>
          {variante === 'I2A' ? (
            <>
              <Selecao rotulo="Categoria dos perecíveis" opcoes={CARTOES.map((c) => c.valor)} value={d.categoria} onChange={(e) => setD({ ...d, categoria: e.target.value })} />
              <GrupoOpcoes rotulo="Nível de urgência" colunas={3} valor={d.urgencia} onChange={(v) => setD({ ...d, urgencia: v })} opcoes={['Alta', 'Crítica', 'Muito crítica']} />
              <AreaTexto rotulo="Descrição e quantidade" placeholder="Ex.: 40 kg de alface, colhida ontem" value={d.descricao} onChange={(e) => setD({ ...d, descricao: e.target.value })} />
            </>
          ) : (
            <>
              <fieldset>
                <legend className="mb-2 text-sm font-bold">1. Toque na categoria</legend>
                <div className="grid grid-cols-2 gap-2">
                  {CARTOES.map(({ valor, icone: Icone }) => (
                    <button
                      key={valor}
                      type="button"
                      aria-pressed={d.categoria === valor}
                      onClick={() => setD({ ...d, categoria: valor })}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 py-4 font-bold transition-colors ${d.categoria === valor ? 'border-tomate bg-tomate/10 text-tomate' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                    >
                      <Icone size={28} aria-hidden /> {valor}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="urgencia" className="mb-2 block text-sm font-bold">2. Urgência: <span className="text-tomate">{NIVEIS[d.urgencia]}</span></label>
                <input id="urgencia" type="range" min="0" max="4" step="1" value={d.urgencia} onChange={(e) => setD({ ...d, urgencia: Number(e.target.value) })} className="w-full accent-[#B83A24]" aria-valuetext={NIVEIS[d.urgencia]} />
                <div className="flex justify-between text-xs text-stone-500" aria-hidden><span>Baixa</span><span>Muito crítica</span></div>
              </div>
            </>
          )}
        </Tela>
      )}

      {f.cena === 'Emissão do passe expresso e orientações de entrega' && passe && (
        <Tela titulo="Passe expresso" subtitulo={`${d.categoria}, urgência ${String(nivelTexto).toLowerCase()}`} rodape={<Botao onClick={() => f.ir(FIM, 'u: Confirmar despacho e instruções')}>Confirmar despacho</Botao>}>
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-5">
            <QrIlustrativo codigo={passe.codigo} />
            <p className="font-display text-2xl font-extrabold tracking-wider">{passe.codigo}</p>
            <p className="text-xs text-stone-500">Mostre na entrada da doca</p>
          </div>
          <Caixa titulo="Orientações de entrega" tom="milho">
            <dl>
              <Dado rotulo="Local">Doca 2, entrada lateral</Dado>
              <Dado rotulo="Chegar até">{fmtHora(passe.ate)}</Dado>
              <Dado rotulo="Levar">Caixas fechadas e nota de doação</Dado>
            </dl>
          </Caixa>
        </Tela>
      )}

      {f.cena === FIM && <TelaFim titulo="Despacho confirmado" texto="A gestão do banco já foi avisada e a equipe da doca espera a carga." reiniciar={reiniciar} />}
    </Palco>
  )
}

export default function Cenario2({ variante, reiniciar }) {
  return variante === 'I1' ? <ValidacaoImediata reiniciar={reiniciar} /> : <Urgencia variante={variante} reiniciar={reiniciar} />
}
