// Tela inicial única: reúne as funções de todas as telas iniciais dos cenários.
import { Boxes, ChevronRight, Clock, HandHeart, Info, LogIn, LogOut, MapPin, Moon, Phone, Siren, Trophy, Truck, Warehouse } from 'lucide-react'
import { useApp } from '../estado.jsx'
import { CATEGORIAS, ROTULO_TIPO, SELO_PONTOS, fmtData } from '../dados.js'
import { Botao, Caixa, Mensagens } from '../componentes/ui.jsx'
import { Marca, Mapa } from '../componentes/ilustracoes.jsx'
import { StatusEtiqueta } from '../componentes/comuns.jsx'

function AtalhoLoja({ icone: Icone, titulo, texto, onClick, urgente }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 text-left transition-colors hover:border-folha focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho"
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${urgente ? 'bg-tomate/10 text-tomate' : 'bg-folha-clara text-folha'}`}>
        <Icone size={22} aria-hidden />
      </span>
      <span className="flex-1">
        <span className="block font-bold">{titulo}</span>
        <span className="block text-xs text-stone-500">{texto}</span>
      </span>
      <ChevronRight size={18} className="text-stone-400" aria-hidden />
    </button>
  )
}

export default function Inicio() {
  const app = useApp()
  const u = app.usuario
  const loja = u?.perfil === 'estabelecimento'
  const { banco } = app
  const pct = Math.round((banco.ocupadoKg / banco.capacidadeKg) * 100)
  const visiveis = CATEGORIAS.filter((c) => c.status !== 'nao-aceita')

  const doar = (categoria) => app.exigirLogin({ tela: 'nova-doacao', params: categoria ? { categoria } : {} })
  const lote = () => app.exigirLogin({ tela: 'doacao-lote' }, 'estabelecimento')
  const urgente = () => app.exigirLogin({ tela: 'doacao-critica' }, 'estabelecimento')

  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-folha px-5 pb-6 pt-10 text-white">
        <div className="flex items-center justify-between">
          <Marca claro tamanho={22} />
          {u ? (
            <button type="button" onClick={app.sair} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-white/85 hover:bg-white/10 hover:text-white">
              <LogOut size={16} aria-hidden /> Sair
            </button>
          ) : (
            <button type="button" onClick={() => app.ir('login', { perfil: 'habitante' })} className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-bold hover:bg-white/25">
              <LogIn size={16} aria-hidden /> Entrar
            </button>
          )}
        </div>
        <h1 className="mt-5 text-[1.6rem] font-bold leading-tight">
          {u ? `Olá, ${loja ? u.nome : u.nome.split(' ')[0]}` : 'Doe alimentos para quem precisa perto de você'}
        </h1>
        <p className="mt-1 text-sm text-white/80">
          {u ? (loja ? 'Conta de estabelecimento' : 'Conta de habitante') : `${banco.nome} atende ${banco.instituicoes} instituições do bairro.`}
        </p>
      </header>

      <Mensagens />

      <main className="flex-1 space-y-6 px-5 py-5">
        <div className="space-y-2">
          <Botao icone={HandHeart} onClick={() => doar()}>Fazer doação</Botao>
          <Botao variante="secundario" icone={Info} onClick={() => app.ir('como-doar')}>Como doar? (instruções)</Botao>
        </div>

        {u && (
          <Caixa titulo={loja ? 'Pontos da loja' : 'Seus pontos'} icone={Trophy} tom="milho">
            <p className="font-display text-4xl font-extrabold">{u.pontos}</p>
            {loja &&
              (u.pontos >= SELO_PONTOS ? (
                <p>Selo Parceiro Frequente conquistado.</p>
              ) : (
                <p>Faltam {SELO_PONTOS - u.pontos} pontos para o selo Parceiro Frequente.</p>
              ))}
            {!loja && <p>Você ganha pontos a cada doação entregue.</p>}
          </Caixa>
        )}

        {(!u || loja) && (
          <section className="space-y-2">
            <h2 className="text-lg font-bold">{loja ? 'Ações da loja' : 'Para estabelecimentos'}</h2>
            <AtalhoLoja icone={Boxes} titulo="Doação rápida em lote" texto="Sem tempo para separar? Só uma foto das caixas." onClick={lote} />
            <AtalhoLoja icone={Siren} titulo="Doação urgente" texto="Perecíveis que estragam nas próximas horas." onClick={urgente} urgente />
            <div className="flex gap-3 rounded-xl bg-milho/15 p-3 text-sm">
              <Moon size={18} className="mt-0.5 shrink-0 text-terra" aria-hidden />
              <p>A loja vai fechar? Doe o que sobrou: escolha a retirada e a equipe busca até as 19h.</p>
            </div>
          </section>
        )}

        {u && (
          <section className="space-y-2">
            <h2 className="text-lg font-bold">Suas doações</h2>
            {app.minhasDoacoes.length ? (
              <ul className="space-y-2">
                {app.minhasDoacoes.map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => app.ir('acompanhamento', { id: d.id })}
                      className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 text-left hover:border-folha focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho"
                    >
                      <span className="flex-1">
                        <span className="block font-bold">{d.tipo === 'comum' ? d.categoria : ROTULO_TIPO[d.tipo]}</span>
                        <span className="block text-xs text-stone-500">{d.protocolo}, {fmtData(d.criadaEm)}</span>
                      </span>
                      <StatusEtiqueta etapa={d.etapa} />
                      <ChevronRight size={18} className="text-stone-400" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-600">
                Nenhuma doação ainda. Toque em Fazer doação para começar.
              </p>
            )}
          </section>
        )}

        <Caixa titulo="Hoje no banco" icone={Warehouse}>
          <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Capacidade ocupada">
            <div className="h-full rounded-full bg-folha" style={{ width: `${pct}%` }} />
          </div>
          <p><strong>{pct}% ocupado.</strong> Recebemos mais {banco.livreKg} kg hoje.</p>
          <p className="pt-1 text-xs text-stone-500">Toque em uma categoria aceita para doar:</p>
          <div className="flex flex-wrap gap-2">
            {visiveis.map((c) =>
              c.status === 'aceita' ? (
                <button key={c.nome} type="button" onClick={() => doar(c.nome)} className="rounded-full bg-folha-clara px-3 py-1.5 text-sm font-bold text-folha hover:bg-folha hover:text-white">
                  {c.nome}
                </button>
              ) : (
                <span key={c.nome} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-400 line-through" title="Estoque cheio hoje">
                  {c.nome}
                </span>
              ),
            )}
          </div>
        </Caixa>

        <Caixa titulo="Endereço e horários" icone={MapPin}>
          <Mapa />
          <p className="flex gap-2 pt-1"><MapPin size={18} className="shrink-0 text-folha" aria-hidden /> {banco.endereco}</p>
          <p className="flex gap-2"><Clock size={18} className="shrink-0 text-folha" aria-hidden /> {banco.horarios}</p>
          <p className="flex gap-2"><Phone size={18} className="shrink-0 text-folha" aria-hidden /> {banco.telefone}</p>
          <p className="flex gap-2 rounded-lg bg-milho/15 p-2"><Truck size={18} className="shrink-0 text-terra" aria-hidden /> Não consegue levar? Ao doar, escolha a retirada: um voluntário busca no seu endereço.</p>
        </Caixa>

        {!u && (
          <p className="pb-2 text-center text-sm">
            Ainda não tem conta?{' '}
            <button type="button" onClick={() => app.ir('cadastro', { perfil: 'habitante' })} className="font-bold text-folha underline underline-offset-4">
              Criar cadastro
            </button>
          </p>
        )}
      </main>
    </div>
  )
}
