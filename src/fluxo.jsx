import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useSim } from './simulador.jsx'

export const FIM = 'Fim'

const PalcoCtx = createContext({ erro: null, fecharErro: () => {} })
export const usePalco = () => useContext(PalcoCtx)

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Motor de navegação de um cenário, no formato do diagrama MoLIC.
 * - cena: cena atual (nome igual ao do diagrama)
 * - acao(texto): registra uma fala do usuário (u:)
 * - resposta(texto): registra uma fala do sistema (p:)
 * - ir(cena, 'u: ...' | 'p: ...'): muda de cena registrando a transição
 * - processo(nome, opções): executa um processo do sistema. Retorna true em
 *   caso de sucesso; em caso de ruptura volta para a cena indicada e mostra o erro.
 */
export function useFluxo(cenaInicial) {
  const { registrar, simularFalhas } = useSim()
  const [cena, setCena] = useState(cenaInicial)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const jaFalhou = useRef(new Set())
  const iniciou = useRef(false)

  useEffect(() => {
    if (iniciou.current) return
    iniciou.current = true
    registrar('cena', cenaInicial)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function registrarFala(fala) {
    const m = /^([up]):\s*(.*)$/s.exec(fala)
    if (m) registrar(m[1], m[2])
    else registrar('u', fala)
  }

  function ir(proxima, fala) {
    if (fala) registrarFala(fala)
    setErro(null)
    setCena(proxima)
    registrar(proxima === FIM ? 'fim' : 'cena', proxima)
  }

  function acao(texto) {
    registrar('u', texto)
  }

  function resposta(texto) {
    registrar('p', texto)
  }

  async function processo(nome, { verificar, falhaSimulada, voltarPara } = {}) {
    registrar('processo', nome)
    setErro(null)
    setCarregando(true)
    await esperar(650)
    setCarregando(false)

    const resultado = verificar ? verificar() : null
    let msg = typeof resultado === 'string' ? resultado : resultado?.msg
    let destino = (resultado && resultado.voltarPara) || voltarPara || cena

    if (!msg && falhaSimulada && simularFalhas && !jaFalhou.current.has(nome)) {
      jaFalhou.current.add(nome)
      msg = falhaSimulada
    }

    if (msg) {
      registrar('falha', msg)
      setCena(destino)
      registrar('cena', destino)
      setErro(msg)
      return false
    }
    return true
  }

  return { cena, ir, acao, resposta, processo, carregando, erro, setErro }
}

// Envolve as telas de um cenário: indicador de processamento e mensagem de erro.
export function Palco({ fluxo, children }) {
  return (
    <PalcoCtx.Provider value={{ erro: fluxo.erro, fecharErro: () => fluxo.setErro(null) }}>
      <div className="relative flex min-h-full flex-col">
        {children}
        {fluxo.carregando && (
          <div className="absolute inset-0 z-30 bg-white/75 backdrop-blur-[1px]" role="status" aria-live="polite">
            <div className="sticky top-[38%] flex flex-col items-center gap-2 pt-24 text-folha">
              <Loader2 className="animate-spin" size={32} aria-hidden />
              <span className="text-sm font-semibold">Processando…</span>
            </div>
          </div>
        )}
      </div>
    </PalcoCtx.Provider>
  )
}
