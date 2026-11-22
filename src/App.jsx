import { useState } from 'react'
import { RotateCcw, Store, UsersRound } from 'lucide-react'
import { CENARIOS } from './cenarios/index.js'
import { useSim } from './simulador.jsx'
import { Interruptor } from './componentes/ui.jsx'
import { Marca } from './componentes/ilustracoes.jsx'
import Dispositivo from './componentes/Dispositivo.jsx'
import PainelMolic from './componentes/PainelMolic.jsx'

const PERFIS = [
  { id: 'habitante', rotulo: 'Habitantes', icone: UsersRound },
  { id: 'estabelecimento', rotulo: 'Estabelecimentos', icone: Store },
]

const EQUIPE = [
  'Ellen Torres Rocha',
  'Joao Vitor de Melo Machado',
  'Raianny Letícia Ferreira de Amorim',
  'Ricardo de Oliveira Ferreira',
]

export default function App() {
  const sim = useSim()
  const [cenarioId, setCenarioId] = useState(CENARIOS[0].id)
  const [variantes, setVariantes] = useState({})
  const [rodada, setRodada] = useState(0)

  const cenario = CENARIOS.find((c) => c.id === cenarioId)
  const perfil = cenario.perfil
  const varianteId = variantes[cenarioId] ?? cenario.variantes?.[0].id
  const variante = cenario.variantes?.find((v) => v.id === varianteId)
  const tipoDispositivo = variante?.dispositivo ?? 'celular'
  const Componente = cenario.componente

  // Toda troca de cenário/alternativa recomeça o diálogo do zero.
  const recomecar = () => {
    sim.limparRegistro()
    setRodada((r) => r + 1)
  }
  const escolherCenario = (id) => {
    setCenarioId(id)
    recomecar()
  }
  const escolherPerfil = (p) => escolherCenario(CENARIOS.find((c) => c.perfil === p).id)
  const escolherVariante = (v) => {
    setVariantes((s) => ({ ...s, [cenarioId]: v }))
    recomecar()
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-6 p-4 lg:grid-cols-[300px_minmax(0,1fr)_290px] lg:p-6">
      {/* Painel de controle do simulador */}
      <aside className="space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
        <div>
          <Marca tamanho={34} />
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Protótipo navegável do sistema de doação de alimentos. Escolha um cenário e use as telas como o usuário usaria.
          </p>
        </div>

        <div role="tablist" aria-label="Perfil de usuário" className="grid grid-cols-2 gap-1 rounded-xl bg-stone-200/70 p-1">
          {PERFIS.map(({ id, rotulo, icone: Icone }) => (
            <button
              key={id}
              role="tab"
              aria-selected={perfil === id}
              onClick={() => escolherPerfil(id)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho ${
                perfil === id ? 'bg-white text-folha shadow-sm' : 'text-stone-600 hover:text-tinta'
              }`}
            >
              <Icone size={16} aria-hidden /> {rotulo}
            </button>
          ))}
        </div>

        <nav aria-label="Cenários">
          <ul className="space-y-1">
            {CENARIOS.filter((c) => c.perfil === perfil).map((c) => {
              const ativo = c.id === cenarioId
              return (
                <li key={c.id}>
                  <button
                    onClick={() => escolherCenario(c.id)}
                    aria-current={ativo ? 'true' : undefined}
                    className={`flex w-full gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho ${
                      ativo ? 'bg-folha text-white' : 'hover:bg-white'
                    }`}
                  >
                    <span className={`font-display text-lg font-extrabold leading-none ${ativo ? 'text-milho' : 'text-stone-400'}`}>{c.numero}</span>
                    <span className="leading-snug">{c.titulo}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {cenario.variantes && (
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-bold">Alternativa de design</legend>
            <div className="flex flex-wrap gap-1 rounded-xl bg-stone-200/70 p-1">
              {cenario.variantes.map((v) => (
                <button
                  key={v.id}
                  aria-pressed={v.id === varianteId}
                  onClick={() => escolherVariante(v.id)}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho ${
                    v.id === varianteId ? 'bg-white text-folha shadow-sm' : 'text-stone-600 hover:text-tinta'
                  }`}
                >
                  {v.rotulo}
                </button>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-stone-600">{variante.descricao}</p>
          </fieldset>
        )}

        <div className="space-y-4 rounded-xl border border-stone-300 bg-white p-4">
          <Interruptor
            rotulo="Usuário já autenticado"
            detalhe={cenario.usaLogin ? 'Muda o caminho no processo “Autenticado ou não?”.' : 'Usado nos cenários com login.'}
            ligado={sim.autenticado}
            onChange={sim.setAutenticado}
          />
          <Interruptor
            rotulo="Simular falhas do sistema"
            detalhe="A primeira tentativa de cada processo falha, para mostrar as rupturas do MoLIC."
            ligado={sim.simularFalhas}
            onChange={sim.setSimularFalhas}
          />
        </div>

        <button
          onClick={recomecar}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-stone-300 px-4 py-2.5 text-sm font-bold hover:border-folha hover:text-folha focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho"
        >
          <RotateCcw size={16} aria-hidden /> Reiniciar cenário
        </button>

        <footer className="border-t border-stone-300 pt-4 text-xs leading-relaxed text-stone-500">
          <p className="font-bold text-stone-600">Projeto de IHC</p>
          <p>{EQUIPE.join(', ')}.</p>
        </footer>
      </aside>

      {/* Protótipo */}
      <main className="flex min-w-0 flex-col items-center gap-4">
        <div className="max-w-xl text-center">
          <p className="text-sm text-stone-500">
            {perfil === 'habitante' ? 'Habitantes' : 'Estabelecimentos'}, cenário {cenario.numero}
            {variante ? `, ${variante.rotulo}` : ''}
          </p>
          <h1 className="text-2xl font-extrabold leading-tight text-tinta md:text-3xl">{cenario.titulo}</h1>
        </div>
        <Dispositivo tipo={tipoDispositivo}>
          <Componente key={`${cenarioId}-${varianteId}-${rodada}`} variante={varianteId} reiniciar={recomecar} />
        </Dispositivo>
      </main>

      <PainelMolic registro={sim.registro} />
    </div>
  )
}
