import { TIPOS_NAO_ACEITOS } from './dados.js'

export function validarLogin({ usuario, senha }, rotulo = 'e-mail') {
  if (!usuario?.trim() || !senha) return `Erro no login: preencha ${rotulo} e senha.`
  if (senha.length < 6) return 'Erro no login: a senha tem pelo menos 6 caracteres.'
  return null
}

export function validarCadastro(d, prefixo = 'Erro no cadastro') {
  const faltando = []
  if (!d.nome?.trim()) faltando.push('nome')
  if (!d.email?.trim()) faltando.push('e-mail')
  if (!d.telefone?.trim()) faltando.push('telefone')
  if (!d.senha) faltando.push('senha')
  if (d.exigeEndereco && !d.endereco?.trim()) faltando.push('endereço')
  if (faltando.length) return `${prefixo}: preencha ${faltando.join(', ')}.`
  if (!/^\S+@\S+\.\S+$/.test(d.email)) return `${prefixo}: o e-mail precisa ter o formato nome@dominio.com.`
  if (d.senha.length < 6) return `${prefixo}: a senha precisa ter pelo menos 6 caracteres.`
  return null
}

export function validarDoacao(d, prefixo = 'Erro na abertura') {
  if (!d.tipo) return `${prefixo}: escolha o tipo de alimento.`
  if (!d.quantidade?.trim()) return `${prefixo}: informe a quantidade aproximada.`
  if (!d.modalidade) return `${prefixo}: escolha entre retirada e entrega.`
  return null
}

export function validarItens(itens, prefixo) {
  const preenchidos = itens.filter((i) => i.item || i.qtd)
  if (!preenchidos.length) return `${prefixo}: adicione pelo menos um item com quantidade.`
  const incompleto = preenchidos.find((i) => !i.item || !(Number(i.qtd) > 0))
  if (incompleto) return `${prefixo}: escolha o item e informe uma quantidade maior que zero em todas as linhas.`
  const nomes = preenchidos.map((i) => i.item)
  const repetido = nomes.find((n, idx) => nomes.indexOf(n) !== idx)
  if (repetido) return `${prefixo}: ${repetido} aparece duas vezes. Junte as quantidades em uma linha só.`
  return null
}

export function validarAlimento(d) {
  if (!d.tipo || !d.quantidade?.trim() || !d.validade)
    return 'Dados incompletos: preencha tipo de alimento, quantidade e validade.'
  if (TIPOS_NAO_ACEITOS.includes(d.tipo))
    return `Dados inválidos: ${d.tipo.toLowerCase()} não é aceito pelo banco. Consulte as diretrizes.`
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const validade = new Date(`${d.validade}T00:00:00`)
  if (validade < hoje) return 'Dados inválidos: a data de validade já passou.'
  const dias = Math.round((validade - hoje) / 86400000)
  if (d.tipo === 'Laticínios' && dias < 3)
    return 'Dados inválidos: laticínios precisam de pelo menos 3 dias de validade.'
  return null
}
