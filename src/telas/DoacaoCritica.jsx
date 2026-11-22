// Doação urgente com envio expresso (alternativa escolhida: cartões e controle deslizante)
import { useState } from 'react'
import { Carrot, Croissant, Milk, Siren } from 'lucide-react'
import { useApp } from '../estado.jsx'
import { Botao, Campo, Tela } from '../componentes/ui.jsx'

const CARTOES = [
  { valor: 'Hortifrúti', icone: Carrot },
  { valor: 'Laticínios', icone: Milk },
  { valor: 'Pães e massas', icone: Croissant },
]
const NIVEIS = ['Baixa', 'Moderada', 'Alta', 'Crítica', 'Muito crítica']

export default function DoacaoCritica() {
  const app = useApp()
  const [categoria, setCategoria] = useState('')
  const [urgencia, setUrgencia] = useState(3)
  const [kg, setKg] = useState('')

  async function solicitar() {
    const ok = await app.processo(() => {
      if (!categoria || !(Number(kg) > 0)) return 'Dados incompletos: escolha a categoria e informe a quantidade aproximada.'
      if (urgencia < 2) return 'Perfil não qualificado para envio expresso: urgência baixa ou moderada segue a doação comum. Use Fazer doação no início.'
      return null
    })
    if (!ok) return
    const id = app.registrarDoacao({
      tipo: 'critica',
      categoria,
      itens: [],
      totalKg: Number(kg),
      modalidade: 'entrega',
      urgencia: NIVEIS[urgencia],
      prazo: new Date(Date.now() + 2 * 3600000),
      etapa: 2,
    })
    app.ir('confirmacao', { id }, { limpar: true })
  }

  return (
    <Tela
      titulo="Doação urgente"
      subtitulo="Para perecíveis que estragam nas próximas horas."
      rodape={<Botao variante="perigo" icone={Siren} onClick={solicitar}>Solicitar envio expresso</Botao>}
    >
      <fieldset>
        <legend className="mb-2 text-sm font-bold">1. Toque na categoria</legend>
        <div className="grid grid-cols-3 gap-2">
          {CARTOES.map(({ valor, icone: Icone }) => (
            <button
              key={valor}
              type="button"
              aria-pressed={categoria === valor}
              onClick={() => setCategoria(valor)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-1 py-4 text-sm font-bold transition-colors ${categoria === valor ? 'border-tomate bg-tomate/10 text-tomate' : 'border-stone-200 bg-white hover:border-stone-300'}`}
            >
              <Icone size={28} aria-hidden /> {valor}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="urgencia" className="mb-2 block text-sm font-bold">
          2. Urgência: <span className="text-tomate">{NIVEIS[urgencia]}</span>
        </label>
        <input id="urgencia" type="range" min="0" max="4" step="1" value={urgencia} onChange={(e) => setUrgencia(Number(e.target.value))} className="w-full accent-[#B83A24]" aria-valuetext={NIVEIS[urgencia]} />
        <div className="flex justify-between text-xs text-stone-500" aria-hidden><span>Baixa</span><span>Muito crítica</span></div>
      </div>
      <Campo rotulo="3. Quantidade aproximada (kg)" type="number" min="1" inputMode="numeric" value={kg} onChange={(e) => setKg(e.target.value)} />
    </Tela>
  )
}
