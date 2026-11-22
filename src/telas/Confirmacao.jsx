// Confirmação única para todos os tipos de doação:
// comprovante de agendamento, instruções de entrega, código do lote ou passe expresso.
import { Download, Package, Truck } from 'lucide-react'
import { useApp } from '../estado.jsx'
import { ROTULO_TIPO, descreverItens, fmtDiaLongo, fmtHora } from '../dados.js'
import { Botao, Caixa, Dado, Tela } from '../componentes/ui.jsx'
import { QrIlustrativo } from '../componentes/ilustracoes.jsx'

export function OrientacoesEntrega({ d, banco }) {
  if (d.tipo === 'critica')
    return (
      <Caixa titulo="Orientações de entrega" icone={Package} tom="milho">
        <dl>
          <Dado rotulo="Local">Doca 2, entrada lateral</Dado>
          <Dado rotulo="Chegar até">{fmtHora(d.prazo)}</Dado>
          <Dado rotulo="Levar">Caixas fechadas e nota de doação</Dado>
        </dl>
      </Caixa>
    )
  if (d.tipo === 'lote')
    return (
      <Caixa titulo="Coleta na loja" icone={Truck} tom="folha">
        <p>Escreva o código nas caixas e deixe-as no local de coleta. A van do banco passa hoje entre 18h e 19h.</p>
      </Caixa>
    )
  if (d.modalidade === 'retirada')
    return (
      <Caixa titulo="Retirada agendada" icone={Truck} tom="folha">
        <dl>
          <Dado rotulo="Data"><span className="capitalize">{fmtDiaLongo(d.agendamento.data)}</span></Dado>
          <Dado rotulo="Horário">{d.agendamento.hora}</Dado>
          <Dado rotulo="Endereço">{d.endereco}</Dado>
        </dl>
      </Caixa>
    )
  return (
    <Caixa titulo="Como entregar" icone={Package} tom="folha">
      <dl>
        <Dado rotulo="Local">{banco.endereco}, doca 1</Dado>
        <Dado rotulo="Horário">{banco.horarioCurto}</Dado>
        <Dado rotulo="Embalagem">Caixas ventiladas ou sacolas limpas</Dado>
        <Dado rotulo="Triagem">{banco.triagem}</Dado>
        <Dado rotulo="Espaço reservado até">{fmtHora(d.reservaAte)}</Dado>
      </dl>
    </Caixa>
  )
}

export default function Confirmacao({ id }) {
  const app = useApp()
  const d = app.doacoes.find((x) => x.id === id)
  if (!d) return null
  const dComEndereco = { ...d, endereco: app.usuario?.endereco }

  function baixarComprovante() {
    const texto = [
      app.banco.nome,
      'Comprovante de agendamento de retirada',
      '',
      `Protocolo: ${d.protocolo}`,
      `Doador: ${app.usuario.nome}`,
      `Endereço: ${app.usuario.endereco}`,
      `Data e horário: ${fmtDiaLongo(d.agendamento.data)}, ${d.agendamento.hora}`,
      `Itens: ${descreverItens(d)}`,
    ].join('\n')
    const url = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `comprovante-${d.protocolo}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Tela
      voltar={false}
      titulo={d.tipo === 'critica' ? 'Envio expresso aprovado' : 'Doação registrada'}
      subtitulo={`${ROTULO_TIPO[d.tipo]}, protocolo ${d.protocolo}`}
      rodape={
        <>
          {d.agendamento && <Botao variante="secundario" icone={Download} onClick={baixarComprovante}>Baixar comprovante</Botao>}
          <Botao onClick={() => app.ir('acompanhamento', { id: d.id }, { limpar: true })}>Acompanhar doação</Botao>
          <Botao variante="fantasma" onClick={() => app.inicio()}>Voltar ao início</Botao>
        </>
      }
    >
      {d.tipo === 'lote' && (
        <div className="rounded-2xl border-2 border-dashed border-folha bg-folha-clara p-5 text-center">
          <p className="text-sm text-stone-600">Código identificador do lote</p>
          <p className="mt-1 font-display text-4xl font-extrabold tracking-wider text-folha">{d.protocolo}</p>
          <p className="mt-3 inline-flex rounded-full bg-milho/30 px-3 py-1 text-xs font-bold">Pendente de conferência</p>
        </div>
      )}

      {d.tipo === 'critica' && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-5">
          <QrIlustrativo codigo={d.protocolo} />
          <p className="font-display text-2xl font-extrabold tracking-wider">{d.protocolo}</p>
          <p className="text-xs text-stone-500">Passe expresso: mostre na entrada da doca</p>
        </div>
      )}

      {d.tipo === 'comum' && (
        <Caixa>
          <dl>
            <Dado rotulo="Categoria">{d.categoria}</Dado>
            <Dado rotulo="Itens">{descreverItens(d)}</Dado>
          </dl>
        </Caixa>
      )}

      <OrientacoesEntrega d={dComEndereco} banco={app.banco} />

      {d.tipo === 'critica' && <p className="text-sm text-stone-600">A gestão do banco já foi avisada e a equipe da doca espera a carga.</p>}
    </Tela>
  )
}
