import { Lock } from 'lucide-react'

// Moldura de celular ou de navegador desktop em volta das telas do protótipo.
export default function Dispositivo({ tipo, children }) {
  if (tipo === 'desktop') {
    return (
      <div className="w-full max-w-[820px] overflow-hidden rounded-xl border border-stone-300 bg-white shadow-[0_20px_50px_-20px_rgba(20,61,41,0.45)]">
        <div className="flex h-10 items-center gap-3 border-b border-stone-200 bg-stone-100 px-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-[#E0685A]" />
            <span className="h-3 w-3 rounded-full bg-milho" />
            <span className="h-3 w-3 rounded-full bg-[#6DBA6A]" />
          </span>
          <span className="flex flex-1 items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs text-stone-500">
            <Lock size={11} aria-hidden /> mesasolidaria.org/loja
          </span>
        </div>
        <div data-rolagem className="h-[620px] overflow-y-auto bg-papel">{children}</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[380px] rounded-[2.75rem] bg-tinta p-3 shadow-[0_24px_60px_-24px_rgba(20,61,41,0.6)]">
      <div className="relative overflow-hidden rounded-[2.1rem] bg-papel">
        <div className="pointer-events-none absolute left-1/2 top-2 z-40 h-5 w-24 -translate-x-1/2 rounded-full bg-tinta" aria-hidden />
        <div data-rolagem className="h-[700px] max-h-[78vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
