// Habitantes, Cenário 2: Júlia não encontra orientação clara
// Variante A = MoLIC 1 (instruções só informativas)
// Variante B = MoLIC 2 (botão de iniciar doação também nas instruções)
import { HandHeart } from 'lucide-react'
import { FIM, Palco, useFluxo } from '../../fluxo.jsx'
import { INSTRUCOES } from '../../dados.js'
import { Botao, Tela } from '../../componentes/ui.jsx'
import { TelaAbrirDoacao, TelaFim } from '../../componentes/compartilhadas.jsx'
import { TelaInicialHabitante } from './Cenario1.jsx'

export default function Cenario2({ variante, reiniciar }) {
  const f = useFluxo('Tela inicial')

  return (
    <Palco fluxo={f}>
      {f.cena === 'Tela inicial' && (
        <TelaInicialHabitante
          rotuloDoar="Iniciar doação"
          rotuloInstrucoes="Como doar? (instruções)"
          onDoar={() => f.ir('Abertura do processo de doação', 'u: Iniciar doação')}
          onInstrucoes={() => f.ir('Instruções e orientações', 'u: Acessar instruções')}
        />
      )}

      {f.cena === 'Instruções e orientações' && (
        <Tela
          titulo="Como doar"
          subtitulo="Quatro passos, do início até a entrega."
          voltar={{ rotulo: 'Voltar à tela inicial', acao: () => f.ir('Tela inicial', 'u: Voltar à tela inicial') }}
          rodape={
            variante === 'B' ? (
              <>
                <Botao icone={HandHeart} onClick={() => f.ir('Abertura do processo de doação', 'u: Iniciar doação')}>Iniciar doação</Botao>
                <Botao variante="fantasma" onClick={() => f.ir('Tela inicial', 'u: Voltar à tela inicial')}>Voltar à tela inicial</Botao>
              </>
            ) : (
              <Botao variante="secundario" onClick={() => f.ir('Tela inicial', 'u: Voltar à tela inicial')}>Voltar à tela inicial</Botao>
            )
          }
        >
          <ol className="space-y-4">
            {INSTRUCOES.map((p, i) => (
              <li key={p.titulo} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-milho font-display font-extrabold" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-display font-bold">{p.titulo}</h2>
                  <p className="text-sm leading-relaxed text-stone-600">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </Tela>
      )}

      {f.cena === 'Abertura do processo de doação' && (
        <TelaAbrirDoacao
          titulo="Abertura do processo de doação"
          voltar={{ rotulo: 'Tela inicial', acao: () => f.ir('Tela inicial', 'u: Voltar à tela inicial') }}
          onEnviar={() => f.ir(FIM, 'u: Envia dados da doação')}
        />
      )}

      {f.cena === FIM && (
        <TelaFim
          titulo="Processo de doação aberto"
          texto={
            variante === 'B'
              ? 'Na alternativa B, Júlia iniciou a doação direto da tela de instruções.'
              : 'Na alternativa A, Júlia precisou voltar à tela inicial para iniciar a doação.'
          }
          reiniciar={reiniciar}
        />
      )}
    </Palco>
  )
}
