import { useEffect, useId, useRef } from 'react'
import { AlertTriangle, ArrowLeft, X } from 'lucide-react'
import { usePalco } from '../fluxo.jsx'
import { Marca } from './ilustracoes.jsx'

// Estrutura padrão de uma cena: cabeçalho, aviso de erro, conteúdo e rodapé com ações.
export function Tela({ titulo, subtitulo, voltar, children, rodape }) {
  const { erro, fecharErro } = usePalco()
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.closest('[data-rolagem]')?.scrollTo({ top: 0 })
  }, [titulo])

  return (
    <div ref={ref} className="flex min-h-full flex-1 flex-col">
      <header className="bg-folha px-5 pb-5 pt-10 text-white">
        <div className="mb-3 flex items-center justify-between">
          <Marca claro tamanho={22} />
        </div>
        {voltar && (
          <button
            type="button"
            onClick={voltar.acao}
            className="-ml-1 mb-2 inline-flex items-center gap-1 rounded px-1 text-sm text-white/85 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho"
          >
            <ArrowLeft size={16} aria-hidden /> {voltar.rotulo}
          </button>
        )}
        <h1 className="text-[1.45rem] font-bold leading-tight">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-white/80">{subtitulo}</p>}
      </header>

      {erro && (
        <div
          role="alert"
          className="mx-4 mt-4 flex gap-3 rounded-lg border border-tomate/30 border-l-4 border-l-tomate bg-tomate/[0.07] p-3 text-sm text-tinta"
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-tomate" aria-hidden />
          <p className="flex-1">{erro}</p>
          <button type="button" onClick={fecharErro} aria-label="Fechar aviso" className="self-start text-stone-500 hover:text-tinta">
            <X size={16} />
          </button>
        </div>
      )}

      <main className="flex-1 space-y-5 px-5 py-5">{children}</main>

      {rodape && (
        <footer className="sticky bottom-0 z-10 space-y-2 border-t border-stone-200 bg-white/95 px-5 py-4 backdrop-blur">
          {rodape}
        </footer>
      )}
    </div>
  )
}

const ESTILOS_BOTAO = {
  primario: 'bg-folha text-white hover:bg-folha-escura',
  secundario: 'border-2 border-folha bg-white text-folha hover:bg-folha-clara',
  destaque: 'bg-milho text-tinta hover:brightness-95',
  fantasma: 'text-folha hover:bg-folha-clara',
  perigo: 'bg-tomate text-white hover:brightness-95',
}

export function Botao({ variante = 'primario', icone: Icone, className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-base font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-milho disabled:cursor-not-allowed disabled:opacity-50 ${ESTILOS_BOTAO[variante]} ${className}`}
      {...props}
    >
      {Icone && <Icone size={19} aria-hidden />}
      {children}
    </button>
  )
}

const CLASSE_CAMPO =
  'w-full rounded-lg border border-stone-300 bg-white px-3 text-base text-tinta placeholder:text-stone-400 focus:border-folha focus:outline-none focus:ring-2 focus:ring-folha/30'

export function Campo({ rotulo, dica, ...props }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold">{rotulo}</label>
      <input id={id} className={`${CLASSE_CAMPO} h-11`} {...props} />
      {dica && <p className="mt-1 text-xs text-stone-500">{dica}</p>}
    </div>
  )
}

export function AreaTexto({ rotulo, ...props }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold">{rotulo}</label>
      <textarea id={id} rows={3} className={`${CLASSE_CAMPO} py-2`} {...props} />
    </div>
  )
}

export function Selecao({ rotulo, opcoes, placeholder = 'Selecione', ...props }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold">{rotulo}</label>
      <select id={id} className={`${CLASSE_CAMPO} h-11`} {...props}>
        <option value="">{placeholder}</option>
        {opcoes.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

// Grupo de botões de opção (radio) com visual de cartão.
export function GrupoOpcoes({ rotulo, opcoes, valor, onChange, colunas = 2 }) {
  const nome = useId()
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold">{rotulo}</legend>
      <div className={`grid gap-2 ${colunas === 3 ? 'grid-cols-3' : colunas === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {opcoes.map((o) => {
          const op = typeof o === 'string' ? { valor: o, rotulo: o } : o
          const marcado = valor === op.valor
          return (
            <label
              key={op.valor}
              className={`flex cursor-pointer items-start gap-2 rounded-lg border-2 px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-milho ${
                marcado ? 'border-folha bg-folha-clara font-bold' : 'border-stone-200 bg-white hover:border-stone-300'
              } ${op.desabilitado ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <input
                type="radio"
                name={nome}
                value={op.valor}
                checked={marcado}
                disabled={op.desabilitado}
                onChange={() => onChange(op.valor)}
                className="mt-0.5 accent-[#1E5A3C]"
              />
              <span>
                {op.rotulo}
                {op.detalhe && <span className="block text-xs font-normal text-stone-500">{op.detalhe}</span>}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Caixa({ titulo, icone: Icone, tom = 'neutro', children }) {
  const tons = {
    neutro: 'bg-white border-stone-200',
    folha: 'bg-folha-clara border-folha/20',
    milho: 'bg-milho/15 border-milho/50',
  }
  return (
    <section className={`rounded-xl border p-4 ${tons[tom]}`}>
      {titulo && (
        <h2 className="mb-2 flex items-center gap-2 font-display text-base font-bold">
          {Icone && <Icone size={18} className="text-folha" aria-hidden />}
          {titulo}
        </h2>
      )}
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

export function Dado({ rotulo, children }) {
  return (
    <div className="flex justify-between gap-4 border-b border-stone-100 py-2 last:border-0">
      <dt className="text-stone-500">{rotulo}</dt>
      <dd className="text-right font-bold">{children}</dd>
    </div>
  )
}

export function Interruptor({ rotulo, detalhe, ligado, onChange }) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-3">
      <label htmlFor={id} className="cursor-pointer text-sm">
        <span className="font-bold">{rotulo}</span>
        {detalhe && <span className="block text-xs text-stone-500">{detalhe}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={ligado}
        onClick={() => onChange(!ligado)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-milho ${ligado ? 'bg-folha' : 'bg-stone-300'}`}
      >
        <span className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${ligado ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}
