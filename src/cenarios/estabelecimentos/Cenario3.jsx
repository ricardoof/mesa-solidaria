// Estabelecimentos, Cenário 3: Doação pontual que não se torna rotina
import { useState } from 'react'
import { MapPin, Trophy } from 'lucide-react'
import { FIM, Palco, useFluxo } from '../../fluxo.jsx'
import { BANCO, LOJA_TESTE, PRODUTOS_LOJA, gerarCodigo } from '../../dados.js'
import { validarItens } from '../../validacoes.js'
import { Botao, Caixa, Dado, Tela } from '../../componentes/ui.jsx'
import { LinhaStatus, ListaItens, TelaFim } from '../../componentes/compartilhadas.jsx'

const PONTOS_POR_DOACAO = 50

export function TelaSolicitacao({ itens, setItens, onEnviar, children }) {
  return (
    <Tela titulo="Solicitação de doação" subtitulo="O que a loja tem para doar hoje?" rodape={<Botao onClick={onEnviar}>Enviar solicitação</Botao>}>
      {children}
      <ListaItens opcoes={PRODUTOS_LOJA} itens={itens} setItens={setItens} rotuloItem="Produto" rotuloAdicionar="Adicionar produto" />
    </Tela>
  )
}

export function TelaAcompanhamento({ protocolo, etapa, pontos, onConsultar }) {
  return (
    <Tela titulo="Acompanhamento da doação" subtitulo={`Protocolo ${protocolo}`} rodape={<Botao onClick={onConsultar}>Consultar andamento</Botao>}>
      <Caixa><LinhaStatus etapa={etapa} /></Caixa>
      <Caixa><Dado rotulo="Pontos da loja">{pontos}</Dado></Caixa>
    </Tela>
  )
}

export default function Cenario3({ reiniciar }) {
  const f = useFluxo('Tela inicial')
  const [pontos, setPontos] = useState(350)
  const [itens, setItens] = useState([{ id: 1, item: '', qtd: '' }])
  const [protocolo, setProtocolo] = useState('')
  const [etapa, setEtapa] = useState(0)
  const [consultas, setConsultas] = useState(0)
  const [prep, setPrep] = useState({ separar: false, embalar: false })

  async function enviar() {
    f.acao('Informar produtos disponíveis e enviar solicitação')
    const ok = await f.processo('Registrar solicitação', {
      verificar: () => validarItens(itens, 'Erro ao registrar solicitação'),
      falhaSimulada: 'Erro ao registrar solicitação: o sistema não respondeu. Envie de novo.',
    })
    if (ok) {
      setProtocolo(gerarCodigo('SOL'))
      f.ir('Acompanhamento da doação', 'p: Solicitação registrada')
    }
  }

  async function consultar() {
    f.acao('Consultar andamento')
    const n = consultas + 1
    setConsultas(n)
    const ok = await f.processo('Verificar status da solicitação', {
      verificar: () => {
        if (n === 1) {
          setEtapa(1)
          return 'Solicitação em análise: a equipe está conferindo os produtos. Consulte de novo em instantes.'
        }
        return null
      },
    })
    if (ok) {
      setEtapa(2)
      f.ir('Preparação, entrega e confirmação dos alimentos', 'p: Solicitação aprovada e orientações disponíveis')
    }
  }

  async function entregar() {
    f.acao('Preparar e entregar os alimentos presencialmente; aguardar confirmação da equipe')
    const ok = await f.processo('Registrar recebimento da doação e liberar pontos', {
      verificar: () =>
        prep.separar && prep.embalar ? null : 'Recebimento ainda não confirmado: marque a separação e a embalagem antes de entregar.',
      falhaSimulada: 'Erro no registro: a confirmação da equipe não chegou. Tente de novo.',
    })
    if (ok) {
      setEtapa(3)
      setPontos((p) => p + PONTOS_POR_DOACAO)
      f.ir(FIM, 'p: Doação registrada e pontos liberados')
    }
  }

  const marcar = (campo) => (e) => setPrep({ ...prep, [campo]: e.target.checked })

  return (
    <Palco fluxo={f}>
      {f.cena === 'Tela inicial' && (
        <Tela titulo="Painel da loja" subtitulo={LOJA_TESTE.nome} rodape={<Botao onClick={() => f.ir('Solicitação de doação', 'u: Iniciar solicitação de doação')}>Iniciar solicitação de doação</Botao>}>
          <Caixa titulo="Pontos acumulados" icone={Trophy} tom="milho">
            <p className="font-display text-4xl font-extrabold">{pontos}</p>
            <p>Faltam {400 - pontos} pontos para o selo Parceiro Frequente.</p>
          </Caixa>
        </Tela>
      )}

      {f.cena === 'Solicitação de doação' && <TelaSolicitacao itens={itens} setItens={setItens} onEnviar={enviar} />}

      {f.cena === 'Acompanhamento da doação' && <TelaAcompanhamento protocolo={protocolo} etapa={etapa} pontos={pontos} onConsultar={consultar} />}

      {f.cena === 'Preparação, entrega e confirmação dos alimentos' && (
        <Tela titulo="Preparação e entrega" subtitulo="Solicitação aprovada" rodape={<Botao onClick={entregar}>Entreguei, aguardar confirmação</Botao>}>
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-bold">Antes de sair</legend>
            {[['separar', 'Separar os produtos da lista'], ['embalar', 'Embalar em caixas identificadas']].map(([k, t]) => (
              <label key={k} className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm">
                <input type="checkbox" checked={prep[k]} onChange={marcar(k)} className="h-5 w-5 accent-[#1E5A3C]" /> {t}
              </label>
            ))}
          </fieldset>
          <Caixa titulo="Local e horário" icone={MapPin} tom="folha">
            <p>{BANCO.endereco}. Hoje até as 17h.</p>
            <p>Entregue pessoalmente e aguarde a equipe confirmar o recebimento no app.</p>
          </Caixa>
        </Tela>
      )}

      {f.cena === FIM && (
        <TelaFim titulo={`+${PONTOS_POR_DOACAO} pontos`} texto={`A loja agora tem ${pontos} pontos e conquistou o selo Parceiro Frequente.`} reiniciar={reiniciar}>
          <p className="max-w-xs rounded-xl bg-white/10 px-4 py-3 text-sm">Que tal repetir toda semana? Doações recorrentes rendem pontos em dobro.</p>
        </TelaFim>
      )}
    </Palco>
  )
}
