import { createContext, useContext, useRef, useState } from 'react'
import { BANCO, DOACOES_INICIAIS, USUARIOS_INICIAIS, gerarCodigo, gerarHorarios } from './dados.js'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))
const INICIO = { tela: 'inicio', params: {} }
const PREFIXO = { comum: 'DOA', lote: 'LOT', critica: 'PX' }

export function AppProvider({ children }) {
  // Navegação em pilha (sem rotas de URL)
  const [pilha, setPilha] = useState([INICIO])
  // Mensagens: erro/informação do sistema e aviso de sucesso
  const [erro, setErro] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [carregando, setCarregando] = useState(false)
  // Dados em memória
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIAIS)
  const [usuarioId, setUsuarioId] = useState(null)
  const [doacoes, setDoacoes] = useState(DOACOES_INICIAIS)
  const [ocupadoKg, setOcupadoKg] = useState(180)
  const [horarios, setHorarios] = useState(gerarHorarios)
  const timerAviso = useRef(null)

  const atual = pilha[pilha.length - 1]
  const usuario = usuarios.find((u) => u.id === usuarioId) ?? null
  const minhasDoacoes = usuario ? doacoes.filter((d) => d.dono === usuario.id) : []
  const banco = { ...BANCO, ocupadoKg, livreKg: BANCO.capacidadeKg - ocupadoKg }

  function avisar(msg) {
    clearTimeout(timerAviso.current)
    setAviso(msg)
    timerAviso.current = setTimeout(() => setAviso(null), 4500)
  }

  /**
   * Vai para uma tela.
   * limpar: a pilha volta a ser [início, tela] (usado ao concluir um fluxo)
   * substituir: troca a tela atual
   * salvarAtual: atualiza os parâmetros da tela atual antes de sair dela
   */
  function ir(tela, params = {}, { limpar = false, substituir = false, salvarAtual } = {}) {
    setErro(null)
    setPilha((p) => {
      const destino = { tela, params }
      if (limpar) return tela === 'inicio' ? [INICIO] : [INICIO, destino]
      const base = salvarAtual ? [...p.slice(0, -1), { ...p[p.length - 1], params: { ...p[p.length - 1].params, ...salvarAtual } }] : p
      return substituir ? [...base.slice(0, -1), destino] : [...base, destino]
    })
  }

  function voltar() {
    setErro(null)
    setPilha((p) => (p.length > 1 ? p.slice(0, -1) : p))
  }

  function inicio(msg) {
    ir('inicio', {}, { limpar: true })
    if (msg) avisar(msg)
  }

  // Executa um processo do sistema: indicador de carregamento e, se a verificação
  // retornar uma mensagem, mostra o erro e permanece na tela (ruptura do MoLIC).
  async function processo(verificar) {
    setErro(null)
    setCarregando(true)
    await esperar(600)
    setCarregando(false)
    const r = verificar ? verificar() : null
    if (!r) return true
    setErro(typeof r === 'string' ? { msg: r, tom: 'erro' } : r)
    return false
  }

  // Processo "Autenticado ou não?": segue para o destino ou pede login.
  function exigirLogin(destino, perfil) {
    if (usuario && (!perfil || usuario.perfil === perfil)) return ir(destino.tela, destino.params ?? {})
    if (usuario) return avisar('Essa função é exclusiva para estabelecimentos cadastrados.')
    ir('login', { perfil: perfil ?? 'habitante', destino: { ...destino, perfil } })
  }

  function entrar(u, destino, msg) {
    setUsuarioId(u.id)
    setAviso(null)
    if (destino && (!destino.perfil || destino.perfil === u.perfil)) {
      ir(destino.tela, destino.params ?? {}, { limpar: true })
      if (msg) avisar(msg)
    } else {
      inicio(msg ?? `Bem-vindo, ${u.nome.split(' ')[0]}.`)
    }
  }

  function sair() {
    setUsuarioId(null)
    inicio('Você saiu da sua conta.')
  }

  function cadastrar(dados) {
    const novo = { ...dados, id: `u-${Date.now()}`, pontos: 0 }
    setUsuarios((l) => [...l, novo])
    return novo
  }

  function registrarDoacao(dados) {
    const d = {
      id: `d-${Date.now()}`,
      protocolo: gerarCodigo(PREFIXO[dados.tipo]),
      dono: usuario.id,
      criadaEm: new Date(),
      etapa: 0,
      avisosEntrega: 0,
      ...dados,
    }
    setDoacoes((l) => [d, ...l])
    if (d.totalKg) setOcupadoKg((o) => o + d.totalKg)
    return d.id
  }

  function atualizarDoacao(id, patch) {
    setDoacoes((l) => l.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }

  function creditarPontos(n) {
    setUsuarios((l) => l.map((u) => (u.id === usuarioId ? { ...u, pontos: u.pontos + n } : u)))
  }

  return (
    <AppCtx.Provider
      value={{
        atual, pilha, ir, voltar, inicio,
        erro, setErro, aviso, setAviso, avisar, carregando, processo,
        usuarios, usuario, entrar, sair, cadastrar, exigirLogin,
        doacoes, minhasDoacoes, registrarDoacao, atualizarDoacao, creditarPontos,
        banco, horarios, setHorarios,
      }}
    >
      {children}
    </AppCtx.Provider>
  )
}
