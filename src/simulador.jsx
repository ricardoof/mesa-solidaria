import { createContext, useCallback, useContext, useRef, useState } from 'react'

// Estado global do simulador: autenticação fictícia, falhas simuladas
// e o registro do caminho MoLIC percorrido.
const SimuladorCtx = createContext(null)

export function SimuladorProvider({ children }) {
  const [autenticado, setAutenticado] = useState(false)
  const [simularFalhas, setSimularFalhas] = useState(false)
  const [registro, setRegistro] = useState([])
  const contador = useRef(0)

  const registrar = useCallback((tipo, texto) => {
    contador.current += 1
    const id = contador.current
    setRegistro((r) => [...r, { id, tipo, texto }])
  }, [])

  const limparRegistro = useCallback(() => setRegistro([]), [])

  return (
    <SimuladorCtx.Provider
      value={{
        autenticado,
        setAutenticado,
        simularFalhas,
        setSimularFalhas,
        registro,
        registrar,
        limparRegistro,
      }}
    >
      {children}
    </SimuladorCtx.Provider>
  )
}

export const useSim = () => useContext(SimuladorCtx)
