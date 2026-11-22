import { useRef, useState } from 'react'
import { Camera, Check, CircleCheckBig, ImagePlus, Plus, RotateCcw, X, Zap } from 'lucide-react'
import { Botao, Campo, GrupoOpcoes, Selecao, Tela } from './ui.jsx'
import { FOTO_EXEMPLO } from './ilustracoes.jsx'
import { TIPOS_ALIMENTO, USUARIO_TESTE } from '../dados.js'

// ↻ Login (habitante e loja)
export function TelaLogin({ titulo = 'Login', rotuloUsuario = 'E-mail', tipo = 'email', teste, onEntrar, onSemCadastro }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  return (
    <Tela
      titulo={titulo}
      subtitulo="Entre para continuar sua doação."
      rodape={
        <>
          <Botao onClick={() => onEntrar({ usuario, senha }, false)}>Entrar</Botao>
          <Botao variante="destaque" icone={Zap} onClick={() => onEntrar({ usuario: teste.usuario, senha: teste.senha }, true)}>
            Entrar com 1 clique (usuário teste)
          </Botao>
          {onSemCadastro && (
            <Botao variante="fantasma" onClick={onSemCadastro}>Não possuo cadastro</Botao>
          )}
        </>
      }
    >
      <Campo rotulo={rotuloUsuario} type={tipo === 'email' ? 'email' : 'text'} autoComplete="username" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
      <Campo rotulo="Senha" type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} dica="Protótipo: qualquer senha com 6 caracteres ou mais funciona." />
    </Tela>
  )
}

// ↻ Cadastro de usuário (Habitantes, cenários 1 e 3)
export function TelaCadastro({ titulo, rotuloEnviar, comEndereco = false, voltar, onEnviar }) {
  const [d, setD] = useState({ nome: '', email: '', telefone: '', senha: '', endereco: '' })
  const mudar = (campo) => (e) => setD({ ...d, [campo]: e.target.value })
  const preencher = () => setD({ ...USUARIO_TESTE, nome: comEndereco ? 'Roberto Lima' : USUARIO_TESTE.nome, email: comEndereco ? 'roberto@exemplo.com' : USUARIO_TESTE.email })
  return (
    <Tela
      titulo={titulo}
      subtitulo="Leva menos de um minuto."
      voltar={voltar}
      rodape={<Botao onClick={() => onEnviar({ ...d, exigeEndereco: comEndereco })}>{rotuloEnviar}</Botao>}
    >
      <button type="button" onClick={preencher} className="text-sm font-bold text-folha underline underline-offset-4">
        Preencher com dados de teste
      </button>
      <Campo rotulo="Nome" autoComplete="name" value={d.nome} onChange={mudar('nome')} />
      <Campo rotulo="E-mail" type="email" autoComplete="email" value={d.email} onChange={mudar('email')} />
      <Campo rotulo="Telefone" type="tel" autoComplete="tel" value={d.telefone} onChange={mudar('telefone')} />
      {comEndereco && (
        <Campo rotulo="Endereço para coleta" autoComplete="street-address" value={d.endereco} onChange={mudar('endereco')} dica="Usado para agendar a busca dos alimentos." />
      )}
      <Campo rotulo="Senha" type="password" autoComplete="new-password" value={d.senha} onChange={mudar('senha')} dica="Mínimo de 6 caracteres." />
    </Tela>
  )
}

// ↻ Abrir processo de doação (Habitantes, cenários 1 e 2)
export function TelaAbrirDoacao({ titulo = 'Abrir processo de doação', voltar, rotuloEnviar = 'Enviar dados', onEnviar }) {
  const [d, setD] = useState({ tipo: '', quantidade: '', modalidade: '' })
  return (
    <Tela titulo={titulo} subtitulo="Conte o que você quer doar." voltar={voltar} rodape={<Botao onClick={() => onEnviar(d)}>{rotuloEnviar}</Botao>}>
      <Selecao rotulo="Tipo de alimento" opcoes={TIPOS_ALIMENTO} value={d.tipo} onChange={(e) => setD({ ...d, tipo: e.target.value })} />
      <Campo rotulo="Quantidade aproximada" placeholder="Ex.: 5 kg ou 10 unidades" value={d.quantidade} onChange={(e) => setD({ ...d, quantidade: e.target.value })} />
      <GrupoOpcoes
        rotulo="Como a doação chega ao banco?"
        valor={d.modalidade}
        onChange={(v) => setD({ ...d, modalidade: v })}
        opcoes={[
          { valor: 'Retirada', rotulo: 'Retirada', detalhe: 'Um voluntário busca' },
          { valor: 'Entrega', rotulo: 'Entrega', detalhe: 'Eu levo até o banco' },
        ]}
      />
    </Tela>
  )
}

