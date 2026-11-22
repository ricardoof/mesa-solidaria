// Formulário único de doação (habitantes e estabelecimentos).
// Diretrizes em painel no próprio formulário (alternativa B do cenário 4).
import { useState } from 'react'
import { useApp } from '../estado.jsx'
import { CATEGORIAS } from '../dados.js'
import { somaKg, validarDoacao } from '../validacoes.js'
import { Botao, Campo, GrupoOpcoes, Selecao, Tela } from '../componentes/ui.jsx'
import { ListaItens, PainelDiretrizes } from '../componentes/comuns.jsx'

const SUFIXO = { aceita: '', pausada: ' (estoque cheio hoje)', 'nao-aceita': ' (não aceito)' }

export default function NovaDoacao({ categoria = '', rascunho }) {
  const app = useApp()
  const loja = app.usuario?.perfil === 'estabelecimento'
  const [d, setD] = useState(rascunho ?? { categoria, itens: [{ id: 1, item: '', qtd: '' }], validade: '', modalidade: '' })
  const cat = CATEGORIAS.find((c) => c.nome === d.categoria)
  const total = somaKg(d.itens)

  async function enviar() {
    const ok = await app.processo(() => validarDoacao(d, app.banco.livreKg))
    if (!ok) return
    const dados = {
      tipo: 'comum',
      categoria: d.categoria,
      itens: d.itens.filter((i) => i.item).map((i) => ({ item: i.item, qtd: Number(i.qtd) })),
      totalKg: total,
      validade: d.validade,
      modalidade: d.modalidade,
    }
    if (d.modalidade === 'retirada') {
      app.ir('agendamento', { doacao: dados }, { salvarAtual: { rascunho: d } })
    } else {
      const id = app.registrarDoacao({ ...dados, reservaAte: new Date(Date.now() + 3 * 3600000) })
      app.ir('confirmacao', { id }, { limpar: true })
    }
  }

  return (
    <Tela
      titulo="Nova doação"
      subtitulo={loja ? 'O que a loja tem para doar hoje?' : 'O que você quer doar?'}
      rodape={<Botao onClick={enviar}>{d.modalidade === 'retirada' ? 'Continuar para o agendamento' : 'Enviar doação'}</Botao>}
    >
      <Selecao
        rotulo="Categoria"
        placeholder="Escolha a categoria"
        opcoes={CATEGORIAS.map((c) => ({ valor: c.nome, rotulo: c.nome + SUFIXO[c.status] }))}
        value={d.categoria}
        onChange={(e) => setD({ ...d, categoria: e.target.value, itens: [{ id: Date.now(), item: '', qtd: '' }] })}
      />

      <div>
        <p className="mb-2 text-sm font-bold">Itens</p>
        <ListaItens opcoes={cat?.itens ?? []} itens={d.itens} setItens={(itens) => setD({ ...d, itens })} />
        <p className="mt-1 text-xs text-stone-500">
          Total: {total} kg. O banco ainda recebe {app.banco.livreKg} kg hoje. A quantidade pode ser aproximada.
        </p>
      </div>

      {cat && !cat.semValidade && (
        <Campo rotulo="Validade (a mais próxima)" type="date" value={d.validade} onChange={(e) => setD({ ...d, validade: e.target.value })} />
      )}

      <GrupoOpcoes
        rotulo="Como a doação chega ao banco?"
        colunas={1}
        valor={d.modalidade}
        onChange={(v) => setD({ ...d, modalidade: v })}
        opcoes={[
          { valor: 'entrega', rotulo: loja ? 'A loja leva até o banco' : 'Eu levo até o banco', detalhe: 'O espaço fica reservado por 3 horas.' },
          { valor: 'retirada', rotulo: 'Retirada por voluntário', detalhe: `Busca em ${app.usuario?.endereco}, no horário que você escolher.` },
        ]}
      />

      <PainelDiretrizes />
    </Tela>
  )
}
