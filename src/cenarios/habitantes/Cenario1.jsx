// Habitantes, Cenário 1: Júlia não sabe para quem doar
import { useState } from 'react'
import { HandHeart, Info, MapPin } from 'lucide-react'
import { FIM, Palco, useFluxo } from '../../fluxo.jsx'
import { useSim } from '../../simulador.jsx'
import { BANCO, USUARIO_TESTE, gerarCodigo } from '../../dados.js'
import { validarCadastro, validarDoacao, validarLogin } from '../../validacoes.js'
import { Botao, Caixa, Dado, Tela } from '../../componentes/ui.jsx'
import { CestaIlustracao } from '../../componentes/ilustracoes.jsx'
import { LinhaStatus, TelaAbrirDoacao, TelaCadastro, TelaFim, TelaLogin } from '../../componentes/compartilhadas.jsx'

export function TelaInicialHabitante({ onDoar, rotuloDoar = 'Fazer doação', onInstrucoes, rotuloInstrucoes = 'Instruções e orientações' }) {
  return (
    <Tela
      titulo="Doe alimentos para quem precisa perto de você"
      rodape={
        <>
          <Botao icone={HandHeart} onClick={onDoar}>{rotuloDoar}</Botao>
          {onInstrucoes && <Botao variante="secundario" icone={Info} onClick={onInstrucoes}>{rotuloInstrucoes}</Botao>}
        </>
      }
    >
      <CestaIlustracao />
      <Caixa titulo={BANCO.nome} icone={MapPin}>
        <p>{BANCO.endereco}</p>
        <p>Recebemos as doações e distribuímos para {BANCO.instituicoes} instituições e famílias cadastradas do bairro.</p>
      </Caixa>
    </Tela>
  )
}

export default function Cenario1({ reiniciar }) {
  const f = useFluxo('Tela inicial')
  const { autenticado, setAutenticado } = useSim()
  const [doacao, setDoacao] = useState(null)
  const [etapa, setEtapa] = useState(0)

  async function fazerDoacao() {
    f.acao('Fazer doação')
    await f.processo('Autenticado ou não?')
    if (autenticado) f.ir('Abrir processo de doação', 'p: Autenticado')
    else f.ir('Login', 'p: Não autenticado')
  }

  async function entrar(dados, rapido) {
    f.acao(rapido ? 'Faz login (usuário teste)' : 'Faz login')
    const ok = await f.processo('Login', {
      verificar: () => validarLogin(dados),
      falhaSimulada: 'Erro no login: e-mail ou senha não conferem. Confira e tente de novo.',
    })
    if (ok) {
      setAutenticado(true)
      f.ir('Abrir processo de doação', 'p: Sucesso')
    }
  }

  async function cadastrar(dados) {
    f.acao('Envia cadastro')
    const ok = await f.processo('Cadastro', {
      verificar: () => validarCadastro(dados),
      falhaSimulada: 'Erro no cadastro: este e-mail já está em uso. Use outro e-mail ou faça login.',
    })
    if (ok) {
      setAutenticado(true)
      f.ir('Abrir processo de doação', 'p: Sucesso')
    }
  }

  async function abrirDoacao(dados) {
    f.acao('Envia dados para abrir processo')
    const ok = await f.processo('Abrir doação', {
      verificar: () => validarDoacao(dados),
      falhaSimulada: 'Erro na abertura: o registro não foi concluído. Envie os dados de novo.',
    })
    if (ok) {
      setDoacao({ ...dados, protocolo: gerarCodigo('DOA') })
      f.ir('Acompanhamento da doação', 'p: Sucesso')
    }
  }

  function consultar() {
    f.acao('Consultar andamento')
    setEtapa((e) => Math.min(e + 1, 3))
  }

  return (
    <Palco fluxo={f}>
      {f.cena === 'Tela inicial' && <TelaInicialHabitante onDoar={fazerDoacao} />}

      {f.cena === 'Login' && (
        <TelaLogin
          teste={{ usuario: USUARIO_TESTE.email, senha: USUARIO_TESTE.senha }}
          onEntrar={entrar}
          onSemCadastro={() => f.ir('Interação de cadastro', 'u: Não possui cadastro')}
        />
      )}

      {f.cena === 'Interação de cadastro' && (
        <TelaCadastro titulo="Criar cadastro" rotuloEnviar="Enviar cadastro" onEnviar={cadastrar} />
      )}

      {f.cena === 'Abrir processo de doação' && <TelaAbrirDoacao onEnviar={abrirDoacao} />}

      {f.cena === 'Acompanhamento da doação' && doacao && (
        <Tela
          titulo="Acompanhamento da doação"
          subtitulo={`Protocolo ${doacao.protocolo}`}
          rodape={
            <>
              <Botao variante="secundario" onClick={consultar} disabled={etapa === 3}>Consultar andamento</Botao>
              <Botao onClick={() => f.ir(FIM, 'u: Concluir')}>Concluir</Botao>
            </>
          }
        >
          <Caixa titulo="Para onde vai sua doação" tom="folha" icone={MapPin}>
            <p>
              <strong>{BANCO.nome}</strong>, que repassa para {BANCO.instituicoes} instituições e famílias cadastradas do bairro.
            </p>
          </Caixa>
          <Caixa>
            <LinhaStatus etapa={etapa} />
          </Caixa>
          <Caixa>
            <dl>
              <Dado rotulo="Alimento">{doacao.tipo}</Dado>
              <Dado rotulo="Quantidade">{doacao.quantidade}</Dado>
              <Dado rotulo="Modalidade">{doacao.modalidade}</Dado>
              <Dado rotulo="Pontos">{etapa === 3 ? '+30' : 'liberados na entrega'}</Dado>
            </dl>
          </Caixa>
        </Tela>
      )}

      {f.cena === FIM && (
        <TelaFim titulo="Doação aberta" texto="Júlia sabe para onde vai a doação e pode acompanhar cada etapa pelo app." reiniciar={reiniciar} />
      )}
    </Palco>
  )
}
