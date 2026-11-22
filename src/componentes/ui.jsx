import { useId } from 'react'
import { AlertTriangle, ArrowLeft, CircleCheck, Info, X } from 'lucide-react'
import { useApp } from '../estado.jsx'
import { Marca } from './ilustracoes.jsx'

// Aviso de sucesso e mensagens do sistema (erro ou informação)
export function Mensagens() {
  const { erro, setErro, aviso, setAviso } = useApp()
  const tons = {
    erro: { classe: 'border-tomate/30 border-l-tomate bg-tomate/[0.07]', Icone: AlertTriangle, cor: 'text-tomate' },
    info: { classe: 'border-milho/50 border-l-milho bg-milho/15', Icone: Info, cor: 'text-terra' },
    sucesso: { classe: 'border-folha/30 border-l-folha bg-folha-clara', Icone: CircleCheck, cor: 'text-folha' },
  }
  const caixa = (msg, tom, fechar, papel) => {
    const { classe, Icone, cor } = tons[tom]
    return (
      <div role={papel} className={`mx-4 mt-4 flex gap-3 rounded-lg border border-l-4 p-3 text-sm text-tinta ${classe}`}>
        <Icone size={18} className={`mt-0.5 shrink-0 ${cor}`} aria-hidden />
        <p className="flex-1">{msg}</p>
        <button type="button" onClick={fechar} aria-label="Fechar mensagem" className="self-start text-stone-500 hover:text-tinta">
          <X size={16} />
        </button>
      </div>
    )
  }
  return (
    <>
      {aviso && caixa(aviso, 'sucesso', () => setAviso(null), 'status')}
      {erro && caixa(erro.msg, erro.tom ?? 'erro', () => setErro(null), 'alert')}
    </>
  )
}

// Estrutura padrão das telas: cabeçalho com voltar, mensagens, conteúdo e rodapé de ações.
export function Tela({ titulo, subtitulo, voltar = true, children, rodape }) {
  const app = useApp()
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-folha px-5 pb-5 pt-10 text-white">
        <div className="mb-3 flex min-h-7 items-center justify-between">
          {voltar ? (
            <button
              type="button"
              onClick={app.voltar}
              className="-ml-1 inline-flex items-center gap-1 rounded px-1 py-0.5 text-sm text-white/85 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho"
            >
              <ArrowLeft size={16} aria-hidden /> Voltar
            </button>
          ) : (
            <span />
          )}
          <Marca claro tamanho={18} />
        </div>
        <h1 className="text-[1.45rem] font-bold leading-tight">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-white/80">{subtitulo}</p>}
      </header>
      <Mensagens />
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

export function Selecao({ rotulo, opcoes, placeholder = 'Selecione', ...props }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-bold">{rotulo}</label>
      <select id={id} className={`${CLASSE_CAMPO} h-11`} {...props}>
        <option value="">{placeholder}</option>
        {opcoes.map((o) => {
          const op = typeof o === 'string' ? { valor: o, rotulo: o } : o
          return <option key={op.valor} value={op.valor}>{op.rotulo}</option>
        })}
      </select>
    </div>
  )
}

export function GrupoOpcoes({ rotulo, opcoes, valor, onChange, colunas = 2 }) {
  const nome = useId()
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold">{rotulo}</legend>
      <div className={`grid gap-2 ${colunas === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {opcoes.map((op) => {
          const marcado = valor === op.valor
          return (
            <label
              key={op.valor}
              className={`flex cursor-pointer items-start gap-2 rounded-lg border-2 px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-milho ${
                marcado ? 'border-folha bg-folha-clara font-bold' : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <input type="radio" name={nome} value={op.valor} checked={marcado} onChange={() => onChange(op.valor)} className="mt-0.5 accent-[#1E5A3C]" />
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

// Controle segmentado (ex.: Habitante | Estabelecimento)
export function Segmentado({ rotulo, opcoes, valor, onChange }) {
  return (
    <div role="radiogroup" aria-label={rotulo} className="grid grid-cols-2 gap-1 rounded-xl bg-stone-200/80 p-1">
      {opcoes.map(({ valor: v, rotulo: r, icone: Icone }) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={valor === v}
          onClick={() => onChange(v)}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho ${
            valor === v ? 'bg-white text-folha shadow-sm' : 'text-stone-600 hover:text-tinta'
          }`}
        >
          {Icone && <Icone size={16} aria-hidden />} {r}
        </button>
      ))}
    </div>
  )
}

export function Caixa({ titulo, icone: Icone, tom = 'neutro', children, acao }) {
  const tons = {
    neutro: 'bg-white border-stone-200',
    folha: 'bg-folha-clara border-folha/20',
    milho: 'bg-milho/15 border-milho/50',
  }
  return (
    <section className={`rounded-xl border p-4 ${tons[tom]}`}>
      {titulo && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-display text-base font-bold">
            {Icone && <Icone size={18} className="text-folha" aria-hidden />}
            {titulo}
          </h2>
          {acao}
        </div>
      )}
      <div className="space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

export function Dado({ rotulo, children }) {
  return (
    <div className="flex justify-between gap-4 border-b border-stone-100 py-2 last:border-0">
      <dt className="shrink-0 text-stone-500">{rotulo}</dt>
      <dd className="text-right font-bold">{children}</dd>
    </div>
  )
}
