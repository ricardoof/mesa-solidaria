import { useEffect, useRef } from 'react'

// Mostra, em tempo real, o caminho percorrido no diagrama MoLIC.
function Seta({ pontilhada }) {
  return (
    <span className="flex flex-col items-center" aria-hidden>
      <span className={`h-3 ${pontilhada ? 'border-l-2 border-dotted border-tomate' : 'w-px bg-tinta'}`} />
      <span className={`-mt-px h-0 w-0 border-x-4 border-t-[6px] border-x-transparent ${pontilhada ? 'border-t-tomate' : 'border-t-tinta'}`} />
    </span>
  )
}

function Entrada({ item, anterior }) {
  const { tipo, texto } = item
  const posFala = anterior && ['u', 'p', 'falha'].includes(anterior.tipo)
  const posFalha = anterior?.tipo === 'falha'

  if (tipo === 'u' || tipo === 'p' || tipo === 'falha') {
    const falha = tipo === 'falha'
    return (
      <li className="flex flex-col items-center">
        <span className={`h-3 ${falha ? 'border-l-2 border-dotted border-tomate' : 'w-px bg-tinta'}`} aria-hidden />
        <span className={`max-w-full px-2 py-1 text-center text-[11px] leading-snug ${falha ? 'border border-dotted border-tomate bg-tomate/[0.06] text-tomate' : 'bg-stone-200'}`}>
          <strong>{tipo === 'u' ? 'u:' : 'p:'}</strong> {texto}
        </span>
      </li>
    )
  }

  const conector = posFala ? <Seta pontilhada={posFalha} /> : anterior ? <Seta /> : null

  if (tipo === 'fim')
    return (
      <li className="flex flex-col items-center">
        {conector}
        <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-tinta" aria-label="Fim do diálogo">
          <span className="h-4 w-4 rounded-full border-2 border-tinta" />
        </span>
      </li>
    )

  return (
    <li className="flex flex-col items-center">
      {conector}
      {tipo === 'cena' ? (
        <span className="w-full rounded-full border-2 border-tinta bg-white px-3 py-1.5 text-center text-xs">
          Cena: {texto}
        </span>
      ) : (
        <span className="w-full bg-tinta px-3 py-2 text-center text-xs text-white">Processo: {texto}</span>
      )}
    </li>
  )
}

export default function PainelMolic({ registro }) {
  const lista = useRef(null)
  useEffect(() => {
    const el = lista.current
    if (el) el.scrollTop = el.scrollHeight
  }, [registro.length])

  return (
    <aside className="flex flex-col rounded-2xl border border-stone-300 bg-[#FBFCFA] lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
      <div className="border-b border-stone-200 p-4">
        <h2 className="text-lg font-bold">Caminho no diagrama MoLIC</h2>
        <p className="text-xs text-stone-500">Atualiza a cada ação feita no protótipo.</p>
      </div>
      <div ref={lista} className="max-h-[420px] flex-1 overflow-y-auto px-4 py-4 lg:max-h-none" aria-live="polite">
        <span className="mx-auto block h-6 w-6 rounded-full bg-tinta" aria-label="Início do diálogo" />
        <ol>
          {registro.map((item, i) => (
            <Entrada key={item.id} item={item} anterior={i === 0 ? { tipo: 'inicio' } : registro[i - 1]} />
          ))}
        </ol>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 border-t border-stone-200 p-4 text-[11px] text-stone-600">
        <dt className="font-bold text-tinta">u:</dt><dd>fala do usuário</dd>
        <dt className="font-bold text-tinta">p:</dt><dd>fala do sistema (preposto)</dd>
        <dt className="font-bold text-tomate">• • •</dt><dd>recuperação de ruptura</dd>
      </dl>
    </aside>
  )
}
