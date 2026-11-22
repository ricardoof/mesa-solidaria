// Estabelecimentos, Cenário 1: Falta de tempo para separar os excedentes
// Variante I1 = agilidade via smartphone; I2 = delegação via desktop
import { useState } from 'react'
import { Boxes, Send, Store } from 'lucide-react'
import { FIM, Palco, useFluxo } from '../../fluxo.jsx'
import { useSim } from '../../simulador.jsx'
import { LOJA_TESTE, gerarCodigo } from '../../dados.js'
import { validarLogin } from '../../validacoes.js'
import { Botao, Caixa, GrupoOpcoes, Tela } from '../../componentes/ui.jsx'
import { CartaoCodigo, SeletorFoto, TelaFim, TelaLogin } from '../../componentes/compartilhadas.jsx'

function TelaInicialLoja({ titulo, children }) {
  return (
    <Tela titulo={titulo} subtitulo={LOJA_TESTE.nome} rodape={children}>
      <Caixa titulo="Sem tempo para separar item por item?" icone={Boxes} tom="milho">
        <p>Fotografe as caixas e envie. A equipe do banco faz a conferência quando receber.</p>
      </Caixa>
    </Tela>
  )
}

function Smartphone({ reiniciar }) {
  const f = useFluxo('Tela inicial')
  const { autenticado, setAutenticado } = useSim()
  const [foto, setFoto] = useState(null)
  const [codigo, setCodigo] = useState('')

  async function iniciar() {
    f.acao('Doação rápida em lote')
    await f.processo('Autenticado ou não?')
    if (autenticado) f.ir('Doação rápida em lote', 'p: Autenticado')
    else f.ir('Login da loja', 'p: Não autenticado')
  }

  async function entrar(dados, rapido) {
    f.acao(rapido ? 'Faz login (loja teste)' : 'Faz login')
    const ok = await f.processo('Login', {
      verificar: () => validarLogin(dados, 'CNPJ ou usuário'),
      falhaSimulada: 'Erro no login: CNPJ ou senha não conferem.',
    })
    if (ok) {
      setAutenticado(true)
      f.ir('Doação rápida em lote', 'p: Sucesso')
    }
  }

  async function enviarFoto() {
    f.acao('Tira e envia foto das caixas')
    const ok = await f.processo('Registrar doação em lote', {
      verificar: () => (foto ? null : 'Foto inválida: tire ou escolha uma foto das caixas antes de enviar.'),
      falhaSimulada: 'Falha no envio: a conexão caiu durante o envio da foto. Envie de novo.',
    })
    if (ok) {
      setCodigo(gerarCodigo('LOT'))
      f.ir('Exibição do código identificador', 'p: Doação registrada como Pendente de Conferência')
    }
  }

  return (
    <Palco fluxo={f}>
      {f.cena === 'Tela inicial' && (
        <TelaInicialLoja titulo="Olá, equipe da loja">
          <Botao icone={Boxes} onClick={iniciar}>Doação rápida em lote</Botao>
        </TelaInicialLoja>
      )}
      {f.cena === 'Login da loja' && (
        <TelaLogin titulo="Login da loja" rotuloUsuario="CNPJ ou usuário" tipo="texto" teste={LOJA_TESTE} onEntrar={entrar} />
      )}
      {f.cena === 'Doação rápida em lote' && (
        <Tela titulo="Doação rápida em lote" subtitulo="Uma foto de todas as caixas basta." rodape={<Botao icone={Send} onClick={enviarFoto}>Enviar foto das caixas</Botao>}>
          <SeletorFoto foto={foto} setFoto={setFoto} rotuloCamera="Tocar para abrir a câmera" />
        </Tela>
      )}
      {f.cena === 'Exibição do código identificador' && (
        <Tela titulo="Doação registrada" rodape={<Botao onClick={() => f.ir(FIM, 'u: Concluir')}>Concluir</Botao>}>
          <CartaoCodigo codigo={codigo} />
          <p className="text-sm text-stone-600">O código também foi enviado para o e-mail da loja. Deixe as caixas no local de sempre para a coleta.</p>
        </Tela>
      )}
      {f.cena === FIM && <TelaFim titulo="Pronto em menos de um minuto" texto="A doação ficou registrada sem separar item por item." reiniciar={reiniciar} />}
    </Palco>
  )
}

