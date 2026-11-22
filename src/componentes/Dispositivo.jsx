import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

// Moldura de celular. Volta ao topo a cada troca de tela.
export default function Dispositivo({ chave, carregando, children }) {
  const rolagem = useRef(null)
  useEffect(() => {
    rolagem.current?.scrollTo({ top: 0 })
  }, [chave])

  return (
    <div className="w-full max-w-[390px] rounded-[2.75rem] bg-tinta p-3 shadow-[0_24px_60px_-24px_rgba(20,61,41,0.6)]">
      <div className="relative overflow-hidden rounded-[2.1rem] bg-papel">
        <div className="pointer-events-none absolute left-1/2 top-2 z-40 h-5 w-24 -translate-x-1/2 rounded-full bg-tinta" aria-hidden />
        <div ref={rolagem} className="flex h-[740px] max-h-[80vh] flex-col overflow-y-auto">
          {children}
        </div>
        {carregando && (
          <div className="absolute inset-0 z-30 grid place-items-center bg-white/75 backdrop-blur-[1px]" role="status" aria-live="polite">
            <span className="flex flex-col items-center gap-2 text-folha">
              <Loader2 className="animate-spin" size={32} aria-hidden />
              <span className="text-sm font-bold">Processando…</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
