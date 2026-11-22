// Estabelecimentos, Cenário 4: Fechamento do estabelecimento e retirada dos alimentos
import { useState } from 'react'
import { Clock, MapPin, Moon, Truck } from 'lucide-react'
import { FIM, Palco, useFluxo } from '../../fluxo.jsx'
import { BANCO, LOJA_TESTE, gerarCodigo } from '../../dados.js'
import { validarItens } from '../../validacoes.js'
import { Botao, Caixa, Dado, Tela } from '../../componentes/ui.jsx'
import { TelaFim } from '../../componentes/compartilhadas.jsx'
import { TelaAcompanhamento, TelaSolicitacao } from './Cenario3.jsx'

export default function Cenario4({ reiniciar }) {
  const f = useFluxo('Tela inicial')
  const [pontos, setPontos] = useState(120)
  const [itens, setItens] = useState([{ id: 1, item: '', qtd: '' }])
  const [protocolo, setProtocolo] = useState('')
  const [etapa, setEtapa] = useState(0)
  const [consultas, setConsultas] = useState(0)
  const [avisos, setAvisos] = useState(0)

  async function enviar() {
    f.acao('Informar produtos disponíveis e enviar solicitação')
    const ok = await f.processo('Registrar solicitação de doação', {
      verificar: () => validarItens(itens, 'Erro ao registrar solicitação'),
      falhaSimulada: 'Erro ao registrar solicitação: o sistema não respondeu. Envie de novo.',
    })
    if (ok) {
      setProtocolo(gerarCodigo('SOL'))
      f.ir('Acompanhamento da doação', 'p: Solicitação registrada com sucesso')
    }
  }

  async function consultar() {
    f.acao('Consultar andamento da solicitação')
    const n = consultas + 1
    setConsultas(n)
    const ok = await f.processo('Verificar status da solicitação', {
      verificar: () => {
        if (n === 1) {
          setEtapa(1)
          return 'Solicitação em análise: a equipe está organizando a retirada. Consulte de novo em instantes.'
        }
        return null
      },
    })
    if (ok) {
      setEtapa(2)
      f.ir('Entrega da doação', 'p: Apresenta orientações e informações para entrega')
    }
  }

  async function informarEntrega() {
    f.acao('Consultar orientações e informar entrega realizada')
    const n = avisos + 1
    setAvisos(n)
    const confirmado = await f.processo('Verificar confirmação de recebimento', {
      verificar: () =>
        n === 1 ? 'Recebimento ainda não confirmado: a equipe do banco ainda não registrou a chegada. Aguarde alguns minutos e informe de novo.' : null,
    })
    if (!confirmado) return
    f.resposta('Recebimento confirmado')
    const ok = await f.processo('Registrar doação e liberar pontos', {
      falhaSimulada: 'Erro ao registrar doação: os pontos não foram liberados. Informe a entrega de novo.',
      voltarPara: 'Entrega da doação',
    })
    if (ok) {
      setEtapa(3)
      setPontos((p) => p + 50)
      f.ir(FIM, 'p: Doação registrada e pontos liberados')
    }
  }

  return (
    <Palco fluxo={f}>
      {f.cena === 'Tela inicial' && (
        <Tela titulo="A loja vai fechar?" subtitulo={LOJA_TESTE.nome} rodape={<Botao onClick={() => f.ir('Solicitação de doação', 'u: Consultar orientações para doação')}>Consultar orientações para doação</Botao>}>
          <Caixa titulo="Não jogue fora o que sobrou" icone={Moon} tom="milho">
            <p>Se a loja vai fechar ou encerrar o expediente, doe os produtos que sobraram. A equipe pode buscar até as 19h.</p>
          </Caixa>
          <Caixa><Dado rotulo="Pontos da loja">{pontos}</Dado></Caixa>
        </Tela>
      )}

      {f.cena === 'Solicitação de doação' && (
        <TelaSolicitacao itens={itens} setItens={setItens} onEnviar={enviar}>
          <Caixa titulo="Orientações" tom="folha">
            <p>Liste os produtos fechados e dentro da validade. Frutas e verduras podem ir em quilos. Depois do envio, a equipe confirma a retirada.</p>
          </Caixa>
        </TelaSolicitacao>
      )}

      {f.cena === 'Acompanhamento da doação' && <TelaAcompanhamento protocolo={protocolo} etapa={etapa} pontos={pontos} onConsultar={consultar} />}

      {f.cena === 'Entrega da doação' && (
        <Tela titulo="Entrega da doação" subtitulo={`Protocolo ${protocolo}`} rodape={<Botao onClick={informarEntrega}>Informar entrega realizada</Botao>}>
          <Caixa titulo="Orientações" tom="folha">
            <p className="flex gap-2"><MapPin size={18} className="shrink-0 text-folha" aria-hidden /> Entregar em {BANCO.endereco}</p>
            <p className="flex gap-2"><Clock size={18} className="shrink-0 text-folha" aria-hidden /> Recebimento até as 19h de hoje</p>
            <p className="flex gap-2"><Truck size={18} className="shrink-0 text-folha" aria-hidden /> Sem como levar? A van do banco retira na loja entre 18h e 19h.</p>
          </Caixa>
          <p className="text-sm text-stone-600">Depois de entregar, toque no botão abaixo. Os pontos são liberados quando a equipe confirma o recebimento.</p>
        </Tela>
      )}

      {f.cena === FIM && (
        <TelaFim titulo="Doação registrada" texto={`Os produtos não foram descartados no fechamento, e a loja agora tem ${pontos} pontos.`} reiniciar={reiniciar} />
      )}
    </Palco>
  )
}
