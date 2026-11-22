// Habitantes, Cenário 3: Roberto não consegue transportar a doação
// Variante A = agendamento por calendário; B = agendamento por lista
import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Download, MapPin, Phone, Truck } from 'lucide-react'
import { FIM, Palco, useFluxo } from '../../fluxo.jsx'
import { BANCO, HORTIFRUTI, fmtDia, fmtDiaLongo, gerarCodigo, gerarHorarios } from '../../dados.js'
import { validarCadastro, validarItens } from '../../validacoes.js'
import { Botao, Caixa, Dado, Tela } from '../../componentes/ui.jsx'
import { Mapa } from '../../componentes/ilustracoes.jsx'
import { ListaItens, TelaCadastro, TelaFim } from '../../componentes/compartilhadas.jsx'

const disponivel = (h) => h.status !== 'lotado'
const mesmoDia = (a, b) => a.toDateString() === b.toDateString()

function AgendaCalendario({ horarios, escolhido, onEscolher }) {
  const primeira = horarios.find(disponivel)?.data ?? new Date()
  const [mes, setMes] = useState(new Date(primeira.getFullYear(), primeira.getMonth(), 1))
  const [dia, setDia] = useState(escolhido?.data ?? null)

  const dias = useMemo(() => {
    const inicio = new Date(mes)
    inicio.setDate(1 - inicio.getDay())
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(inicio)
      d.setDate(inicio.getDate() + i)
      return d
    })
  }, [mes])

  const temVaga = (d) => horarios.some((h) => mesmoDia(h.data, d) && disponivel(h))
  const doDia = dia ? horarios.filter((h) => mesmoDia(h.data, dia)) : []
  const mudarMes = (n) => setMes(new Date(mes.getFullYear(), mes.getMonth() + n, 1))

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-stone-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <button type="button" onClick={() => mudarMes(-1)} aria-label="Mês anterior" className="rounded p-1.5 hover:bg-stone-100"><ChevronLeft size={18} /></button>
          <p className="font-display font-bold capitalize">{mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
          <button type="button" onClick={() => mudarMes(1)} aria-label="Próximo mês" className="rounded p-1.5 hover:bg-stone-100"><ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-stone-500" aria-hidden>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((l, i) => <span key={i}>{l}</span>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {dias.map((d) => {
            const foraDoMes = d.getMonth() !== mes.getMonth()
            const vaga = temVaga(d)
            const selecionado = dia && mesmoDia(d, dia)
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={!vaga}
                onClick={() => setDia(d)}
                aria-label={fmtDiaLongo(d) + (vaga ? ', com horários' : ', sem horários')}
                aria-pressed={selecionado}
                className={`aspect-square rounded-lg text-sm transition-colors ${
                  selecionado ? 'bg-folha font-bold text-white' : vaga ? 'bg-folha-clara font-bold text-folha hover:bg-folha/20' : 'text-stone-300'
                } ${foraDoMes && !vaga ? 'invisible' : ''}`}
              >
                {d.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {dia ? (
        <div>
          <p className="mb-2 text-sm font-bold capitalize">Horários de {fmtDiaLongo(dia)}</p>
          <div className="flex flex-wrap gap-2">
            {doDia.map((h) => (
              <button
                key={h.id}
                type="button"
                disabled={!disponivel(h)}
                onClick={() => onEscolher(h)}
                aria-pressed={escolhido?.id === h.id}
                className={`rounded-lg border-2 px-3 py-2 text-sm font-bold ${
                  escolhido?.id === h.id ? 'border-folha bg-folha text-white' : disponivel(h) ? 'border-stone-200 bg-white hover:border-folha' : 'border-stone-100 bg-stone-50 text-stone-300 line-through'
                }`}
              >
                {h.hora}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-stone-500">Toque em um dia destacado para ver os horários.</p>
      )}
    </div>
  )
}

function AgendaLista({ horarios, escolhido, onEscolher }) {
  const [quantos, setQuantos] = useState(5)
  const livres = horarios.filter(disponivel)
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-bold">Próximos horários disponíveis</legend>
      {livres.slice(0, quantos).map((h) => (
        <label
          key={h.id}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-3 text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-milho ${
            escolhido?.id === h.id ? 'border-folha bg-folha-clara font-bold' : 'border-stone-200 bg-white'
          }`}
        >
          <input type="radio" name="horario" checked={escolhido?.id === h.id} onChange={() => onEscolher(h)} className="accent-[#1E5A3C]" />
          <span className="capitalize">{fmtDia(h.data)}</span>
          <span className="ml-auto">{h.hora}</span>
        </label>
      ))}
      {quantos < livres.length && (
        <Botao variante="fantasma" onClick={() => setQuantos(quantos + 5)}>Ver mais datas</Botao>
      )}
    </fieldset>
  )
}

export default function Cenario3({ variante, reiniciar }) {
  const f = useFluxo('Página inicial')
  const [usuario, setUsuario] = useState(null)
  const [itens, setItens] = useState([{ id: 1, item: '', qtd: '' }])
  const [horarios, setHorarios] = useState(gerarHorarios)
  const [escolhido, setEscolhido] = useState(null)
  const [comprovante, setComprovante] = useState(null)

  async function enviarCadastro(dados) {
    f.acao('Enviar dados cadastrais')
    const ok = await f.processo('Validar cadastro', {
      verificar: () => validarCadastro(dados, 'Dados incompletos ou inválidos'),
      falhaSimulada: 'Dados incompletos ou inválidos: o telefone informado não recebe SMS. Confira o número.',
    })
    if (ok) {
      setUsuario(dados)
      f.ir('Solicitação de doação', 'p: Cadastro concluído com sucesso')
    }
  }

  async function enviarItens() {
    f.acao('Informar frutas e verduras excedentes')
    const ok = await f.processo('Processar solicitação', {
      verificar: () => validarItens(itens, 'Erro na listagem dos itens'),
      falhaSimulada: 'Erro na listagem dos itens: não foi possível salvar a lista. Envie de novo.',
    })
    if (ok) f.ir('Agendamento da entrega', 'p: Itens aceitos e orientações exibidas')
  }

  async function confirmarAgendamento() {
    f.acao('Selecionar data e horário de entrega')
    const ok = await f.processo('Registrar agendamento', {
      verificar: () => {
        if (!escolhido) return 'Escolha um dia e um horário para continuar.'
        if (escolhido.status === 'disputado') {
          setHorarios((hs) => hs.map((h) => (h.id === escolhido.id ? { ...h, status: 'lotado' } : h)))
          setEscolhido(null)
          return 'Horário indisponível: outra pessoa acabou de reservar este horário. Escolha outro.'
        }
        return null
      },
    })
    if (ok) {
      setComprovante({ protocolo: gerarCodigo('AGD'), horario: escolhido })
      f.ir('Confirmação e comprovante de agendamento', 'p: Agendamento confirmado com sucesso')
    }
  }

  const listaItens = itens.filter((i) => i.item).map((i) => `${i.qtd} kg de ${i.item}`).join(', ')

  function baixarComprovante() {
    f.acao('Baixar comprovante')
    const texto = [
      BANCO.nome,
      'Comprovante de agendamento',
      '',
      `Protocolo: ${comprovante.protocolo}`,
      `Doador: ${usuario?.nome ?? ''}`,
      `Endereço de coleta: ${usuario?.endereco ?? ''}`,
      `Data e horário: ${fmtDiaLongo(comprovante.horario.data)}, ${comprovante.horario.hora}`,
      `Itens: ${listaItens}`,
    ].join('\n')
    const url = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `comprovante-${comprovante.protocolo}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Palco fluxo={f}>
      {f.cena === 'Página inicial' && (
        <Tela
          titulo="Endereço e horários"
          subtitulo={BANCO.nome}
          rodape={<Botao onClick={() => f.ir('Cadastro de usuário', 'u: Iniciar cadastro no sistema')}>Iniciar cadastro</Botao>}
        >
          <Mapa />
          <Caixa>
            <p className="flex gap-2"><MapPin size={18} className="shrink-0 text-folha" aria-hidden /> {BANCO.endereco}</p>
            <p className="flex gap-2"><Clock size={18} className="shrink-0 text-folha" aria-hidden /> {BANCO.horarios}</p>
            <p className="flex gap-2"><Phone size={18} className="shrink-0 text-folha" aria-hidden /> {BANCO.telefone}</p>
          </Caixa>
          <Caixa titulo="Não tem como trazer os alimentos?" icone={Truck} tom="milho">
            <p>Faça seu cadastro e agende um horário. Um voluntário com o carro do banco busca as caixas no seu endereço.</p>
          </Caixa>
        </Tela>
      )}

      {f.cena === 'Cadastro de usuário' && (
        <TelaCadastro titulo="Cadastro de usuário" rotuloEnviar="Enviar dados" comEndereco onEnviar={enviarCadastro} />
      )}

      {f.cena === 'Solicitação de doação' && (
        <Tela titulo="Solicitação de doação" subtitulo="Quais frutas e verduras sobraram?" rodape={<Botao onClick={enviarItens}>Enviar solicitação</Botao>}>
          <ListaItens opcoes={HORTIFRUTI} itens={itens} setItens={setItens} rotuloItem="Item" />
          <p className="text-xs text-stone-500">Quantidade em quilos. Pode ser aproximada.</p>
        </Tela>
      )}

      {f.cena === 'Agendamento da entrega' && (
        <Tela
          titulo="Agendamento da entrega"
          subtitulo={variante === 'A' ? 'Escolha o dia no calendário' : 'Escolha um dos próximos horários'}
          rodape={<Botao onClick={confirmarAgendamento}>{variante === 'A' ? 'Confirmar agendamento' : 'Confirmar'}</Botao>}
        >
          <Caixa titulo="Itens aceitos" tom="folha">
            <p>{listaItens}</p>
            <p className="text-stone-600">Deixe tudo em caixas ventiladas, separando os itens mais maduros. A coleta leva cerca de 10 minutos.</p>
          </Caixa>
          {variante === 'A' ? (
            <AgendaCalendario horarios={horarios} escolhido={escolhido} onEscolher={setEscolhido} />
          ) : (
            <AgendaLista horarios={horarios} escolhido={escolhido} onEscolher={setEscolhido} />
          )}
        </Tela>
      )}

      {f.cena === 'Confirmação e comprovante de agendamento' && comprovante && (
        <Tela
          titulo="Coleta agendada"
          subtitulo="Guarde o comprovante."
          rodape={
            <>
              <Botao variante="secundario" icone={Download} onClick={baixarComprovante}>Baixar comprovante</Botao>
              <Botao onClick={() => f.ir(FIM, 'u: Concluir')}>Concluir</Botao>
            </>
          }
        >
          <Caixa>
            <dl>
              <Dado rotulo="Data"><span className="capitalize">{fmtDiaLongo(comprovante.horario.data)}</span></Dado>
              <Dado rotulo="Horário">{comprovante.horario.hora}</Dado>
              <Dado rotulo="Endereço">{usuario?.endereco}</Dado>
              <Dado rotulo="Itens">{listaItens}</Dado>
              <Dado rotulo="Protocolo">{comprovante.protocolo}</Dado>
            </dl>
          </Caixa>
        </Tela>
      )}

      {f.cena === FIM && (
        <TelaFim titulo="Coleta agendada" texto="Roberto não precisa transportar nada: a equipe busca os alimentos no horário escolhido." reiniciar={reiniciar} />
      )}
    </Palco>
  )
}
