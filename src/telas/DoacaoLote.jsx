// Doação rápida em lote (alternativa escolhida: interação 1, via smartphone)
import { useState } from 'react'
import { Send } from 'lucide-react'
import { useApp } from '../estado.jsx'
import { Botao, Tela } from '../componentes/ui.jsx'
import { SeletorFoto } from '../componentes/comuns.jsx'

export default function DoacaoLote() {
  const app = useApp()
  const [foto, setFoto] = useState(null)

  async function enviar() {
    const ok = await app.processo(() => (foto ? null : 'Foto inválida: tire ou escolha uma foto das caixas antes de enviar.'))
    if (!ok) return
    const id = app.registrarDoacao({ tipo: 'lote', categoria: 'Lote', itens: [], totalKg: 0, modalidade: 'retirada', foto, etapa: 1 })
    app.ir('confirmacao', { id }, { limpar: true })
  }

  return (
    <Tela titulo="Doação rápida em lote" subtitulo="Uma foto de todas as caixas basta. A equipe confere ao receber." rodape={<Botao icone={Send} onClick={enviar}>Enviar foto das caixas</Botao>}>
      <SeletorFoto foto={foto} setFoto={setFoto} />
    </Tela>
  )
}
