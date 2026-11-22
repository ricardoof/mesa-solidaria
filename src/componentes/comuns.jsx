import { useRef, useState } from 'react'
import { BookOpen, Camera, Check, ChevronDown, CircleCheck, CircleX, ImagePlus, Plus, RotateCcw, Snowflake, X } from 'lucide-react'
import { DIRETRIZES, ETAPAS } from '../dados.js'
import { FOTO_EXEMPLO } from './ilustracoes.jsx'

// Diretrizes de doação e conservação (usadas nas instruções e no formulário)
export function ListaDiretrizes() {
  const grupo = (titulo, Icone, cor, itens) => (
    <section>
      <h3 className="mb-2 flex items-center gap-2 font-display font-bold">
        <Icone size={18} className={cor} aria-hidden /> {titulo}
      </h3>
      <ul className="space-y-1.5 text-sm leading-relaxed">
        {itens.map((t) => <li key={t} className="border-l-2 border-stone-200 pl-3">{t}</li>)}
      </ul>
    </section>
  )
  return (
    <div className="space-y-5">
      {grupo('Aceitos', CircleCheck, 'text-folha', DIRETRIZES.aceitos)}
      {grupo('Não aceitos', CircleX, 'text-tomate', DIRETRIZES.naoAceitos)}
      {grupo('Conservação', Snowflake, 'text-sky-700', DIRETRIZES.conservacao)}
    </div>
  )
}

export function PainelDiretrizes() {
  const [aberto, setAberto] = useState(false)
  return (
    <div className="rounded-xl border border-folha/30 bg-folha-clara">
      <button type="button" onClick={() => setAberto(!aberto)} aria-expanded={aberto} className="flex w-full items-center justify-between px-4 py-3 text-left font-bold text-folha">
        <span className="flex items-center gap-2"><BookOpen size={18} aria-hidden /> O que é aceito?</span>
        <ChevronDown size={18} className={`transition-transform ${aberto ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {aberto && (
        <div className="border-t border-folha/20 bg-white px-4 py-4">
          <ListaDiretrizes />
          <button type="button" onClick={() => setAberto(false)} className="mt-4 text-sm font-bold text-folha underline underline-offset-4">Fechar</button>
        </div>
      )}
    </div>
  )
}

// Lista editável de itens com quantidade em kg
export function ListaItens({ opcoes, itens, setItens }) {
  const proximo = useRef(100)
  const atualizar = (id, campo, valor) => setItens(itens.map((i) => (i.id === id ? { ...i, [campo]: valor } : i)))
  const classe = 'h-11 rounded-lg border border-stone-300 bg-white px-2 focus:border-folha focus:outline-none focus:ring-2 focus:ring-folha/30 disabled:bg-stone-100'
  const semOpcoes = !opcoes.length
  return (
    <div className="space-y-2">
      <div className="flex gap-2 text-xs font-bold text-stone-500" aria-hidden>
        <span className="flex-1">Item</span>
        <span className="w-20">Qtd (kg)</span>
        <span className="w-11" />
      </div>
      {itens.map((it, idx) => (
        <div key={it.id} className="flex items-center gap-2">
          <select aria-label={`Item ${idx + 1}`} disabled={semOpcoes} value={it.item} onChange={(e) => atualizar(it.id, 'item', e.target.value)} className={`${classe} min-w-0 flex-1`}>
            <option value="">{semOpcoes ? 'Escolha a categoria' : 'Escolha'}</option>
            {opcoes.map((o) => <option key={o}>{o}</option>)}
          </select>
          <input aria-label={`Quantidade em kg do item ${idx + 1}`} type="number" min="1" inputMode="numeric" value={it.qtd} onChange={(e) => atualizar(it.id, 'qtd', e.target.value)} className={`${classe} w-20`} />
          <button
            type="button"
            aria-label={`Remover item ${idx + 1}`}
            disabled={itens.length === 1}
            onClick={() => setItens(itens.filter((i) => i.id !== it.id))}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-stone-300 text-stone-500 hover:text-tomate disabled:opacity-30"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={semOpcoes}
        onClick={() => setItens([...itens, { id: proximo.current++, item: '', qtd: '' }])}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold text-folha hover:bg-folha-clara disabled:opacity-40"
      >
        <Plus size={16} aria-hidden /> Adicionar item
      </button>
    </div>
  )
}

export function LinhaStatus({ etapa }) {
  return (
    <ol aria-label="Status da doação">
      {ETAPAS.map((nome, i) => {
        const feita = i < etapa || etapa === ETAPAS.length - 1
        const atual = i === etapa && etapa < ETAPAS.length - 1
        return (
          <li key={nome} className="relative flex gap-3 pb-5 last:pb-0">
            {i < ETAPAS.length - 1 && <span className={`absolute left-[11px] top-6 h-[calc(100%-20px)] w-0.5 ${i < etapa ? 'bg-folha' : 'bg-stone-200'}`} aria-hidden />}
            <span className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${feita ? 'border-folha bg-folha text-white' : atual ? 'border-folha bg-milho' : 'border-stone-300 bg-white'}`} aria-hidden>
              {feita && <Check size={14} strokeWidth={3} />}
            </span>
            <span className={`pt-0.5 text-sm ${atual ? 'font-bold' : feita ? '' : 'text-stone-400'}`}>
              {nome}
              {atual && <span className="ml-2 rounded bg-milho/30 px-1.5 py-0.5 text-xs">agora</span>}
              <span className="sr-only">{feita ? ' (concluída)' : atual ? ' (etapa atual)' : ' (pendente)'}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function StatusEtiqueta({ etapa }) {
  const cores = ['bg-stone-200 text-tinta', 'bg-milho/30 text-tinta', 'bg-folha-clara text-folha', 'bg-folha text-white']
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cores[etapa]}`}>{ETAPAS[etapa]}</span>
}

// Foto: câmera do celular, arquivo da galeria ou foto de exemplo
export function SeletorFoto({ foto, setFoto }) {
  const entrada = useRef(null)
  const aoArquivo = (e) => {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setFoto(URL.createObjectURL(arquivo))
    e.target.value = ''
  }
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => entrada.current?.click()}
        className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed border-stone-300 bg-stone-800 text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho"
      >
        {foto ? (
          <img src={foto} alt="Foto das caixas da doação" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm"><Camera size={36} aria-hidden /> Tocar para abrir a câmera</span>
        )}
      </button>
      <input ref={entrada} type="file" accept="image/*" capture="environment" className="hidden" onChange={aoArquivo} />
      <div className="flex gap-2">
        <button type="button" onClick={() => entrada.current?.click()} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold hover:bg-stone-50">
          <ImagePlus size={16} aria-hidden /> Galeria
        </button>
        <button type="button" onClick={() => setFoto(FOTO_EXEMPLO)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold hover:bg-stone-50">
          <RotateCcw size={16} aria-hidden /> Foto de exemplo
        </button>
      </div>
    </div>
  )
}
