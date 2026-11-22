// Habitantes, Cenário 4: Roberto não sabe se a destinatária aceita seus alimentos
// Variante A = diretrizes em tela própria; B = painel dentro do cadastro
import { useState } from 'react'
import { BookOpen, ChevronDown, CircleCheck, CircleX, Package, Snowflake } from 'lucide-react'
import { FIM, Palco, useFluxo } from '../../fluxo.jsx'
import { BANCO, DIRETRIZES, TIPOS_ALIMENTO, TIPOS_NAO_ACEITOS, gerarCodigo } from '../../dados.js'
import { validarAlimento } from '../../validacoes.js'
import { Botao, Caixa, Campo, Dado, Selecao, Tela } from '../../componentes/ui.jsx'
import { TelaFim } from '../../componentes/compartilhadas.jsx'

function ListaDiretrizes() {
  const grupo = (titulo, Icone, cor, itens) => (
    <section>
      <h2 className="mb-2 flex items-center gap-2 font-display font-bold">
        <Icone size={18} className={cor} aria-hidden /> {titulo}
      </h2>
      <ul className="space-y-1.5 text-sm leading-relaxed">
        {itens.map((t) => (
          <li key={t} className="border-l-2 border-stone-200 pl-3">{t}</li>
        ))}
      </ul>
    </section>
  )
  return (
    <div className="space-y-5">
      {grupo('Aceitos', CircleCheck, 'text-folha', DIRETRIZES.aceitos)}
      {grupo('Não aceitos', CircleX, 'text-tomate', DIRETRIZES.naoAceitos)}
      {grupo('Conservação', Snowflake, 'text-sky-700', DIRETRIZES.conservacao)}
    </div>
  )
}

export default function Cenario4({ variante, reiniciar }) {
  const f = useFluxo('Cadastro de doação de alimentos')
  const [d, setD] = useState({ tipo: '', quantidade: '', validade: '' })
  const [painelAberto, setPainelAberto] = useState(false)
  const [protocolo, setProtocolo] = useState('')

  async function enviar() {
    f.acao('Enviar dados dos alimentos excedentes')
    const ok = await f.processo('Validar dados da doação', {
      verificar: () => validarAlimento(d),
      falhaSimulada: 'Dados inválidos ou incompletos: não foi possível validar agora. Envie de novo.',
    })
    if (ok) {
      setProtocolo(gerarCodigo('DOA'))
      f.ir('Confirmação e instruções de entrega', 'p: Cadastro registrado com sucesso')
    }
  }

  function alternarPainel() {
    if (!painelAberto) f.acao('Consultar diretrizes (painel no cadastro)')
    setPainelAberto(!painelAberto)
  }

  return (
    <Palco fluxo={f}>
      {f.cena === 'Cadastro de doação de alimentos' && (
        <Tela titulo="Cadastro de doação de alimentos" subtitulo="O que você tem para doar?" rodape={<Botao onClick={enviar}>Enviar dados</Botao>}>
          <Selecao
            rotulo="Tipo de alimento"
            opcoes={[...TIPOS_ALIMENTO, ...TIPOS_NAO_ACEITOS]}
            value={d.tipo}
            onChange={(e) => setD({ ...d, tipo: e.target.value })}
          />
          <Campo rotulo="Quantidade" placeholder="Ex.: 12 kg" value={d.quantidade} onChange={(e) => setD({ ...d, quantidade: e.target.value })} />
          <Campo rotulo="Validade" type="date" value={d.validade} onChange={(e) => setD({ ...d, validade: e.target.value })} />

          {variante === 'A' ? (
            <Botao variante="secundario" icone={BookOpen} onClick={() => f.ir('Diretrizes de doação e conservação', 'u: Consultar diretrizes e alimentos aceitos')}>
              Consultar diretrizes e alimentos aceitos
            </Botao>
          ) : (
            <div className="rounded-xl border border-folha/30 bg-folha-clara">
              <button
                type="button"
                onClick={alternarPainel}
                aria-expanded={painelAberto}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-bold text-folha"
              >
                <span className="flex items-center gap-2"><BookOpen size={18} aria-hidden /> Diretrizes: o que é aceito</span>
                <ChevronDown size={18} className={`transition-transform ${painelAberto ? 'rotate-180' : ''}`} aria-hidden />
              </button>
              {painelAberto && (
                <div className="border-t border-folha/20 bg-white px-4 py-4">
                  <ListaDiretrizes />
                  <button type="button" onClick={alternarPainel} className="mt-4 text-sm font-bold text-folha underline underline-offset-4">Fechar</button>
                </div>
              )}
            </div>
          )}
        </Tela>
      )}

      {f.cena === 'Diretrizes de doação e conservação' && (
        <Tela
          titulo="Diretrizes de doação e conservação"
          subtitulo={BANCO.nome}
          voltar={{ rotulo: 'Retornar ao cadastro', acao: () => f.ir('Cadastro de doação de alimentos', 'u: Retornar ao cadastro') }}
          rodape={<Botao variante="secundario" onClick={() => f.ir('Cadastro de doação de alimentos', 'u: Retornar ao cadastro')}>Retornar ao cadastro</Botao>}
        >
          <ListaDiretrizes />
        </Tela>
      )}

      {f.cena === 'Confirmação e instruções de entrega' && (
        <Tela titulo="Doação aceita" subtitulo={`Protocolo ${protocolo}`} rodape={<Botao onClick={() => f.ir(FIM, 'u: Concluir')}>Concluir</Botao>}>
          <Caixa>
            <dl>
              <Dado rotulo="Alimento">{d.tipo}</Dado>
              <Dado rotulo="Quantidade">{d.quantidade}</Dado>
            </dl>
          </Caixa>
          <Caixa titulo="Como entregar" icone={Package} tom="folha">
            <dl>
              <Dado rotulo="Local">{BANCO.endereco}</Dado>
              <Dado rotulo="Horário">Seg a sex, 8h às 17h</Dado>
              <Dado rotulo="Embalagem">Caixas ventiladas ou sacolas limpas</Dado>
            </dl>
          </Caixa>
        </Tela>
      )}

      {f.cena === FIM && (
        <TelaFim titulo="Tudo certo" texto="Roberto confirmou antes de sair de casa que os alimentos são aceitos." reiniciar={reiniciar} />
      )}
    </Palco>
  )
}
