// Instruções e orientações (alternativa escolhida: MoLIC 2, com botão para iniciar a doação)
import { HandHeart } from 'lucide-react'
import { useApp } from '../estado.jsx'
import { INSTRUCOES } from '../dados.js'
import { Botao, Tela } from '../componentes/ui.jsx'
import { ListaDiretrizes } from '../componentes/comuns.jsx'

export default function ComoDoar() {
  const app = useApp()
  return (
    <Tela
      titulo="Como doar"
      subtitulo="Do início até a entrega."
      rodape={<Botao icone={HandHeart} onClick={() => app.exigirLogin({ tela: 'nova-doacao' })}>Iniciar doação</Botao>}
    >
      <ol className="space-y-4">
        {INSTRUCOES.map((p, i) => (
          <li key={p.titulo} className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-milho font-display font-extrabold" aria-hidden>{i + 1}</span>
            <div>
              <h2 className="font-display font-bold">{p.titulo}</h2>
              <p className="text-sm leading-relaxed text-stone-600">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-bold">Diretrizes de doação e conservação</h2>
        <ListaDiretrizes />
      </section>
    </Tela>
  )
}
