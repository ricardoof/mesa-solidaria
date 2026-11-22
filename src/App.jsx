import { useApp } from './estado.jsx'
import { Marca } from './componentes/ilustracoes.jsx'
import Dispositivo from './componentes/Dispositivo.jsx'
import Inicio from './telas/Inicio.jsx'
import Login from './telas/Login.jsx'
import Cadastro from './telas/Cadastro.jsx'
import ComoDoar from './telas/ComoDoar.jsx'
import NovaDoacao from './telas/NovaDoacao.jsx'
import Agendamento from './telas/Agendamento.jsx'
import Confirmacao from './telas/Confirmacao.jsx'
import Acompanhamento from './telas/Acompanhamento.jsx'
import Entrega from './telas/Entrega.jsx'
import DoacaoLote from './telas/DoacaoLote.jsx'
import DoacaoCritica from './telas/DoacaoCritica.jsx'

const TELAS = {
  inicio: Inicio,
  login: Login,
  cadastro: Cadastro,
  'como-doar': ComoDoar,
  'nova-doacao': NovaDoacao,
  agendamento: Agendamento,
  confirmacao: Confirmacao,
  acompanhamento: Acompanhamento,
  entrega: Entrega,
  'doacao-lote': DoacaoLote,
  'doacao-critica': DoacaoCritica,
}

const EQUIPE = [
  'Ellen Torres Rocha',
  'Joao Vitor de Melo Machado',
  'Raianny Letícia Ferreira de Amorim',
  'Ricardo de Oliveira Ferreira',
]

export default function App() {
  const app = useApp()
  const TelaAtual = TELAS[app.atual.tela]
  const chave = `${app.pilha.length}-${app.atual.tela}-${app.atual.params?.id ?? ''}`

  return (
    <div className="flex min-h-screen flex-col items-center gap-5 px-4 py-6">
      <header className="max-w-xl text-center">
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-stone-600" aria-label="Integrantes da equipe">
          {EQUIPE.map((nome) => <li key={nome}>{nome}</li>)}
        </ul>
        <h1 className="mt-4 flex justify-center">
          <Marca tamanho={38} />
        </h1>
      </header>
      <Dispositivo chave={chave} carregando={app.carregando}>
        <TelaAtual key={chave} {...app.atual.params} />
      </Dispositivo>
    </div>
  )
}
