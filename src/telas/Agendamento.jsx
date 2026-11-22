// Agendamento da retirada (alternativa escolhida: lista de horários)
import { useState } from 'react'
import { useApp } from '../estado.jsx'
import { descreverItens, fmtDia } from '../dados.js'
import { Botao, Caixa, Tela } from '../componentes/ui.jsx'

export default function Agendamento({ doacao }) {
  const app = useApp()
  const [escolhido, setEscolhido] = useState(null)
  const [quantos, setQuantos] = useState(5)
  const livres = app.horarios.filter((h) => h.status !== 'lotado')

  async function confirmar() {
    const ok = await app.processo(() => {
      if (!escolhido) return 'Escolha um dos horários para continuar.'
      if (escolhido.status === 'disputado') {
        app.setHorarios((hs) => hs.map((h) => (h.id === escolhido.id ? { ...h, status: 'lotado' } : h)))
        setEscolhido(null)
        return 'Horário indisponível: outra pessoa acabou de reservar este horário. Escolha outro.'
      }
      return null
    })
    if (!ok) return
    app.setHorarios((hs) => hs.map((h) => (h.id === escolhido.id ? { ...h, status: 'lotado' } : h)))
    const id = app.registrarDoacao({ ...doacao, agendamento: { data: escolhido.data, hora: escolhido.hora } })
    app.ir('confirmacao', { id }, { limpar: true })
  }

  return (
    <Tela titulo="Agendamento da retirada" subtitulo="Escolha quando o voluntário pode passar." rodape={<Botao onClick={confirmar}>Confirmar agendamento</Botao>}>
      <Caixa titulo="Itens aceitos" tom="folha">
        <p>{descreverItens(doacao)}</p>
        <p className="text-stone-600">Deixe tudo em caixas ventiladas, separando os itens mais maduros. A coleta leva cerca de 10 minutos.</p>
      </Caixa>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-bold">Próximos horários disponíveis</legend>
        {livres.slice(0, quantos).map((h) => (
          <label
            key={h.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-3 text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-milho ${
              escolhido?.id === h.id ? 'border-folha bg-folha-clara font-bold' : 'border-stone-200 bg-white'
            }`}
          >
            <input type="radio" name="horario" checked={escolhido?.id === h.id} onChange={() => setEscolhido(h)} className="accent-[#1E5A3C]" />
            <span className="capitalize">{fmtDia(h.data)}</span>
            <span className="ml-auto">{h.hora}</span>
          </label>
        ))}
        {quantos < livres.length && <Botao variante="fantasma" onClick={() => setQuantos(quantos + 5)}>Ver mais datas</Botao>}
      </fieldset>
    </Tela>
  )
}