function Desktop({ reiniciar }) {
  const f = useFluxo('Tela inicial')
  const [tipo, setTipo] = useState('lote')
  const [foto, setFoto] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [quantas, setQuantas] = useState(0)

  async function confirmar() {
    f.acao('Confirmar envio')
    const ok = await f.processo('Registrar doação em lote', {
      falhaSimulada: 'Falha no processamento da foto: a imagem não pôde ser lida. Confirme o envio de novo ou refaça a foto.',
    })
    if (ok) {
      setCodigo(gerarCodigo('LOT'))
      setQuantas((n) => n + 1)
      f.ir('Exibição do código identificador', 'p: Código gerado e status Pendente de Conferência')
    }
  }

  return (
    <Palco fluxo={f}>
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col bg-papel">
        {f.cena === 'Tela inicial' && (
          <TelaInicialLoja titulo="Painel da loja">
            <Botao onClick={() => f.ir('Escolha do tipo de doação', 'u: Fazer doação')}>Fazer doação</Botao>
            {quantas > 0 && <p className="text-center text-xs text-stone-500">{quantas} doação(ões) registrada(s) nesta sessão</p>}
          </TelaInicialLoja>
        )}
        {f.cena === 'Escolha do tipo de doação' && (
          <Tela
            titulo="Escolha do tipo de doação"
            voltar={{ rotulo: 'Painel da loja', acao: () => f.ir('Tela inicial', 'u: Voltar') }}
            rodape={<Botao onClick={() => f.ir('Captura da foto das caixas', 'u: Doação rápida em lote')}>Continuar</Botao>}
          >
            <GrupoOpcoes
              rotulo="Como você quer registrar?"
              colunas={1}
              valor={tipo}
              onChange={setTipo}
              opcoes={[
                { valor: 'lote', rotulo: 'Doação rápida em lote', detalhe: 'Só uma foto das caixas. Ideal para delegar a um funcionário.' },
                { valor: 'detalhada', rotulo: 'Doação detalhada', detalhe: 'Item por item. Fora do escopo deste cenário.', desabilitado: true },
              ]}
            />
          </Tela>
        )}
        {f.cena === 'Captura da foto das caixas' && (
          <Tela titulo="Captura da foto das caixas" subtitulo="Use a webcam ou envie um arquivo do computador.">
            <SeletorFoto
              foto={null}
              setFoto={setFoto}
              rotuloCamera="Clique para tirar a foto"
              aoEscolher={() => f.ir('Revisão da foto', 'u: Tira foto')}
            />
          </Tela>
        )}
        {f.cena === 'Revisão da foto' && (
          <Tela
            titulo="Revisão da foto"
            subtitulo="Confira se todas as caixas aparecem."
            rodape={
              <div className="flex gap-2">
                <Botao variante="secundario" onClick={() => { setFoto(null); f.ir('Captura da foto das caixas', 'u: Refazer foto') }}>Refazer foto</Botao>
                <Botao icone={Send} onClick={confirmar}>Confirmar envio</Botao>
              </div>
            }
          >
            {foto && <img src={foto} alt="Foto das caixas para revisão" className="w-full rounded-xl border border-stone-200" />}
          </Tela>
        )}
        {f.cena === 'Exibição do código identificador' && (
          <Tela
            titulo="Doação registrada"
            rodape={
              <div className="flex gap-2">
                <Botao variante="secundario" icone={Store} onClick={() => { setFoto(null); f.ir('Tela inicial', 'u: Nova doação') }}>Nova doação</Botao>
                <Botao onClick={() => f.ir(FIM, 'u: Concluir')}>Concluir</Botao>
              </div>
            }
          >
            <CartaoCodigo codigo={codigo} />
          </Tela>
        )}
        {f.cena === FIM && <TelaFim titulo="Doação delegada com sucesso" texto="O funcionário registrou o lote pelo computador da loja." reiniciar={reiniciar} />}
      </div>
    </Palco>
  )
}

export default function Cenario1({ variante, reiniciar }) {
  return variante === 'I2' ? <Desktop reiniciar={reiniciar} /> : <Smartphone reiniciar={reiniciar} />
}