// Lista editável de itens com quantidade (Solicitação de doação)
export function ListaItens({ opcoes, itens, setItens, rotuloItem = 'Item', rotuloAdicionar = 'Adicionar item' }) {
  const proximo = useRef(100)
  const atualizar = (id, campo, valor) => setItens((l) => l.map((i) => (i.id === id ? { ...i, [campo]: valor } : i)))
  return (
    <div className="space-y-2">
      <div className="flex gap-2 text-xs font-bold text-stone-500" aria-hidden>
        <span className="flex-1">{rotuloItem}</span>
        <span className="w-20">Qtd</span>
        <span className="w-11" />
      </div>
      {itens.map((it, idx) => (
        <div key={it.id} className="flex items-center gap-2">
          <select
            aria-label={`${rotuloItem} ${idx + 1}`}
            value={it.item}
            onChange={(e) => atualizar(it.id, 'item', e.target.value)}
            className="h-11 min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-2 focus:border-folha focus:outline-none focus:ring-2 focus:ring-folha/30"
          >
            <option value="">Escolha</option>
            {opcoes.map((o) => <option key={o}>{o}</option>)}
          </select>
          <input
            aria-label={`Quantidade do ${rotuloItem.toLowerCase()} ${idx + 1}`}
            type="number"
            min="1"
            inputMode="numeric"
            value={it.qtd}
            onChange={(e) => atualizar(it.id, 'qtd', e.target.value)}
            className="h-11 w-20 rounded-lg border border-stone-300 bg-white px-2 focus:border-folha focus:outline-none focus:ring-2 focus:ring-folha/30"
          />
          <button
            type="button"
            aria-label={`Remover ${rotuloItem.toLowerCase()} ${idx + 1}`}
            disabled={itens.length === 1}
            onClick={() => setItens((l) => l.filter((i) => i.id !== it.id))}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-stone-300 text-stone-500 hover:text-tomate disabled:opacity-30"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItens((l) => [...l, { id: proximo.current++, item: '', qtd: '' }])}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold text-folha hover:bg-folha-clara"
      >
        <Plus size={16} aria-hidden /> {rotuloAdicionar}
      </button>
    </div>
  )
}

const ETAPAS = ['Registrada', 'Em análise', 'Aprovada', 'Entregue']

// ↻ Linha do tempo de status (Acompanhamento da doação)
export function LinhaStatus({ etapa }) {
  return (
    <ol className="space-y-0" aria-label="Status da doação">
      {ETAPAS.map((nome, i) => {
        const feita = i < etapa
        const atual = i === etapa
        return (
          <li key={nome} className="relative flex gap-3 pb-5 last:pb-0">
            {i < ETAPAS.length - 1 && (
              <span className={`absolute left-[11px] top-6 h-[calc(100%-20px)] w-0.5 ${feita ? 'bg-folha' : 'bg-stone-200'}`} aria-hidden />
            )}
            <span
              className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                feita ? 'border-folha bg-folha text-white' : atual ? 'border-folha bg-milho' : 'border-stone-300 bg-white'
              }`}
              aria-hidden
            >
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

// Seleção de foto: câmera do celular, arquivo, ou foto de exemplo
export function SeletorFoto({ foto, setFoto, rotuloCamera = 'Abrir câmera', aoEscolher }) {
  const entrada = useRef(null)
  const escolher = (url) => {
    setFoto(url)
    aoEscolher?.(url)
  }
  const aoArquivo = (e) => {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    escolher(URL.createObjectURL(arquivo))
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
          <img src={foto} alt="Foto das caixas de doação" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm">
            <Camera size={36} aria-hidden />
            {rotuloCamera}
          </span>
        )}
      </button>
      <input ref={entrada} type="file" accept="image/*" capture="environment" className="hidden" onChange={aoArquivo} />
      <div className="flex gap-2">
        <button type="button" onClick={() => entrada.current?.click()} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold hover:bg-stone-50">
          <ImagePlus size={16} aria-hidden /> Enviar arquivo
        </button>
        <button type="button" onClick={() => escolher(FOTO_EXEMPLO)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold hover:bg-stone-50">
          <RotateCcw size={16} aria-hidden /> Usar foto de exemplo
        </button>
      </div>
    </div>
  )
}

// ↻ Exibição do código identificador (Estabelecimentos, cenário 1)
export function CartaoCodigo({ codigo }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-folha bg-folha-clara p-5 text-center">
      <p className="text-sm text-stone-600">Escreva este código nas caixas</p>
      <p className="mt-1 font-display text-4xl font-extrabold tracking-wider text-folha">{codigo}</p>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-milho/30 px-3 py-1 text-xs font-bold">
        Pendente de conferência
      </p>
    </div>
  )
}

// Tela de encerramento do diálogo (o "fim" do diagrama MoLIC)
export function TelaFim({ titulo, texto, children, reiniciar }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 bg-folha px-8 py-12 text-center text-white">
      <span className="grid h-16 w-16 place-items-center rounded-full border-4 border-white/40" aria-hidden>
        <CircleCheckBig size={30} />
      </span>
      <h1 className="text-2xl font-bold leading-tight">{titulo}</h1>
      {texto && <p className="max-w-xs text-white/85">{texto}</p>}
      {children}
      <button
        type="button"
        onClick={reiniciar}
        className="mt-4 rounded-xl border-2 border-white/60 px-5 py-2.5 font-bold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-milho"
      >
        Refazer este cenário
      </button>
    </div>
  )
}
